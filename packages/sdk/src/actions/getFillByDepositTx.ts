import { buildSearchParams } from "../utils";
import { DepositStatus } from "./waitForDepositTx";
import {
  Hash,
  parseAbiItem,
  parseEventLogs,
  PublicClient,
  TransactionReceipt,
} from "viem";
import { QuoteResponse } from "./getQuote";
import { spokePoolAbi } from "../abis/SpokePool";
import { MAINNET_INDEXER_API } from "../constants";
import { HttpError, NoFillLogError } from "../errors";

export type GetFillByDepositTxParams = DepositStatus &
  Pick<QuoteResponse, "deposit"> & {
    fromBlock: bigint;
    toBlock: bigint;
    destinationChainClient: PublicClient;
    indexerUrl?: string;
  };

export async function getFillByDepositTx(
  params: GetFillByDepositTxParams,
): Promise<FillStatus> {
  const {
    depositTxReceipt,
    depositId,
    deposit,
    fromBlock,
    toBlock,
    destinationChainClient,
    indexerUrl = MAINNET_INDEXER_API,
  } = params;

  try {
    const url = `${indexerUrl}/deposit/status?${buildSearchParams({
      depositId,
      originChainId: deposit.originChainId,
    })}`;
    const res = await fetch(url);

    if (res.status !== 200) {
      throw new HttpError(res.status, url);
    }

    const data = (await res.json()) as {
      status: "filled" | "pending";
      fillTx: Hash | null;
    };
    if (data?.status === "filled" && data.fillTx) {
      const fillTxReceipt = await destinationChainClient.getTransactionReceipt({
        hash: data.fillTx,
      });
      const fillTxBlock = await destinationChainClient.getBlock({
        blockNumber: fillTxReceipt.blockNumber,
      });

      return {
        fillTxReceipt,
        fillTxTimestamp: fillTxBlock.timestamp,
      };
    }
  } catch (e) {
    console.error(e);
  }

  const fillEventFilter =
    await destinationChainClient.createContractEventFilter({
      address: deposit.spokePoolAddress, // TODO get destination spokePool Address
      abi: spokePoolAbi,
      eventName: "FilledV3Relay",
      args: {
        depositId,
      },
      toBlock,
      fromBlock,
    });

  const [fillEvent] = await destinationChainClient.getFilterLogs({
    filter: fillEventFilter,
  });

  if (!fillEvent) {
    throw new NoFillLogError(
      depositId,
      depositTxReceipt.transactionHash,
      deposit.originChainId,
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
