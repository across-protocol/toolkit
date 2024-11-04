import { Address, Hex, isHash } from "viem";
import { getDepositFromLogs } from "./getDepositFromLogs.js";
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
    depositId: number;
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
    const { originSpokePoolAddress, depositId } = findBy;

    const [depositEvent] = await originChainClient.getLogs({
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
        depositId,
      },
      fromBlock: depositLogFromBlock ?? 0n,
    });

    if (!depositEvent) {
      throw new Error(`No deposit found for deposit id: ${depositId}`);
    }

    rawDeposit = {
      depositId,
      originChainId,
      inputToken: depositEvent.args.inputToken!,
      outputToken: depositEvent.args.outputToken!,
      inputAmount: depositEvent.args.inputAmount!,
      outputAmount: depositEvent.args.outputAmount!,
      destinationChainId: Number(depositEvent.args.destinationChainId!),
      quoteTimestamp: depositEvent.args.quoteTimestamp!,
      fillDeadline: depositEvent.args.fillDeadline!,
      exclusivityDeadline: depositEvent.args.exclusivityDeadline!,
      depositor: depositEvent.args.depositor!,
      recipient: depositEvent.args.recipient!,
      exclusiveRelayer: depositEvent.args.exclusiveRelayer!,
      message: depositEvent.args.message!,
      status: "pending",
      depositTxHash: depositEvent.transactionHash,
      depositTxBlock: depositEvent.blockNumber,
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
