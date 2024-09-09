import { Hash, Log, PublicClient, TransactionReceipt } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import assert from "assert";
import { getDepositLogs } from "./getDepositLogs";

export type GetDepositStatusParams = {
  transactionHash: Hash;
  publicClient: PublicClient;
};

export async function getDepositStatus(
  params: GetDepositStatusParams,
): Promise<DepositStatus> {
  const { transactionHash, publicClient } = params;

  const receipt = await waitForTransactionReceipt(publicClient, {
    hash: transactionHash,
  });

  const depositBlock = await publicClient.getBlock({
    blockNumber: receipt.blockNumber,
  });

  const depositLogs = getDepositLogs(receipt);

  assert(
    depositLogs,
    `Unable to get logs from deposit with hash ${transactionHash}`,
  );

  const depositId = depositLogs.args.depositId;

  assert(depositId, "Unable to get deposit Id from transaction logs");

  return {
    depositTxReceipt: receipt,
    parsedDepositLog: depositLogs,
    depositTimestamp: depositBlock.timestamp,
    depositId,
  };
}

export type DepositStatus = {
  depositTxReceipt: TransactionReceipt;
  parsedDepositLog: Log;
  depositTimestamp: bigint;
  depositId: number;
};
