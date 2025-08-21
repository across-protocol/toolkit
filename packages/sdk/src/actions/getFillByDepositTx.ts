import { fetchIndexerApi, LoggerT } from "../utils/index.js";
import {
  Address,
  Hash,
  Hex,
  parseAbiItem,
  parseEventLogs,
  PublicClient,
  TransactionReceipt,
} from "viem";
import { MAINNET_INDEXER_API } from "../constants/index.js";
import { NoFillLogError } from "../errors/index.js";
import { FillEventLog, IndexerStatusResponse } from "../types/index.js";
import { parseFillLogs } from "./waitForFillTx.js";

export type GetFillByDepositTxParams = {
  deposit: {
    depositId: bigint | number;
    depositTxHash?: Hash;
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
  const { indexerUrl = MAINNET_INDEXER_API, logger } = params;

  try {
    const data = await fetchIndexerApi<IndexerStatusResponse>(
      `${indexerUrl}/deposit/status`,
      {
        depositId: BigInt(params.deposit.depositId),
        originChainId: params.deposit.originChainId,
      },
    );

    if (data?.status === "filled" && data?.fillTx) {
      const fillTxReceipt =
        await params.destinationChainClient.getTransactionReceipt({
          hash: data.fillTx,
        });
      const fillTxBlock = await params.destinationChainClient.getBlock({
        blockNumber: fillTxReceipt.blockNumber,
      });

      const parsedFillEvent = parseFillLogs(fillTxReceipt.logs);

      // if message in deposit, check for CallsFailed event
      if (params.deposit.message !== "0x") {
        return {
          actionSuccess: data.actionsSucceeded,
          fillTxReceipt: fillTxReceipt,
          fillTxTimestamp: fillTxBlock.timestamp,
          parsedFillEvent,
        };
      }

      return {
        fillTxReceipt,
        fillTxTimestamp: fillTxBlock.timestamp,
        parsedFillEvent,
      };
    }
    // TODO: do we want to handle pending states?
  } catch (e) {
    logger?.warn(`Failed to get fill status from indexer: ${e}`);
  }

  const [fillEvent] = await getFillLogs(params);

  if (!fillEvent) {
    throw new NoFillLogError(
      BigInt(params.deposit.depositId),
      params.deposit.destinationChainId,
      params.deposit.depositTxHash,
    );
  }

  const [fillTxReceipt, fillBlock] = await Promise.all([
    params.destinationChainClient.getTransactionReceipt({
      hash: fillEvent.transactionHash,
    }),
    params.destinationChainClient.getBlock({
      blockNumber: fillEvent.blockNumber,
    }),
  ]);

  const parsedFillEvent = parseFillLogs(fillTxReceipt.logs);

  // if message in deposit, check for CallsFailed event
  if (params.deposit.message !== "0x") {
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
      parsedFillEvent,
    };
  }

  return {
    fillTxReceipt: fillTxReceipt,
    fillTxTimestamp: fillBlock.timestamp,
    parsedFillEvent,
  };
}

export type FillStatus = {
  actionSuccess?: boolean; // if deposit has message
  fillTxReceipt: TransactionReceipt;
  fillTxTimestamp: bigint;
  parsedFillEvent: FillEventLog;
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
          params?.logger ? params.logger.error(error) : console.log(error);
          setTimeout(poll, interval);
        });
    };
    poll();
  });
}

export async function getFillLogs(params: GetFillByDepositTxParams) {
  const { deposit, fromBlock, destinationChainClient } = params;
  const [v3Logs, v3_5Logs] = await Promise.all([
    destinationChainClient.getLogs({
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
            internalType:
              "struct V3SpokePoolInterface.V3RelayExecutionEventInfo",
            name: "relayExecutionInfo",
            type: "tuple",
          },
        ],
        name: "FilledV3Relay",
        type: "event",
      },
      args: {
        depositId: Number(deposit.depositId),
        originChainId: BigInt(deposit.originChainId),
      },
      fromBlock: fromBlock ?? 0n,
    }),

    destinationChainClient.getLogs({
      address: deposit.destinationSpokePoolAddress,
      event: {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "bytes32",
            name: "inputToken",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "bytes32",
            name: "outputToken",
            type: "bytes32",
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
            internalType: "uint256",
            name: "depositId",
            type: "uint256",
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
            internalType: "bytes32",
            name: "exclusiveRelayer",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "relayer",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "bytes32",
            name: "depositor",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "bytes32",
            name: "recipient",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "bytes32",
            name: "messageHash",
            type: "bytes32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "updatedRecipient",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "updatedMessageHash",
                type: "bytes32",
              },
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
            internalType:
              "struct V3SpokePoolInterface.V3RelayExecutionEventInfo",
            name: "relayExecutionInfo",
            type: "tuple",
          },
        ],
        name: "FilledRelay",
        type: "event",
      },
      args: {
        depositId: BigInt(deposit.depositId),
        originChainId: BigInt(deposit.originChainId),
      },
      fromBlock: fromBlock ?? 0n,
    }),
  ]);

  return v3Logs ?? v3_5Logs;
}
