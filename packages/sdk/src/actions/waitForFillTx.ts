import { Address, Hash, Hex, parseEventLogs } from "viem";
import { ConfiguredPublicClient } from "../types";
import { spokePoolAbi } from "../abis/SpokePool";
import { FillStatus, waitForFillByDepositTx } from "./getFillByDepositTx";
import { LoggerT, MulticallHandlerAbi } from "../utils";

export type WaitForFillTxParams = {
  depositId: number;
  deposit: {
    originChainId: number;
    destinationChainId: number;
    destinationSpokePoolAddress: Address;
    message: Hex;
  };
  destinationChainClient: ConfiguredPublicClient;
  fromBlock: bigint;
  depositTxHash?: Hash;
  logger?: LoggerT;
};

export async function waitForFillTx(
  params: WaitForFillTxParams,
): Promise<FillStatus> {
  const {
    depositId,
    destinationChainClient,
    deposit,
    fromBlock,
    logger,
    depositTxHash,
  } = params;

  return new Promise<FillStatus>((resolve, reject) => {
    const unwatch = destinationChainClient.watchContractEvent({
      address: deposit.destinationSpokePoolAddress,
      abi: spokePoolAbi,
      eventName: "FilledV3Relay",
      args: {
        depositId,
        originChainId: BigInt(deposit.originChainId),
      },
      fromBlock,
      onError: async (error) => {
        logger
          ? logger.error("Watch FilledV3Relay event error", error)
          : console.error("Watch FilledV3Relay event error", error);

        // If RPC errors when attempting to use an event filter, revert to using scraper/getLogs combo
        if (error.name === "InvalidInputRpcError" && depositTxHash) {
          logger?.debug("Error getFillByDepositTx()");

          unwatch();
          const response = await waitForFillByDepositTx({
            deposit: {
              ...deposit,
              depositTxHash,
              depositId,
            },
            destinationChainClient,
            fromBlock,
          });
          resolve(response);
        }
      },
      onLogs: async (fillLogs) => {
        if (fillLogs.length) {
          logger
            ? logger.debug("Fill events found in block", fillLogs)
            : console.log("Fill events found in block", fillLogs);
        }
        const [fillLog] = fillLogs;
        if (fillLog) {
          try {
            // Retrieve the transaction receipt and block information
            const [fillTxReceipt, fillBlock] = await Promise.all([
              destinationChainClient.getTransactionReceipt({
                hash: fillLog.transactionHash,
              }),
              destinationChainClient.getBlock({
                blockNumber: fillLog.blockNumber,
              }),
            ]);

            // Stop watching
            unwatch();

            // if message in deposit, check for CallsFailed event
            if (deposit.message !== "0x") {
              const logs = parseEventLogs({
                abi: MulticallHandlerAbi,
                logs: fillTxReceipt.logs,
              });
              // TODO: will this fail silently?

              logger?.debug("Fill Logs", logs);

              const actionSuccess = !logs.some(
                (log) => log.eventName === "CallsFailed",
              );
              resolve({
                actionSuccess,
                fillTxReceipt: fillTxReceipt,
                fillTxTimestamp: fillBlock.timestamp,
              });
            }

            resolve({
              fillTxReceipt,
              fillTxTimestamp: fillBlock.timestamp,
            });
          } catch (error) {
            unwatch();
            reject(error);
          }
        }
      },
    });
  });
}
