import { Address, Hex, WalletClient } from "viem";
import { getUpdateDepositTypedDataV3_5 } from "../utils/index.js";

export type SignUpdateDepositTypedDataParams = {
  walletClient: WalletClient;
  depositId: bigint | number;
  originChainId: bigint | number;
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
    getUpdateDepositTypedDataV3_5({
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
