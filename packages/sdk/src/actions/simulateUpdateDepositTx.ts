import { Address, Hex, SimulateContractReturnType, WalletClient } from "viem";
import { getQuote } from "./getQuote";
import { LoggerT } from "../utils";
import { spokePoolAbi } from "../abis/SpokePool";
import { ConfiguredPublicClient, CrossChainAction } from "../types";
import { getDeposit } from "./getDeposit";
import { signUpdateDepositTypedData } from "./signUpdateDeposit";

export type SimulateUpdateDepositTxParams = {
  walletClient: WalletClient;
  originChainClient: ConfiguredPublicClient;
  destinationChainClient: ConfiguredPublicClient;
  deposit: {
    depositId: number;
    originChainId: number;
    destinationChainId: number;
    originSpokePoolAddress: Address;
    destinationSpokePoolAddress: Address;
  };
  update: Partial<{
    crossChainMessage:
      | {
          actions: CrossChainAction[];
          fallbackRecipient: Address;
        }
      | Hex;
    recipient: Address;
    outputAmount: bigint;
  }>;
  apiUrl?: string;
  logger?: LoggerT;
};

/**
 * This function simulates the update of a deposit on the origin chain. Can be used to
 * update:
 * - the recipient address
 * - the output amount, i.e. the fees
 * - the cross-chain message
 * Note that this requires a signature from the depositor.
 * @param params - See {@link SimulateUpdateDepositTxParams}.
 * @returns The result of the simulation.
 * @example
 * ```ts
 * const result = await simulateUpdateDepositTx({
 *   walletClient,
 * . originChainClient,
 *   destinationChainClient,
 *   deposit: {
 *     // deposit details
 *   },
 *   update: {
 *     recipient: "0xNEW_RECIPIENT_ADDRESS",
 *   },
 *  });
 * const txHash = await walletClient.writeContract({
 *   account,
 *   ...txRequest,
 * });
 * ```
 */
export async function simulateUpdateDepositTx(
  params: SimulateUpdateDepositTxParams,
) {
  const {
    walletClient,
    deposit: _deposit,
    update,
    originChainClient,
    destinationChainClient,
    logger,
    apiUrl,
  } = params;

  const {
    originChainId,
    originSpokePoolAddress,
    destinationChainId,
    destinationSpokePoolAddress,
    depositId,
  } = _deposit;

  const account = walletClient.account;

  if (!account) {
    throw new Error("Wallet account has to be set");
  }

  const connectedChainId = await walletClient.getChainId();

  if (connectedChainId !== originChainId) {
    throw new Error(
      `Connected chainId ${connectedChainId} does not match originChainId ${originChainId}`,
    );
  }

  const prevDeposit = await getDeposit({
    originChainClient,
    destinationChainClient,
    findBy: {
      depositId,
      originChainId,
      destinationChainId,
      destinationSpokePoolAddress,
    },
  });

  if (prevDeposit.depositor !== account.address) {
    throw new Error(
      `Connected account ${account.address} does not match depositor ${prevDeposit.depositor}`,
    );
  }

  const updatedRecipient = update.recipient ?? prevDeposit.recipient;

  const newQuote = await getQuote({
    route: {
      originChainId,
      destinationChainId,
      inputToken: prevDeposit.inputToken,
      outputToken: prevDeposit.outputToken,
    },
    inputAmount: prevDeposit.inputAmount,
    recipient: updatedRecipient,
    crossChainMessage: update.crossChainMessage ?? prevDeposit.message,
    logger,
    apiUrl,
  });

  if (
    update.outputAmount &&
    update.outputAmount < newQuote.deposit.outputAmount
  ) {
    throw new Error(
      `Provided 'update.outputAmount' ${update.outputAmount} is less than the required ${newQuote.deposit.outputAmount}`,
    );
  }

  const updatedOutputAmount =
    update.outputAmount ?? newQuote.deposit.outputAmount;
  const updatedMessage = newQuote.deposit.message;
  const signature = await signUpdateDepositTypedData({
    walletClient,
    updatedMessage,
    updatedOutputAmount,
    updatedRecipient,
    originChainId,
    depositId,
  });

  const result = await originChainClient.simulateContract({
    account,
    abi: spokePoolAbi,
    address: originSpokePoolAddress,
    functionName: "speedUpV3Deposit",
    args: [
      account.address,
      prevDeposit.depositId,
      updatedOutputAmount,
      updatedRecipient,
      updatedMessage,
      signature,
    ],
  });
  logger?.debug("'speedUpV3Deposit' sim result", result);

  return result as unknown as SimulateContractReturnType;
}
