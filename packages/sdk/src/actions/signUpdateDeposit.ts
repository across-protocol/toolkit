import { Address, Hex, WalletClient } from "viem";
import { getUpdateDepositTypedData } from "../utils/index.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { simulateUpdateDepositTx } from "./simulateUpdateDepositTx.js";

export type SignUpdateDepositTypedDataParams = {
  walletClient: WalletClient;
  depositId: bigint;
  originChainId: number;
  updatedMessage: Hex;
  updatedOutputAmount: bigint;
  updatedRecipient: Address;
};

/**
 * Creates a signature that allows signer to update a deposit. Can be used with
 * `SpokePool` contract's `speedUpV3Deposit` method. Is used internally by
 * {@link simulateUpdateDepositTx}
 * @param params See {@link SignUpdateDepositTypedDataParams}
 * @returns Hex-encoded signature
 */
export async function signUpdateDepositTypedData(
  params: SignUpdateDepositTypedDataParams,
) {
  const {
    walletClient,
    depositId,
    originChainId,
    updatedMessage,
    updatedOutputAmount,
    updatedRecipient,
  } = params;

  const account = walletClient.account;

  if (!account) {
    throw new Error("Wallet account has to be set");
  }

  const signature = await walletClient.signTypedData(
    getUpdateDepositTypedData({
      signerAddress: account.address,
      originChainId,
      depositId,
      updatedMessage,
      updatedOutputAmount,
      updatedRecipient,
    }),
  );

  return signature;
}
