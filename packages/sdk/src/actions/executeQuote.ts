import {
  Address,
  Hash,
  Hex,
  parseAbi,
  SimulateContractReturnType,
  TransactionReceipt,
} from "viem";
import { Quote } from "./getQuote";
import { simulateDepositTx } from "./simulateDepositTx";
import { LoggerT } from "../utils";
import { simulateApproveTx } from "./simulateApproveTx";
import { DepositStatus, waitForDepositTx } from "./waitForDepositTx";
import { ConfiguredPublicClient, ConfiguredWalletClient } from "../types";
import { waitForFillTx } from "./waitForFillTx";

export type ExecutionProgress = TransactionProgress;

type ProgressMeta = ApproveMeta | DepositMeta | FillMeta | undefined;

type ApproveMeta = {
  approvalAmount: bigint;
  spender: Address;
};

type DepositMeta = {
  deposit: Quote["deposit"];
};

type FillMeta = {
  deposit: Quote["deposit"];
  depositId: DepositStatus["depositId"];
};

export type TransactionProgress =
  | {
      step: "approve";
      status: "idle";
    }
  | {
      step: "approve";
      status: "simulationPending";
      meta: ApproveMeta;
    }
  | {
      step: "approve";
      status: "simulationSuccess";
      txRequest: TxRequest;
      meta: ApproveMeta;
    }
  | {
      step: "approve";
      status: "txPending";
      txHash: Hash;
      meta: ApproveMeta;
    }
  | {
      step: "approve";
      status: "txSuccess";
      txReceipt: TransactionReceipt;
      meta: ApproveMeta;
    }
  | {
      step: "deposit";
      status: "simulationPending";
      meta: DepositMeta;
    }
  | {
      step: "deposit";
      status: "simulationSuccess";
      txRequest: TxRequest;
      meta: DepositMeta;
    }
  | {
      step: "deposit";
      status: "txPending";
      txHash: Hash;
      meta: DepositMeta;
    }
  | {
      step: "deposit";
      status: "txSuccess";
      txReceipt: TransactionReceipt;
      depositId: DepositStatus["depositId"];
      meta: DepositMeta;
    }
  | {
      step: "fill";
      status: "txPending";
      meta: FillMeta;
    }
  | {
      step: "fill";
      status: "txSuccess";
      txReceipt: TransactionReceipt;
      fillTxTimestamp: bigint;
      actionSuccess: boolean | undefined;
      meta: FillMeta;
    }
  | {
      step: "approve" | "deposit" | "fill";
      status: "simulationError" | "txError" | "error";
      error: Error;
      meta: ProgressMeta;
    };

type TxRequest = Awaited<SimulateContractReturnType>["request"];

/**
 * Params for {@link executeQuote}.
 */
export type ExecuteQuoteParams = {
  /**
   * An identifier for the integrator.
   */
  integratorId: Hex;
  /**
   * The deposit to execute. Should be taken from return value of {@link getQuote}.
   */
  deposit: Quote["deposit"];
  /**
   * The wallet client to use for the deposit.
   */
  walletClient: ConfiguredWalletClient;
  /**
   * The public client for the origin chain.
   */
  originClient: ConfiguredPublicClient;
  /**
   * The public client for the destination chain.
   */
  destinationClient: ConfiguredPublicClient;
  /**
   * Whether to use an infinite approval for the SpokePool contract.
   */
  infiniteApproval?: boolean;
  /**
   * Whether to skip the allowance check.
   */
  skipAllowanceCheck?: boolean;
  /**
   * Whether to throw if an error occurs.
   */
  throwOnError?: boolean;
  /**
   * Whether to force the origin chain by switching to it if necessary.
   */
  forceOriginChain?: boolean;
  /**
   * A handler for the execution progress. See {@link ExecutionProgress} for steps.
   */
  onProgress?: (progress: ExecutionProgress) => void;
  /**
   * The logger to use.
   */
  logger?: LoggerT;
};

/**
 * Executes a quote by:
 * 1. Approving the SpokePool contract if necessary
 * 2. Depositing the input token on the origin chain
 * 3. Waiting for the deposit to be filled on the destination chain
 * @param params - See {@link ExecuteQuoteParams}.
 * @returns The deposit ID and receipts for the deposit and fill transactions.
 * @public
 */
export async function executeQuote(params: ExecuteQuoteParams) {
  const {
    integratorId,
    deposit,
    walletClient,
    originClient,
    destinationClient,
    skipAllowanceCheck,
    infiniteApproval,
    throwOnError = true,
    forceOriginChain,
    onProgress,
    logger,
  } = params;

  const onProgressHandler =
    onProgress ||
    ((progress: ExecutionProgress) => defaultProgressHandler(progress, logger));

  let txRequest: TxRequest;
  let currentTransactionProgress: TransactionProgress = {
    status: "idle",
    step: "approve",
  };
  let currentProgressMeta: ProgressMeta;

  try {
    const account = walletClient.account;

    if (!account) {
      throw new Error("Wallet account has to be set");
    }

    if (forceOriginChain) {
      await walletClient.switchChain({
        id: deposit.originChainId,
      });
    }

    const connectedChainId = await walletClient.getChainId();
    if (connectedChainId !== deposit.originChainId) {
      throw new Error(
        `Connected chain ${connectedChainId} does not match 'originChainId' ${deposit.originChainId}`,
      );
    }

    const { inputToken, inputAmount, spokePoolAddress } = deposit;

    // Handle token approval if necessary. This will:
    // 1. Check if the allowance is sufficient for SpokePool
    // 2. If not, simulate an `approve` transaction
    // 3. If successful, execute the `approve` transaction
    if (!skipAllowanceCheck && !deposit.isNative) {
      const allowance = await originClient.readContract({
        address: inputToken,
        abi: parseAbi([
          "function allowance(address owner, address spender) public view returns (uint256)",
        ]),
        functionName: "allowance",
        args: [account.address, spokePoolAddress],
      });

      logger?.debug("Allowance", {
        allowance,
        owner: account.address,
        spender: spokePoolAddress,
        inputToken,
      });

      if (BigInt(inputAmount) > allowance) {
        const approvalAmount = infiniteApproval
          ? BigInt(0xffffffff) // max uint256
          : BigInt(inputAmount);

        currentProgressMeta = {
          approvalAmount,
          spender: spokePoolAddress,
        };

        currentTransactionProgress = {
          step: "approve",
          status: "simulationPending",
          meta: currentProgressMeta,
        };

        onProgressHandler(currentTransactionProgress);

        const { request } = await simulateApproveTx({
          walletClient,
          publicClient: originClient,
          spender: spokePoolAddress,
          approvalAmount,
          tokenAddress: inputToken,
        });
        txRequest = request;

        currentTransactionProgress = {
          ...currentTransactionProgress,
          status: "simulationSuccess",
          txRequest: request,
        };
        onProgressHandler(currentTransactionProgress);

        const approveTxHash = await walletClient.writeContract({
          account,
          ...txRequest,
        });

        currentTransactionProgress = {
          ...currentTransactionProgress,
          status: "txPending",
          txHash: approveTxHash,
        };

        onProgressHandler(currentTransactionProgress);

        const approveTxReceipt = await originClient.waitForTransactionReceipt({
          hash: approveTxHash,
        });

        currentTransactionProgress = {
          ...currentTransactionProgress,
          status: "txSuccess",
          txReceipt: approveTxReceipt,
        };
        onProgressHandler(currentTransactionProgress);
      }
    }

    // Handle deposit transaction on SpokePool:
    // 1. Simulate the deposit transaction
    // 2. If successful, execute the deposit transaction
    // 3. Wait for the transaction to be mined
    currentProgressMeta = {
      deposit,
    };
    currentTransactionProgress = {
      step: "deposit",
      status: "simulationPending",
      meta: currentProgressMeta,
    };
    onProgressHandler(currentTransactionProgress);

    const { request: _request } = await simulateDepositTx({
      walletClient,
      publicClient: originClient,
      deposit,
      integratorId,
      logger,
    });
    txRequest = _request;

    currentTransactionProgress = {
      ...currentTransactionProgress,
      status: "simulationSuccess",
      txRequest: _request,
    };
    onProgressHandler(currentTransactionProgress);

    const depositTxHash = await walletClient.writeContract({
      account,
      ...txRequest,
    });
    currentTransactionProgress = {
      ...currentTransactionProgress,
      status: "txPending",
      txHash: depositTxHash,
    };
    onProgressHandler(currentTransactionProgress);

    const destinationBlock = await destinationClient.getBlockNumber();

    const { depositId, depositTxReceipt } = await waitForDepositTx({
      originChainId: deposit.originChainId,
      transactionHash: depositTxHash,
      publicClient: originClient,
    });

    currentTransactionProgress = {
      ...currentTransactionProgress,
      status: "txSuccess",
      txReceipt: depositTxReceipt,
      depositId,
    };
    onProgressHandler(currentTransactionProgress);

    // After successful deposit, wait for fill
    currentProgressMeta = {
      depositId,
      deposit,
    };
    currentTransactionProgress = {
      step: "fill",
      status: "txPending",
      meta: currentProgressMeta,
    };
    onProgressHandler(currentTransactionProgress);

    const { fillTxReceipt, fillTxTimestamp, actionSuccess } =
      await waitForFillTx({
        deposit,
        depositId,
        destinationChainClient: destinationClient,
        fromBlock: destinationBlock - 100n, // TODO: use dynamic block buffer based chain
      });

    currentTransactionProgress = {
      ...currentTransactionProgress,
      status: "txSuccess",
      txReceipt: fillTxReceipt,
      fillTxTimestamp,
      actionSuccess,
    };
    onProgressHandler(currentTransactionProgress);
    return { depositId, depositTxReceipt, fillTxReceipt };
  } catch (error) {
    const errorStatus =
      currentTransactionProgress.status === "txPending"
        ? "txError"
        : currentTransactionProgress.status === "simulationPending"
          ? "simulationError"
          : "error";

    onProgressHandler({
      ...currentTransactionProgress,
      status: errorStatus,
      error: error as Error,
      meta: currentProgressMeta,
    });

    if (!throwOnError) {
      return { error };
    }

    throw error;
  }
}

function defaultProgressHandler(progress: ExecutionProgress, logger?: LoggerT) {
  if (!logger) {
    return;
  }
  logger.debug("Progress", progress);
}
