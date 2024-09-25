import { fetchIndexerApi } from "../utils";
import { DepositStatus } from "./waitForDepositTx";
import {
  Hash,
  parseAbiItem,
  parseEventLogs,
  PublicClient,
  TransactionReceipt,
} from "viem";
import { Quote } from "./getQuote";
import { spokePoolAbi } from "../abis/SpokePool";
import { MAINNET_INDEXER_API } from "../constants";
import { NoFillLogError } from "../errors";
import { IndexerStatusResponse } from "../types";

export type GetFillByDepositTxParams = Pick<Quote, "deposit"> & {
  depositId: DepositStatus["depositId"];
  depositTransactionHash: Hash;
  fromBlock: bigint;
  destinationChainClient: PublicClient;
  indexerUrl?: string;
};

export async function getFillByDepositTx(
  params: GetFillByDepositTxParams,
): Promise<FillStatus> {
  const {
    depositTransactionHash,
    depositId,
    deposit,
    fromBlock,
    destinationChainClient,
    indexerUrl = MAINNET_INDEXER_API,
  } = params;

  try {
    const data = await fetchIndexerApi<IndexerStatusResponse>(
      `${indexerUrl}/deposit/status`,
      {
        depositId,
        originChainId: deposit.originChainId,
      },
    );

    if (data?.status === "filled" && data?.fillTx) {
      const fillTxReceipt = await destinationChainClient.getTransactionReceipt({
        hash: data.fillTx,
      });
      const fillTxBlock = await destinationChainClient.getBlock({
        blockNumber: fillTxReceipt.blockNumber,
      });

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

        return {
          actionSuccess: !callsFailedLog,
          fillTxReceipt: fillTxReceipt,
          fillTxTimestamp: fillTxBlock.timestamp,
        };
      }

      return {
        fillTxReceipt,
        fillTxTimestamp: fillTxBlock.timestamp,
      };
    }
    // TODO: do we want to handle pending states?
  } catch (e) {
    console.error(e);
  }

  const fillEventFilter =
    await destinationChainClient.createContractEventFilter({
      address: deposit.destinationSpokePoolAddress,
      abi: spokePoolAbi,
      eventName: "FilledV3Relay",
      args: {
        depositId,
        originChainId: BigInt(deposit.originChainId),
      },
      fromBlock,
    });

  const [fillEvent] = await destinationChainClient.getFilterLogs({
    filter: fillEventFilter,
  });

  if (!fillEvent) {
    throw new NoFillLogError(
      depositId,
      depositTransactionHash,
      deposit.destinationChainId,
    );
  }

  const [fillTxReceipt, fillBlock] = await Promise.all([
    destinationChainClient.getTransactionReceipt({
      hash: fillEvent.transactionHash,
    }),
    destinationChainClient.getBlock({
      blockNumber: fillEvent.blockNumber,
    }),
  ]);

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
    return {
      actionSuccess: !callsFailedLog,
      fillTxReceipt: fillTxReceipt,
      fillTxTimestamp: fillBlock.timestamp,
    };
  }

  return {
    fillTxReceipt: fillTxReceipt,
    fillTxTimestamp: fillBlock.timestamp,
  };
}

export type FillStatus = {
  actionSuccess?: boolean; // if deposit has message
  fillTxReceipt: TransactionReceipt;
  fillTxTimestamp: bigint;
};
