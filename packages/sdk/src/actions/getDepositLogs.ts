import { parseEventLogs, TransactionReceipt } from "viem";
import { spokePoolAbi } from "../abis/SpokePool";

export function getDepositLogs(receipt: TransactionReceipt) {
  const parsedLogs = parseEventLogs({
    abi: spokePoolAbi,
    eventName: "V3FundsDeposited",
    logs: receipt.logs,
  });

  return parsedLogs?.[0];
}
