import {
  parseAbi,
  SimulateContractReturnType,
  TransactionReceipt,
  WalletClient,
} from "viem";

import { Quote } from "./getQuote";
import { simulateDepositTx } from "./simulateDepositTx";
import { LoggerT } from "../utils";
import { simulateApproveTx } from "./simulateApproveTx";
import { waitForDepositTx } from "./waitForDepositTx";
import { ConfiguredPublicClient } from "../types";
import { waitForFillTx } from "./waitForFillTx";

export type ExecutionProgress =
  | { status: "idle" }
  | (ProgressMeta & {
      status: "txSimulationPending";
    })
  | (ProgressMeta & {
      status: "txSimulationSuccess";
    })
  | (ProgressMeta & {
      status: "txSimulationError";
      error: Error;
    })
  | (ProgressMeta & {
      status: "txPending";
      txHash: string;
    })
  | (ProgressMeta & {
      status: "txSuccess";
      txReceipt: TransactionReceipt;
    })
  | (ProgressMeta & {
      status: "txError";
      error: Error;
    })
  | { status: "error" };

type ProgressMeta = {
  type: "approve" | "deposit" | "fill";
  meta: {
    [key: string]: unknown;
  };
};

export type ExecuteQuoteParams = {
  logger?: LoggerT;
  integratorId: string;
  deposit: Quote["deposit"];
  walletClient: WalletClient;
  originClient: ConfiguredPublicClient;
  destinationClient: ConfiguredPublicClient;
  infiniteApproval?: boolean;
  skipAllowanceCheck?: boolean;
  throwOnError?: boolean;
  onProgress?: (progress: ExecutionProgress) => void;
};

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
    onProgress,
    logger,
  } = params;

  const onProgressHandler =
    onProgress ||
    ((progress: ExecutionProgress) => defaultProgressHandler(progress, logger));

  let txRequest: Awaited<SimulateContractReturnType>["request"];
  let currentProgressStatus: ExecutionProgress["status"] = "idle";
  let currentProgressMeta: ProgressMeta = {
    type: "approve",
    meta: {},
  };

  try {
    const account = walletClient.account;

    if (!account) {
      throw new Error("Wallet account has to be set");
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
          type: "approve",
          meta: {
            approvalAmount,
            spender: spokePoolAddress,
          },
        };
        currentProgressStatus = "txSimulationPending";
        onProgressHandler({
          status: currentProgressStatus,
          ...currentProgressMeta,
        });

        const { request } = await simulateApproveTx({
          walletClient,
          publicClient: originClient,
          spender: spokePoolAddress,
          approvalAmount,
          tokenAddress: inputToken,
        });
        txRequest = request;

        currentProgressStatus = "txSimulationSuccess";
        onProgressHandler({
          status: currentProgressStatus,
          ...currentProgressMeta,
        });

        const approveTxHash = await walletClient.writeContract({
          account,
          ...txRequest,
        });

        currentProgressStatus = "txPending";
        onProgressHandler({
          status: currentProgressStatus,
          txHash: approveTxHash,
          ...currentProgressMeta,
        });

        const approveTxReceipt = await originClient.waitForTransactionReceipt({
          hash: approveTxHash,
        });

        currentProgressStatus = "txSuccess";
        onProgressHandler({
          status: currentProgressStatus,
          txReceipt: approveTxReceipt,
          ...currentProgressMeta,
        });
      }
    }

    // Handle deposit transaction on SpokePool:
    // 1. Simulate the deposit transaction
    // 2. If successful, execute the deposit transaction
    // 3. Wait for the transaction to be mined
    currentProgressMeta = {
      type: "deposit",
      meta: {
        deposit,
      },
    };
    currentProgressStatus = "txSimulationPending";
    onProgressHandler({
      status: currentProgressStatus,
      ...currentProgressMeta,
    });

    const { request: _request } = await simulateDepositTx({
      walletClient,
      publicClient: originClient,
      deposit,
      integratorId,
      logger,
    });
    txRequest = _request;

    currentProgressStatus = "txSimulationSuccess";
    onProgressHandler({
      status: currentProgressStatus,
      ...currentProgressMeta,
    });

    const depositTxHash = await walletClient.writeContract({
      account,
      ...txRequest,
    });
    const destinationBlock = await destinationClient.getBlockNumber();

    currentProgressStatus = "txPending";
    onProgressHandler({
      status: currentProgressStatus,
      txHash: depositTxHash,
      ...currentProgressMeta,
    });

    const { depositId, depositTxReceipt } = await waitForDepositTx({
      transactionHash: depositTxHash,
      publicClient: originClient,
    });

    currentProgressStatus = "txSuccess";
    onProgressHandler({
      status: currentProgressStatus,
      txReceipt: depositTxReceipt,
      ...{
        ...currentProgressMeta,
        meta: {
          depositId,
        },
      },
    });

    // After successful deposit, wait for fill
    currentProgressMeta = {
      type: "fill",
      meta: {
        depositId,
      },
    };
    currentProgressStatus = "txPending";
    onProgressHandler({
      status: currentProgressStatus,
      txHash: depositTxHash,
      ...currentProgressMeta,
    });

    const { fillTxReceipt, fillTxTimestamp, actionSuccess } =
      await waitForFillTx({
        deposit,
        depositId,
        destinationPublicClient: destinationClient,
        fromBlock: destinationBlock - 100n, // TODO: use dynamic block buffer based chain
      });

    currentProgressStatus = "txSuccess";
    onProgressHandler({
      status: currentProgressStatus,
      txReceipt: fillTxReceipt,
      ...{
        ...currentProgressMeta,
        meta: {
          depositId,
          fillTxTimestamp,
          actionSuccess,
        },
      },
    });
    return { depositId, depositTxReceipt, fillTxReceipt };
  } catch (error) {
    const errorStatus =
      currentProgressStatus === "txPending"
        ? "txError"
        : currentProgressStatus === "txSimulationPending"
          ? "txSimulationError"
          : "error";
    onProgressHandler({
      status: errorStatus,
      error: error as Error,
      ...currentProgressMeta,
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
