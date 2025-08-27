import { Address, Hash, Hex, TransactionReceipt } from "viem";
import { SwapApprovalApiResponse } from "../api/swap-approval.js";
import { LoggerT } from "../utils/index.js";
import {
  ConfiguredPublicClient,
  ConfiguredWalletClient,
} from "../types/index.js";
import { waitForDepositTx } from "./waitForDepositTx.js";
import { parseDepositLogs } from "./getDepositFromLogs.js";
import { waitForFillTx, parseFillLogs } from "./waitForFillTx.js";

export type SwapExecutionProgress = SwapTransactionProgress;

type SwapTransactionProgress =
  | {
      step: "approve";
      status: "idle";
    }
  | {
      step: "approve";
      status: "txPending";
      txHash: Hash;
    }
  | {
      step: "approve";
      status: "txSuccess";
      txReceipt: TransactionReceipt;
    }
  | {
      step: "swap";
      status: "idle";
    }
  | {
      step: "swap";
      status: "txPending";
      txHash: Hash;
    }
  | {
      step: "swap";
      status: "txSuccess";
      txReceipt: TransactionReceipt;
      depositId: bigint;
      depositLog: ReturnType<typeof parseDepositLogs>;
    }
  | {
      step: "fill";
      status: "txPending";
    }
  | {
      step: "fill";
      status: "txSuccess";
      txReceipt: TransactionReceipt;
      fillTxTimestamp: bigint;
      actionSuccess: boolean | undefined;
      fillLog: ReturnType<typeof parseFillLogs>;
    }
  | {
      step: "approve" | "swap" | "fill";
      status: "txError" | "error";
      error: Error;
    };

/**
 * Params for {@link executeSwapQuote}.
 */
export type ExecuteSwapQuoteParams = {
  /**
   * An identifier for the integrator.
   */
  integratorId: Hex;
  /**
   * The swap quote response from {@link getSwapQuote}.
   */
  swapQuote: SwapApprovalApiResponse;
  /**
   * The wallet client to use for the swap.
   */
  walletClient: ConfiguredWalletClient;
  /**
   * The public client for the origin chain
   */
  originClient: ConfiguredPublicClient;
  /**
   * The public client for the destination chain
   */
  destinationClient: ConfiguredPublicClient;
  /**
   * The address of the destination spoke pool.
   */
  destinationSpokePoolAddress?: Address;
  /**
   * Whether to throw if an error occurs.
   */
  throwOnError?: boolean;
  /**
   * Whether to force the origin chain by switching to it if necessary.
   */
  forceOriginChain?: boolean;
  /**
   * A handler for the execution progress. See {@link SwapExecutionProgress} for steps.
   */
  onProgress?: (progress: SwapExecutionProgress) => void;
  /**
   * The logger to use.
   */
  logger?: LoggerT;
};

/**
 * Response parameters for {@link executeSwapQuote}.
 */
export type ExecuteSwapQuoteResponseParams = {
  /**
   * The ID of the deposit transaction.
   */
  depositId?: bigint;
  /**
   * The receipt of the swap transaction.
   */
  swapTxReceipt?: TransactionReceipt;
  /**
   * The receipt of the fill transaction.
   */
  fillTxReceipt?: TransactionReceipt;
  /**
   * Error object if an error occurred and throwOnError was false.
   */
  error?: Error;
};

/**
 * Executes a swap quote by:
 * 1. Validating the swap quote has transaction data
 * 2. Executing the swap transaction
 * 3. Waiting for the transaction to be confirmed
 * 4. Waiting for the fill on the destination chain
 * @param params - See {@link ExecuteSwapQuoteParams}.
 * @returns The deposit ID and receipts for the swap and fill transactions. See {@link ExecuteSwapQuoteResponseParams}.
 * @public
 */
export async function executeSwapQuote(
  params: ExecuteSwapQuoteParams,
): Promise<ExecuteSwapQuoteResponseParams> {
  const {
    swapQuote,
    walletClient,
    originClient,
    destinationClient,
    destinationSpokePoolAddress,
    throwOnError = true,
    forceOriginChain,
    onProgress,
    logger,
  } = params;

  const onProgressHandler =
    onProgress ||
    ((progress: SwapExecutionProgress) =>
      defaultProgressHandler(progress, logger));

  let currentTransactionProgress: SwapTransactionProgress = {
    status: "idle",
    step: "swap",
  };

  try {
    const account = walletClient.account;

    if (!account) {
      throw new Error("Wallet account has to be set");
    }

    if (!swapQuote.swapTx) {
      throw new Error("Swap quote does not contain transaction data");
    }

    const swapTx = swapQuote.swapTx;

    if ("eip712" in swapTx) {
      throw new Error("Permit swap transactions are not yet supported");
    }

    if (forceOriginChain) {
      await walletClient.switchChain({
        id: swapTx.chainId,
      });
    }

    const connectedChainId = await walletClient.getChainId();
    if (connectedChainId !== swapTx.chainId) {
      throw new Error(
        `Connected chain ${connectedChainId} does not match swap transaction chain ${swapTx.chainId}`,
      );
    }

    // Execute approval transactions if present
    if (swapQuote.approvalTxns && swapQuote.approvalTxns.length > 0) {
      for (const approvalTxn of swapQuote.approvalTxns) {
        currentTransactionProgress = {
          step: "approve",
          status: "idle",
        };
        onProgressHandler(currentTransactionProgress);

        const approveTxHash = await walletClient.sendTransaction({
          account,
          to: approvalTxn.to as Address,
          data: approvalTxn.data as Hex,
        });

        currentTransactionProgress = {
          step: "approve",
          status: "txPending",
          txHash: approveTxHash,
        };
        onProgressHandler(currentTransactionProgress);

        const approveTxReceipt = await originClient.waitForTransactionReceipt({
          hash: approveTxHash,
        });

        currentTransactionProgress = {
          step: "approve",
          status: "txSuccess",
          txReceipt: approveTxReceipt,
        };
        onProgressHandler(currentTransactionProgress);
      }
    }

    const txRequest = {
      to: swapTx.to as Address,
      data: swapTx.data as Hex,
      value: swapTx.value ? BigInt(swapTx.value) : 0n,
      gas: swapTx.gas ? BigInt(swapTx.gas) : undefined,
      maxFeePerGas: swapTx.maxFeePerGas
        ? BigInt(swapTx.maxFeePerGas)
        : undefined,
      maxPriorityFeePerGas: swapTx.maxPriorityFeePerGas
        ? BigInt(swapTx.maxPriorityFeePerGas)
        : undefined,
    };

    const swapTxHash = await walletClient.sendTransaction({
      account,
      ...txRequest,
    });

    currentTransactionProgress = {
      step: "swap",
      status: "txPending",
      txHash: swapTxHash,
    };
    onProgressHandler(currentTransactionProgress);

    const destinationBlock = await destinationClient.getBlockNumber();

    // Wait for deposit transaction and parse logs
    const { depositId, depositTxReceipt } = await waitForDepositTx({
      originChainId: swapTx.chainId,
      transactionHash: swapTxHash,
      publicClient: originClient,
    });
    const depositLog = parseDepositLogs(depositTxReceipt.logs);

    currentTransactionProgress = {
      step: "swap",
      status: "txSuccess",
      txReceipt: depositTxReceipt,
      depositId,
      depositLog,
    };
    onProgressHandler(currentTransactionProgress);

    // After successful swap, wait for fill on destination chain if destinationSpokePoolAddress is provided
    if (destinationSpokePoolAddress) {
      currentTransactionProgress = {
        step: "fill",
        status: "txPending",
      };
      onProgressHandler(currentTransactionProgress);

      const originChainId = swapQuote.steps.bridge.tokenIn.chainId;
      const destinationChainId = swapQuote.steps.bridge.tokenOut.chainId;
      const deposit = {
        originChainId,
        destinationChainId,
        destinationSpokePoolAddress,
        message: "0x" as Hex,
      };

      const { fillTxReceipt, fillTxTimestamp, actionSuccess } =
        await waitForFillTx({
          deposit,
          depositId,
          depositTxHash: swapTxHash,
          destinationChainClient: destinationClient,
          fromBlock: destinationBlock - 100n,
        });

      const fillLog = parseFillLogs(fillTxReceipt.logs);

      currentTransactionProgress = {
        step: "fill",
        status: "txSuccess",
        txReceipt: fillTxReceipt,
        fillTxTimestamp,
        actionSuccess,
        fillLog,
      };
      onProgressHandler(currentTransactionProgress);
      return { depositId, swapTxReceipt: depositTxReceipt, fillTxReceipt };
    } else {
      return { depositId, swapTxReceipt: depositTxReceipt };
    }
  } catch (error) {
    const errorStatus =
      currentTransactionProgress.status === "txPending" ? "txError" : "error";

    onProgressHandler({
      ...currentTransactionProgress,
      status: errorStatus,
      error: error as Error,
    });

    if (!throwOnError) {
      return { error: error as Error };
    }

    throw error;
  }
}

function defaultProgressHandler(
  progress: SwapExecutionProgress,
  logger?: LoggerT,
) {
  if (!logger) {
    return;
  }
  logger.debug("Swap Progress", progress);
}
