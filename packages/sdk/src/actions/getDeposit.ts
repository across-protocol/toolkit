import { Address, Hex, isHash } from "viem";
import { getDepositFromLogs, parseDepositLogs } from "./getDepositFromLogs.js";
import { ConfiguredPublicClient, Deposit } from "../types/index.js";
import { getFillByDepositTx } from "./getFillByDepositTx.js";
import { NoFillLogError } from "../errors/index.js";

export type GetDepositParams = {
  originChainClient: ConfiguredPublicClient;
  destinationChainClient: ConfiguredPublicClient;
  findBy: {
    originChainId: number;
    destinationChainId: number;
    destinationSpokePoolAddress: Address;
  } & Partial<{
    originSpokePoolAddress: Address;
    depositId: bigint;
    depositTxHash: Hex;
  }>;
  depositLogFromBlock?: bigint;
  fillLogFromBlock?: bigint;
  indexerUrl?: string;
};

export type GetDepositReturnType = Promise<Deposit>;

/**
 * Get a deposit by its deposit tx hash or deposit id + spoke pool address.
 * @param params - See {@link GetDepositParams}.
 * @returns See {@link Deposit}.
 */
export async function getDeposit(
  params: GetDepositParams,
): GetDepositReturnType {
  const {
    originChainClient,
    destinationChainClient,
    findBy,
    depositLogFromBlock,
    fillLogFromBlock,
    indexerUrl,
  } = params;

  const { originChainId, destinationSpokePoolAddress } = findBy;

  let rawDeposit: Deposit | undefined;

  if (
    !(
      findBy.depositTxHash ||
      (findBy.depositId && findBy.originSpokePoolAddress)
    )
  ) {
    throw new Error(
      "You must provide either a 'depositTxHash' or 'depositId' + 'spokePoolAddress'",
    );
  }

  // Try to get deposit from logs by tx hash on origin chain
  if (findBy.depositTxHash) {
    const depositTxHash = findBy.depositTxHash;

    if (!isHash(depositTxHash)) {
      throw new Error(`Can't get receipt for tx hash: ${depositTxHash}`);
    }

    const receipt = await originChainClient.getTransactionReceipt({
      hash: depositTxHash,
    });

    if (!receipt) {
      throw new Error(`No receipt found for tx hash: ${depositTxHash}`);
    }

    rawDeposit = getDepositFromLogs({ originChainId, receipt });
  }

  // Try to get deposit from logs by deposit id and spoke pool address on origin chain
  else if (findBy.depositId && findBy.originSpokePoolAddress) {
    const { depositId, originSpokePoolAddress } = findBy;

    const depositLogs = await getDepositLogs({
      depositId,
      depositLogFromBlock,
      originChainClient: params.originChainClient,
      originSpokePoolAddress,
    });

    if (!depositLogs?.length) {
      throw new Error(`No deposit logs found for deposit id: ${depositId}`);
    }

    const parsedDepositLog = parseDepositLogs(depositLogs);

    if (!parsedDepositLog) {
      throw new Error(
        `Unable to parse Deposit logs for deposit id: ${depositId}`,
      );
    }

    rawDeposit = {
      ...parsedDepositLog,
      depositId,
      originChainId,
    };
  }

  if (!rawDeposit) {
    throw new Error(`No deposit found for ${JSON.stringify(findBy)}`);
  }

  try {
    const fill = await getFillByDepositTx({
      deposit: {
        depositId: rawDeposit.depositId,
        originChainId: rawDeposit.originChainId,
        destinationSpokePoolAddress,
        message: rawDeposit.message,
        depositTxHash: rawDeposit.depositTxHash,
        destinationChainId: rawDeposit.destinationChainId,
      },
      fromBlock: fillLogFromBlock,
      destinationChainClient,
      indexerUrl,
    });
    rawDeposit.fillTxHash = fill.fillTxReceipt.transactionHash;
    rawDeposit.fillTxBlock = fill.fillTxReceipt.blockNumber;
    rawDeposit.status = "filled";
    rawDeposit.actionSuccess = fill.actionSuccess;
  } catch (e) {
    if (e instanceof NoFillLogError) {
      // if no fill log, deposit is pending
    } else {
      throw e;
    }
  }

  // TODO: enrich with token details, format amounts, etc.
  return rawDeposit;
}

// Look for v3 & v4 deposit logs
async function getDepositLogs({
  depositId,
  depositLogFromBlock,
  originChainClient,
  originSpokePoolAddress,
}: {
  depositId: bigint;
  depositLogFromBlock: bigint | undefined;
  originChainClient: ConfiguredPublicClient;
  originSpokePoolAddress: Address;
}) {
  const [v3Logs, v4Logs] = await Promise.all([
    originChainClient.getLogs({
      address: originSpokePoolAddress,
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
            indexed: true,
            internalType: "uint256",
            name: "destinationChainId",
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
            name: "quoteTimestamp",
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
            indexed: true,
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
            internalType: "address",
            name: "exclusiveRelayer",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bytes",
            name: "message",
            type: "bytes",
          },
        ],
        name: "V3FundsDeposited",
        type: "event",
      },
      args: {
        depositId: Number(depositId),
      },
      fromBlock: depositLogFromBlock ?? 0n,
    }),
    originChainClient.getLogs({
      address: originSpokePoolAddress,
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
            indexed: true,
            internalType: "uint256",
            name: "destinationChainId",
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
            name: "quoteTimestamp",
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
            indexed: true,
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
            name: "exclusiveRelayer",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "bytes",
            name: "message",
            type: "bytes",
          },
        ],
        name: "FundsDeposited",
        type: "event",
      },
      args: {
        depositId,
      },
      fromBlock: depositLogFromBlock ?? 0n,
    }),
  ]);

  return v4Logs ?? v3Logs ?? undefined;
}
