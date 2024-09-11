import { parseEventLogs, TransactionReceipt } from "viem";
import { spokePoolAbi } from "../abis/SpokePool";

export type GetDepositLogsParams = {
  receipt: TransactionReceipt;
};

export function getDepositLogs({ receipt }: GetDepositLogsParams) {
  const parsedLogs = parseEventLogs({
    abi: spokePoolAbi,
    eventName: "V3FundsDeposited",
    logs: receipt.logs,
  });

  return parsedLogs?.[0];
}
