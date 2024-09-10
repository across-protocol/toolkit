import { parseAbiItem, parseEventLogs, TransactionReceipt } from "viem";
import { spokePoolAbi } from "../abis/SpokePool";

export function getFillLogs(receipt: TransactionReceipt) {
  const parsedLogs = parseEventLogs({
    abi: [
      spokePoolAbi,
      parseAbiItem(
        "event CallsFailed(Call[] calls, address indexed fallbackRecipient)",
      ),
    ],
    logs: receipt.logs,
  });

  return parsedLogs;
}
