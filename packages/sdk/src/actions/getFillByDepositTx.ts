import { fetchIndexerApi, LoggerT } from "../utils";
import {
  Address,
  Hash,
  Hex,
  parseAbiItem,
  parseEventLogs,
  PublicClient,
  TransactionReceipt,
} from "viem";
import { MAINNET_INDEXER_API } from "../constants";
import { NoFillLogError } from "../errors";
import { IndexerStatusResponse } from "../types";

export type GetFillByDepositTxParams = {
  deposit: {
    depositId: number;
    depositTxHash: Hash;
    originChainId: number;
    destinationChainId: number;
    destinationSpokePoolAddress: Address;
    message: Hex;
  };
  destinationChainClient: PublicClient;
  fromBlock?: bigint;
  indexerUrl?: string;
  logger?: LoggerT;
};

export async function getFillByDepositTx(
  params: GetFillByDepositTxParams,
): Promise<FillStatus> {
  const {
    deposit,
    fromBlock,
    destinationChainClient,
    indexerUrl = MAINNET_INDEXER_API,
    logger,
  } = params;

  try {
    const data = await fetchIndexerApi<IndexerStatusResponse>(
      `${indexerUrl}/deposit/status`,
      {
        depositId: deposit.depositId,
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
    logger?.warn(`Failed to get fill status from indexer: ${e}`);
  }

  const [fillEvent] = await destinationChainClient.getLogs({
    address: deposit.destinationSpokePoolAddress,
    event: {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "inputToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "outputToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "inputAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "outputAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "repaymentChainId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "originChainId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint32",
          name: "depositId",
          type: "uint32",
        },
        {
          indexed: false,
          internalType: "uint32",
          name: "fillDeadline",
          type: "uint32",
        },
        {
          indexed: false,
          internalType: "uint32",
          name: "exclusivityDeadline",
          type: "uint32",
        },
        {
          indexed: false,
          internalType: "address",
          name: "exclusiveRelayer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "relayer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "depositor",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "message",
          type: "bytes",
        },
        {
          components: [
            {
              internalType: "address",
              name: "updatedRecipient",
              type: "address",
            },
            { internalType: "bytes", name: "updatedMessage", type: "bytes" },
            {
              internalType: "uint256",
              name: "updatedOutputAmount",
              type: "uint256",
            },
            {
              internalType: "enum V3SpokePoolInterface.FillType",
              name: "fillType",
              type: "uint8",
            },
          ],
          indexed: false,
          internalType: "struct V3SpokePoolInterface.V3RelayExecutionEventInfo",
          name: "relayExecutionInfo",
          type: "tuple",
        },
      ],
      name: "FilledV3Relay",
      type: "event",
    },
    args: {
      depositId: deposit.depositId,
      originChainId: BigInt(deposit.originChainId),
    },
    fromBlock: fromBlock ?? 0n,
  });

  if (!fillEvent) {
    throw new NoFillLogError(
      deposit.depositId,
      deposit.depositTxHash,
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

export async function waitForFillByDepositTx(
  params: GetFillByDepositTxParams & {
    pollingInterval?: number;
  },
): ReturnType<typeof getFillByDepositTx> {
  const interval =
    params?.pollingInterval ?? params.destinationChainClient.pollingInterval;

  return new Promise((res) => {
    const poll = () => {
      getFillByDepositTx(params)
        .then((response) => {
          if (response.fillTxReceipt) {
            res(response);
          } else {
            setTimeout(poll, interval);
          }
        })
        .catch((error) => {
          console.log(error);
          setTimeout(poll, interval);
        });
    };
    poll();
  });
}
