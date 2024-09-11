import { Hash, TransactionReceipt } from "viem";
import { getDepositLogs } from "./getDepositLogs";
import { NoDepositLogError } from "../errors";
import { ConfiguredPublicClient } from "../types";

export type WaitForDepositTxParams = {
  transactionHash: Hash;
  publicClient: ConfiguredPublicClient;
};

export async function waitForDepositTx(
  params: WaitForDepositTxParams,
): Promise<DepositStatus> {
  const { transactionHash, publicClient } = params;

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: transactionHash,
  });

  const depositLog = getDepositLogs({ receipt });

  if (!depositLog || !depositLog.args.depositId) {
    throw new NoDepositLogError(receipt.transactionHash, publicClient.chain.id);
  }

  const depositId = depositLog.args.depositId;

  return {
    depositTxReceipt: receipt,
    depositId,
  };
}

export type DepositStatus = {
  depositTxReceipt: TransactionReceipt;
  depositId: number;
};
