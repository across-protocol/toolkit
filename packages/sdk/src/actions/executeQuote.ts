import {
  Address,
  Hash,
  Hex,
  maxUint256,
  parseAbi,
  SimulateContractReturnType,
  TransactionReceipt,
} from "viem";
import { Quote } from "./getQuote.js";
import { simulateDepositTx } from "./simulateDepositTx.js";
import { LoggerT } from "../utils/index.js";
import { simulateApproveTx } from "./simulateApproveTx.js";
import { DepositStatus, waitForDepositTx } from "./waitForDepositTx.js";
import {
  ConfiguredPublicClient,
  ConfiguredWalletClient,
} from "../types/index.js";
import { parseFillLogs, waitForFillTx } from "./waitForFillTx.js";
import { parseDepositLogs } from "./getDepositFromLogs.js";
import { prepareAtomicApproveDepositTx } from "./prepareAtomicApproveDepositTx.js";
import { waitForAtomicTx } from "./waitForAtomicTx.js";

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
      depositLog: ReturnType<typeof parseDepositLogs>;
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
      fillLog: ReturnType<typeof parseFillLogs>;
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
  /**
   * Whether to use atomic transactions if supported by the wallet.
   */
  atomicIfSupported?: boolean;
};

/**
 * Response parameters for {@link executeQuote}.
 */
export type ExecuteQuoteResponseParams = {
  /**
   * The ID of the deposit transaction.
   */
  depositId?: DepositStatus["depositId"];
  /**
   * The receipt of the deposit transaction.
   */
  depositTxReceipt?: TransactionReceipt;
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
 * Executes a quote by:
 * 1. Approving the SpokePool contract if necessary
 * 2. Depositing the input token on the origin chain
 * 3. Waiting for the deposit to be filled on the destination chain
 * @param params - See {@link ExecuteQuoteParams}.
 * @returns The deposit ID and receipts for the deposit and fill transactions. See {@link ExecuteQuoteResponseParams}.
 * @public
 */
export async function executeQuote(
  params: ExecuteQuoteParams,
): Promise<ExecuteQuoteResponseParams> {
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
    atomicIfSupported = false,
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
          ? maxUint256
          : BigInt(inputAmount);

        currentProgressMeta = {
          approvalAmount,
          spender: spokePoolAddress,
        };

        if (atomicIfSupported) {
          logger?.debug("Checking if wallet supports atomic transactions");
          try {
            const capabilities = await walletClient.getCapabilities({
              account,
              chainId: deposit.originChainId,
            });

            if (
              capabilities?.atomic?.status === "supported" ||
              capabilities?.atomic?.status === "ready"
            ) {
              logger?.debug(
                "Wallet supports atomic sendCalls, triggering atomic flow",
              );
              // Simulate both approval and deposit calls
              const { calls } = await prepareAtomicApproveDepositTx({
                walletClient,
                publicClient: originClient,
                deposit,
                approvalAmount: BigInt(inputAmount),
                integratorId,
                logger,
              });

              const callProgressMeta: DepositMeta = {
                deposit,
              };
              const callSimulationProgress: TransactionProgress = {
                step: "deposit",
                status: "simulationPending",
                meta: callProgressMeta,
              };
              onProgressHandler(callSimulationProgress);

              const { id: callId } = await walletClient.sendCalls({
                account,
                calls,
                forceAtomic: true,
              });

              logger?.debug(`Atomic call ID: ${callId}`);

              const depositTransactionProgress: TransactionProgress = {
                step: "deposit",
                status: "txPending",
                txHash: callId as Hash,
                meta: { deposit },
              };
              onProgressHandler(depositTransactionProgress);

              const destinationBlock = await destinationClient.getBlockNumber();

              const { depositId, depositTxReceipt } = await waitForAtomicTx({
                callId,
                originChainId: deposit.originChainId,
                walletClient,
              });

              const depositLog = parseDepositLogs(depositTxReceipt.logs);

              const depositSuccessProgress: TransactionProgress = {
                step: "deposit",
                status: "txSuccess",
                txReceipt: depositTxReceipt,
                depositId,
                depositLog,
                meta: { deposit },
              };
              onProgressHandler(depositSuccessProgress);

              // After successful deposit, wait for fill
              const fillMeta: FillMeta = {
                depositId,
                deposit,
              };
              const fillPendingProgress: TransactionProgress = {
                step: "fill",
                status: "txPending",
                meta: fillMeta,
              };
              onProgressHandler(fillPendingProgress);

              const { fillTxReceipt, fillTxTimestamp, actionSuccess } =
                await waitForFillTx({
                  deposit,
                  depositId,
                  depositTxHash: depositTxReceipt.transactionHash,
                  destinationChainClient: destinationClient,
                  fromBlock: destinationBlock - 100n, // TODO: use dynamic block buffer based chain
                });

              const fillLog = parseFillLogs(fillTxReceipt.logs);

              const fillSuccessProgress: TransactionProgress = {
                step: "fill",
                status: "txSuccess",
                txReceipt: fillTxReceipt,
                fillTxTimestamp,
                actionSuccess,
                fillLog,
                meta: fillMeta,
              };
              onProgressHandler(fillSuccessProgress);
              return { depositId, depositTxReceipt, fillTxReceipt };
            }
          } catch (error) {
            if (
              error instanceof Error &&
              error.message
                .toLowerCase()
                .includes("user rejected account upgrade")
            ) {
              logger?.debug(
                "User rejected smart account upgrade, falling back to regular flow",
              );
            } else {
              throw error;
            }
          }
        }

        currentTransactionProgress = {
          step: "approve",
          status: "simulationPending",
          meta: currentProgressMeta,
        };

        onProgressHandler(currentTransactionProgress);

        // Fall back to regular approval flow
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
    const depositLog = parseDepositLogs(depositTxReceipt.logs);

    currentTransactionProgress = {
      ...currentTransactionProgress,
      status: "txSuccess",
      txReceipt: depositTxReceipt,
      depositId,
      depositLog,
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
        depositTxHash,
        destinationChainClient: destinationClient,
        fromBlock: destinationBlock - 100n, // TODO: use dynamic block buffer based chain
      });

    const fillLog = parseFillLogs(fillTxReceipt.logs);

    currentTransactionProgress = {
      ...currentTransactionProgress,
      status: "txSuccess",
      txReceipt: fillTxReceipt,
      fillTxTimestamp,
      actionSuccess,
      fillLog,
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
      return { error: error as Error };
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
