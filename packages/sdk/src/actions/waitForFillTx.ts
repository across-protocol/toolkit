import { Address, Hex, parseAbiItem, parseEventLogs } from "viem";
import { ConfiguredPublicClient } from "../types";
import { spokePoolAbi } from "../abis/SpokePool";
import { FillStatus } from "./getFillByDepositTx";
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
  logger?: LoggerT;
};

export async function waitForFillTx(
  params: WaitForFillTxParams,
): Promise<FillStatus> {
  const { depositId, destinationChainClient, deposit, fromBlock, logger } =
    params;

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
      onError: (error) => {
        console.log("Watch FilledV3Relay event error", error);
      },
      onLogs: async (fillLogs) => {
        if (fillLogs.length) {
          console.log("Fill events found in block", fillLogs);
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
