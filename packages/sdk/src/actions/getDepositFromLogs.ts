import { Address, Log, parseEventLogs, TransactionReceipt } from "viem";
import { spokePoolAbiV4 } from "../abis/SpokePool/index.js";
import { Deposit, DepositLog } from "../types/index.js";
import { bytes32ToAddress } from "../utils/hex.js";

export type GetDepositLogsParams = {
  originChainId: number;
  receipt: TransactionReceipt;
  filter?: Partial<{
    inputToken: Address;
    outputToken: Address;
    destinationChainId: bigint;
    inputAmount: bigint;
    outputAmount: bigint;
  }>;
};

export type GetDepositLogsReturnType = ReturnType<typeof parseDepositLogs>;

export function parseDepositLogs(
  logs: Log[],
  filter?: Partial<{
    inputToken: Address;
    outputToken: Address;
    destinationChainId: bigint;
    inputAmount: bigint;
    outputAmount: bigint;
  }>,
): DepositLog | undefined {
  const blockData = {
    depositTxHash: logs[0]!.blockHash!,
    depositTxBlock: logs[0]!.blockNumber!,
  };
  // Parse V4 Logs
  const parsedV4Logs = parseEventLogs({
    abi: spokePoolAbiV4,
    eventName: "FundsDeposited",
    logs,
    args: filter,
  });

  const v4Log = parsedV4Logs?.[0];
  if (v4Log) {
    return {
      ...blockData,
      depositId: v4Log.args.depositId,
      inputToken: bytes32ToAddress(v4Log.args.inputToken),
      outputToken: bytes32ToAddress(v4Log.args.outputToken),
      inputAmount: v4Log.args.inputAmount,
      outputAmount: v4Log.args.outputAmount,
      destinationChainId: Number(v4Log.args.destinationChainId),
      message: v4Log.args.message,
      depositor: bytes32ToAddress(v4Log.args.depositor),
      recipient: bytes32ToAddress(v4Log.args.recipient),
      exclusiveRelayer: bytes32ToAddress(v4Log.args.exclusiveRelayer),
      quoteTimestamp: v4Log.args.quoteTimestamp,
      fillDeadline: v4Log.args.fillDeadline,
      exclusivityDeadline: v4Log.args.exclusivityDeadline,
      status: "pending",
    };
  }

  // Parse V3 Logs
  const parsedV3Logs = parseEventLogs({
    abi: spokePoolAbiV4,
    eventName: "V3FundsDeposited",
    logs,
    args: filter,
  });
  const v3Log = parsedV3Logs?.[0];
  if (v3Log) {
    return {
      ...blockData,
      depositId: BigInt(v3Log.args.depositId),
      inputToken: v3Log.args.inputToken,
      outputToken: v3Log.args.outputToken,
      inputAmount: v3Log.args.inputAmount,
      outputAmount: v3Log.args.outputAmount,
      destinationChainId: Number(v3Log.args.destinationChainId),
      message: v3Log.args.message,
      depositor: v3Log.args.depositor,
      recipient: v3Log.args.recipient,
      exclusiveRelayer: v3Log.args.exclusiveRelayer,
      quoteTimestamp: v3Log.args.quoteTimestamp,
      fillDeadline: v3Log.args.fillDeadline,
      exclusivityDeadline: v3Log.args.exclusivityDeadline,
      status: "pending",
    };
  }

  return undefined;
}

export function getDepositFromLogs(params: GetDepositLogsParams): Deposit {
  const { originChainId, receipt, filter } = params;
  const standardizedDeposit = parseDepositLogs(receipt.logs, filter);

  if (!standardizedDeposit) {
    throw new Error("No deposit log found.");
  }

  return {
    ...standardizedDeposit,
    depositTxHash: receipt.transactionHash,
    depositTxBlock: receipt.blockNumber,
    originChainId: originChainId,
  };
}
