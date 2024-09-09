import assert from "assert";
import { buildSearchParams, fetchAcross } from "../utils";
import { DepositStatus } from "./getDepositStatus";
import { Hash, PublicClient } from "viem";
import { QuoteResponse } from "./getQuote";
import { spokePoolAbi } from "../constants/abi/SpokePool";

export type GetFillStatusParams = DepositStatus &
  QuoteResponse & {
    blockRange: bigint;
    destinationChainClient: PublicClient;
    indexerUrl: string;
  };

export async function getFillStatus(params: GetFillStatusParams) {
  const {
    depositTxReceipt,
    parsedDepositLog,
    depositTimestamp,
    depositId,
    deposit,
    blockRange,
    destinationChainClient,
    indexerUrl,
  } = params;

  try {
    const res = await fetchAcross(
      `${indexerUrl}/deposit/status?${buildSearchParams({
        depositId,
        originChainId: deposit.originChainId,
      })}`,
    );

    if (res.status !== 200) {
      throw new Error("Failed to fetch from ");
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
        fillTxHashes: [data.fillTx],
        fillTxTimestamp: fillTxBlock.timestamp,
        depositData: {
          depositTxReceipt,
          parsedDepositLog,
          depositTimestamp,
          depositId,
        },
      };
    }
  } catch (e) {
    // if fails, attempt to retrieve from publicClient
  }

  const latestBlock = await destinationChainClient.getBlockNumber();
  const filter = await destinationChainClient.createContractEventFilter({
    address: deposit.spokePoolAddress,
    abi: spokePoolAbi,
    eventName: "FilledV3Relay",
    args: {
      depositId,
    },
    toBlock: latestBlock,
    fromBlock: latestBlock - blockRange, // @todo do we want to implement a blockfinder similar to across frontend?
  });

  const fillEvents = await destinationChainClient.getFilterLogs({ filter });
  assert(fillEvents?.[0], `No v3 fill found for deposit id ${depositId}`);

  const fillBlock = await destinationChainClient.getBlock({
    blockNumber: fillEvents[0].blockNumber,
  });

  return {
    fillTxHashes: fillEvents.map((e) => e.transactionHash),
    fillTxTimestamp: fillBlock.timestamp,
    depositData: {
      depositTxReceipt,
      parsedDepositLog,
      depositTimestamp,
      depositId,
    },
  };
}

export type FillStatus = {
  fillTxHashes: Hash[];
  fillTxTimestamp: bigint;
  depositData: DepositStatus;
};
