import { Address, Hash, Hex, Log, parseEventLogs } from "viem";
import { ConfiguredPublicClient } from "../types/index.js";
import { spokePoolAbiV3, spokePoolAbiV3_5 } from "../abis/SpokePool/index.js";
import { FillStatus, waitForFillByDepositTx } from "./getFillByDepositTx.js";
import {
  bytes32ToAddress,
  LoggerT,
  MulticallHandlerAbi,
} from "../utils/index.js";

export type WaitForFillTxParams = {
  depositId: bigint | number;
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
  const { logger } = params;

  try {
    const status = await Promise.race([
      waitForV3FillEvent(params),
      waitForV3_5FillEvent(params),
    ]);
    return status;
  } catch (error) {
    logger
      ? logger.error("Error waiting for fill events", error)
      : console.error("Error waiting for fill events", error);
    throw error;
  }
}

export async function waitForV3FillEvent(
  params: WaitForFillTxParams,
): Promise<FillStatus> {
  const { depositId, destinationChainClient, deposit, fromBlock, logger } =
    params;

  return new Promise<FillStatus>((resolve, reject) => {
    const unwatch = destinationChainClient.watchContractEvent({
      address: deposit.destinationSpokePoolAddress,
      abi: spokePoolAbiV3,
      eventName: "FilledV3Relay",
      args: {
        depositId: Number(depositId),
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
            ? logger.debug("V3 Fill events found in block", fillLogs)
            : console.log("V3 Fill events found in block", fillLogs);
        }
        const [fillLog] = fillLogs;
        if (fillLog) {
          try {
            const [fillTxReceipt, fillBlock] = await Promise.all([
              destinationChainClient.getTransactionReceipt({
                hash: fillLog.transactionHash,
              }),
              destinationChainClient.getBlock({
                blockNumber: fillLog.blockNumber,
              }),
            ]);

            const parsedFillEvent = parseFillLogs([fillLog]);
            unwatch();

            if (deposit.message !== "0x") {
              const logs = parseEventLogs({
                abi: MulticallHandlerAbi,
                logs: fillTxReceipt.logs,
              });

              logger?.debug("Fill Logs", logs);

              const actionSuccess = !logs.some(
                (log) => log.eventName === "CallsFailed",
              );
              resolve({
                actionSuccess,
                fillTxReceipt: fillTxReceipt,
                fillTxTimestamp: fillBlock.timestamp,
                parsedFillEvent,
              });
            }

            resolve({
              fillTxReceipt,
              fillTxTimestamp: fillBlock.timestamp,
              parsedFillEvent,
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

export async function waitForV3_5FillEvent(
  params: WaitForFillTxParams,
): Promise<FillStatus> {
  const { depositId, destinationChainClient, deposit, fromBlock, logger } =
    params;

  return new Promise<FillStatus>((resolve, reject) => {
    const unwatch = destinationChainClient.watchContractEvent({
      address: deposit.destinationSpokePoolAddress,
      abi: spokePoolAbiV3_5,
      eventName: "FilledRelay",
      args: {
        depositId: BigInt(depositId),
        originChainId: BigInt(deposit.originChainId),
      },
      fromBlock,
      onError: async (error) => {
        logger
          ? logger.error("Watch FilledRelay event error", error)
          : console.error("Watch FilledRelay event error", error);

        unwatch();
        reject(error);
      },
      onLogs: async (fillLogs) => {
        if (fillLogs.length) {
          logger
            ? logger.debug("V3_5 Fill events found in block", fillLogs)
            : console.log("V3_5 Fill events found in block", fillLogs);
        }
        const [fillLog] = fillLogs;
        if (fillLog) {
          try {
            const [fillTxReceipt, fillBlock] = await Promise.all([
              destinationChainClient.getTransactionReceipt({
                hash: fillLog.transactionHash,
              }),
              destinationChainClient.getBlock({
                blockNumber: fillLog.blockNumber,
              }),
            ]);
            const parsedFillEvent = parseFillLogs([fillLog]);

            unwatch();

            if (deposit.message !== "0x") {
              const logs = parseEventLogs({
                abi: MulticallHandlerAbi,
                logs: fillTxReceipt.logs,
              });

              logger?.debug("Fill Logs", logs);

              const actionSuccess = !logs.some(
                (log) => log.eventName === "CallsFailed",
              );
              resolve({
                actionSuccess,
                fillTxReceipt: fillTxReceipt,
                fillTxTimestamp: fillBlock.timestamp,
                parsedFillEvent,
              });
            }

            resolve({
              fillTxReceipt,
              fillTxTimestamp: fillBlock.timestamp,
              parsedFillEvent,
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

export function parseFillLogs(
  logs: Log[],
  filter?: Partial<{
    inputToken: Address;
    outputToken: Address;
    originChainId: bigint;
    inputAmount: bigint;
    outputAmount: bigint;
    depositor: Address;
    depositId: bigint | number;
  }>,
) {
  const blockData = {
    depositTxHash: logs[0]!.blockHash!,
    depositTxBlock: logs[0]!.blockNumber!,
  };

  // Parse V3_5 Logs
  const parsedV3_5Logs = parseEventLogs({
    abi: spokePoolAbiV3_5,
    eventName: "FilledRelay",
    logs,
    args: {
      ...filter,
      depositId: filter?.depositId ? BigInt(filter?.depositId) : undefined,
    },
  });
  const v3_5Log = parsedV3_5Logs?.[0];

  if (v3_5Log) {
    return {
      ...blockData,
      inputToken: bytes32ToAddress(v3_5Log.args.inputToken),
      outputToken: bytes32ToAddress(v3_5Log.args.outputToken),
      inputAmount: v3_5Log.args.inputAmount,
      outputAmount: v3_5Log.args.outputAmount,
      repaymentChainId: v3_5Log.args.repaymentChainId,
      originChainId: v3_5Log.args.originChainId,
      depositId: v3_5Log.args.depositId,
      fillDeadline: v3_5Log.args.fillDeadline,
      exclusivityDeadline: v3_5Log.args.exclusivityDeadline,
      exclusiveRelayer: bytes32ToAddress(v3_5Log.args.exclusiveRelayer),
      relayer: bytes32ToAddress(v3_5Log.args.relayer),
      depositor: bytes32ToAddress(v3_5Log.args.depositor),
      recipient: bytes32ToAddress(v3_5Log.args.recipient),
      messageHash: v3_5Log.args.messageHash,
      relayExecutionInfo: {
        ...v3_5Log.args.relayExecutionInfo,
        updatedRecipient: bytes32ToAddress(
          v3_5Log.args.relayExecutionInfo.updatedRecipient,
        ),
        fillType: FillType?.[v3_5Log.args.relayExecutionInfo.fillType],
      },
    };
  }

  // Parse V3 Logs
  const parsedV3Logs = parseEventLogs({
    abi: spokePoolAbiV3,
    eventName: "FilledV3Relay",
    logs,
    args: { ...filter, depositId: Number(filter?.depositId) },
  });
  const v3Log = parsedV3Logs?.[0];

  if (v3Log) {
    return {
      ...blockData,
      inputToken: v3Log.args.inputToken,
      outputToken: v3Log.args.outputToken,
      inputAmount: v3Log.args.inputAmount,
      outputAmount: v3Log.args.outputAmount,
      repaymentChainId: v3Log.args.repaymentChainId,
      originChainId: v3Log.args.originChainId,
      depositId: v3Log.args.depositId,
      fillDeadline: v3Log.args.fillDeadline,
      exclusivityDeadline: v3Log.args.exclusivityDeadline,
      exclusiveRelayer: v3Log.args.exclusiveRelayer,
      relayer: v3Log.args.relayer,
      depositor: v3Log.args.depositor,
      recipient: v3Log.args.recipient,
      message: v3Log.args.message,
      relayExecutionInfo: {
        ...v3Log.args.relayExecutionInfo,
        fillType: FillType?.[v3Log.args.relayExecutionInfo.fillType],
      },
    };
  }
}

export const FillType: { [key: number]: string } = {
  // Fast fills are normal fills that do not replace a slow fill request.
  0: "FastFill",
  // Replaced slow fills are fast fills that replace a slow fill request. This type is used by the Dataworker
  // to know when to send excess funds from the SpokePool to the HubPool because they can no longer be used
  // for a slow fill execution.
  1: "ReplacedSlowFill",
  2: "SlowFill",
};
