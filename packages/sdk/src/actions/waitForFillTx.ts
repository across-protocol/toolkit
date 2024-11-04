import { Address, Hash, Hex, parseEventLogs } from "viem";
import { ConfiguredPublicClient } from "../types/index.js";
import { spokePoolAbi } from "../abis/SpokePool.js";
import { FillStatus, waitForFillByDepositTx } from "./getFillByDepositTx.js";
import { LoggerT, MulticallHandlerAbi } from "../utils/index.js";

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
  try {
    const statusFromFilter = await waitForFillTxEvent(params);
    return statusFromFilter;
  } catch (e) {
    const message =
      "Event filtering currently disabled for this RPC provider, switching to getFillByDepositTx()";

    params?.logger
      ? params.logger.error(message, {
          cause: e,
        })
      : console.error(message, {
          cause: e,
        });

    const statusFromLogs = await waitForFillByDepositTx({
      ...params,
      deposit: {
        ...params.deposit,
        depositTxHash: params.depositTxHash,
        depositId: params.depositId,
      },
    });
    return statusFromLogs;
  }
}

export async function waitForFillTxEvent(
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
      onError: async (error) => {
        logger
          ? logger.error("Watch FilledV3Relay event error", error)
          : console.error("Watch FilledV3Relay event error", error);

        unwatch();
        reject(error);
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
