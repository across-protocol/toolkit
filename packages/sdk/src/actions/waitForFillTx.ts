import { parseAbiItem, parseEventLogs } from "viem";
import { ConfiguredPublicClient } from "../types";
import { spokePoolAbi } from "../abis/SpokePool";
import { FillStatus } from "./getFillByDepositTx";
import { QuoteResponse } from "./getQuote";

export type WaitForFillTxParams = Pick<QuoteResponse, "deposit"> & {
  depositId: number;
  destinationPublicClient: ConfiguredPublicClient; // destination client
  fromBlock: bigint;
};

export async function waitForFillTx(
  params: WaitForFillTxParams,
): Promise<FillStatus> {
  const { depositId, destinationPublicClient, deposit, fromBlock } = params;

  return new Promise<FillStatus>((resolve, reject) => {
    const unwatch = destinationPublicClient.watchContractEvent({
      address: deposit.destinationSpokePoolAddress,
      abi: spokePoolAbi,
      eventName: "FilledV3Relay",
      args: { depositId, originChainId: BigInt(deposit.originChainId) },
      pollingInterval: 3_000,
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
              destinationPublicClient.getTransactionReceipt({
                hash: fillLog.transactionHash,
              }),
              destinationPublicClient.getBlock({
                blockNumber: fillLog.blockNumber,
              }),
            ]);

            // Stop watching
            unwatch();

            // if message in deposit, check for CallsFailed event
            if (deposit.message !== "0x") {
              const [callsFailedLog] = parseEventLogs({
                abi: [
                  parseAbiItem(
                    "event CallsFailed(Call[] calls, address indexed fallbackRecipient)",
                  ),
                ],
                logs: fillTxReceipt.logs,
              });
              resolve({
                actionSuccess: !callsFailedLog,
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
