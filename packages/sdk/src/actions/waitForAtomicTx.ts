import { Hash, TransactionReceipt } from "viem";
import { ConfiguredWalletClient } from "../types/index.js";
import { getDepositFromLogs } from "./getDepositFromLogs.js";
import { NoDepositLogError } from "../errors/index.js";

export type WaitForAtomicTxParams = {
  callId: string;
  originChainId: number;
  walletClient: ConfiguredWalletClient;
};

export type AtomicTxStatus = {
  depositTxReceipt: TransactionReceipt;
  depositId: bigint;
};

export async function waitForAtomicTx(
  params: WaitForAtomicTxParams,
): Promise<AtomicTxStatus> {
  const { callId, originChainId, walletClient } = params;

  const callResult = await walletClient.waitForCallsStatus({
    id: callId,
  });

  if (!callResult?.receipts?.[0]) {
    throw new Error("No receipt returned from atomic transaction");
  }

  if (callResult.receipts[0].status === "reverted") {
    throw new Error("Atomic transaction reverted");
  }

  const receipt = callResult.receipts[0] as TransactionReceipt;

  const depositLog = getDepositFromLogs({
    originChainId,
    receipt,
  });

  if (!depositLog || !depositLog.depositId) {
    throw new NoDepositLogError(callId as Hash, originChainId);
  }

  const depositId = depositLog.depositId;

  return {
    depositTxReceipt: receipt,
    depositId,
  };
}
