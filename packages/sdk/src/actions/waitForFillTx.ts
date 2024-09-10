import { Address, parseAbiItem, parseEventLogs } from "viem";
import { ConfiguredPublicClient } from "../types";
import { spokePoolAbi } from "../abis/SpokePool";
import { FillStatus } from "./getFillByDepositTx";
import { QuoteResponse } from "./getQuote";

export type WaitForFillTxParams = Pick<QuoteResponse, "deposit"> & {
  depositId: number;
  destinationSpokePoolAddress: Address;
  destinationPublicClient: ConfiguredPublicClient; // destination client
};

export async function waitForFillTx(
  params: WaitForFillTxParams,
): Promise<FillStatus> {
  const {
    depositId,
    destinationPublicClient,
    destinationSpokePoolAddress,
    deposit,
  } = params;

  return new Promise<FillStatus>((resolve, reject) => {
    const unwatch = destinationPublicClient.watchContractEvent({
      address: destinationSpokePoolAddress,
      abi: spokePoolAbi,
      eventName: "FilledV3Relay",
      args: { depositId },
      onLogs: async ([fillLog]) => {
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
