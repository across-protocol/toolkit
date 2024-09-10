import { parseEventLogs, TransactionReceipt } from "viem";
import { spokePoolAbi } from "../abis/SpokePool";

export function getDepositLogs(receipt: TransactionReceipt) {
  const parsedLogs = parseEventLogs({
    abi: spokePoolAbi,
    eventName: "V3FundsDeposited",
    logs: receipt.logs,
  });

  const depositEvent = parsedLogs.find(
    (log) => log.args.depositor === receipt.from,
  );

  return depositEvent;
}
