import { Address, parseEventLogs, TransactionReceipt } from "viem";
import { spokePoolAbi } from "../abis/SpokePool";
import { Deposit } from "../types";

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

export type GetDepositLogsReturnType = ReturnType<typeof getDepositFromLogs>;

export function getDepositFromLogs({
  originChainId,
  receipt,
  filter,
}: GetDepositLogsParams): Deposit | undefined {
  const parsedLogs = parseEventLogs({
    abi: spokePoolAbi,
    eventName: "V3FundsDeposited",
    logs: receipt.logs,
    args: filter,
  });

  if (parsedLogs.length > 1) {
    throw new Error("Multiple deposit logs found. Specify filter");
  }

  const depositLog = parsedLogs[0];

  if (!depositLog) {
    return undefined;
  }

  return {
    depositId: depositLog.args.depositId,
    depositTxHash: receipt.transactionHash,
    depositTxBlock: receipt.blockNumber,
    originChainId,
    destinationChainId: Number(depositLog.args.destinationChainId),
    inputToken: depositLog.args.inputToken,
    outputToken: depositLog.args.outputToken,
    inputAmount: depositLog.args.inputAmount,
    outputAmount: depositLog.args.outputAmount,
    quoteTimestamp: depositLog.args.quoteTimestamp,
    fillDeadline: depositLog.args.fillDeadline,
    exclusivityDeadline: depositLog.args.exclusivityDeadline,
    depositor: depositLog.args.depositor,
    recipient: depositLog.args.recipient,
    exclusiveRelayer: depositLog.args.exclusiveRelayer,
    message: depositLog.args.message,
    status: "pending",
  };
}
