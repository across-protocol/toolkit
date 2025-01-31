import { Hash, TransactionReceipt } from "viem";
import { getDepositFromLogs } from "./getDepositFromLogs.js";
import { NoDepositLogError } from "../errors/index.js";
import { ConfiguredPublicClient } from "../types/index.js";

export type WaitForDepositTxParams = {
  transactionHash: Hash;
  originChainId: number;
  publicClient: ConfiguredPublicClient;
};

export async function waitForDepositTx(
  params: WaitForDepositTxParams,
): Promise<DepositStatus> {
  const { transactionHash, originChainId, publicClient } = params;

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: transactionHash,
  });

  const depositLog = getDepositFromLogs({ originChainId, receipt });

  if (!depositLog || !depositLog.depositId) {
    throw new NoDepositLogError(receipt.transactionHash, publicClient.chain.id);
  }

  const depositId = depositLog.depositId;

  return {
    depositTxReceipt: receipt,
    depositId,
  };
}

export type DepositStatus = {
  depositTxReceipt: TransactionReceipt;
  depositId: bigint;
};
