import {
  PublicClient,
  SimulateContractReturnType,
  WalletClient,
  zeroAddress,
} from "viem";
import { Quote } from "./getQuote";
import {
  getCurrentTimeSeconds,
  getIntegratorDataSuffix,
  LoggerT,
} from "../utils";
import { spokePoolAbi } from "../abis/SpokePool";

export type SimulateDepositTxParams = {
  walletClient: WalletClient;
  publicClient: PublicClient;
  deposit: Quote["deposit"] & {
    fillDeadline?: number;
  };
  integratorId: string;
  logger?: LoggerT;
};

export async function simulateDepositTx(params: SimulateDepositTxParams) {
  const { walletClient, deposit, publicClient, integratorId, logger } = params;

  const {
    originChainId,
    destinationChainId,
    inputToken,
    outputToken,
    inputAmount,
    outputAmount,
    recipient,
    message,
    isNative,
    spokePoolAddress,
    fillDeadline: _fillDeadline,
    exclusiveRelayer,
    exclusivityDeadline,
    quoteTimestamp,
  } = deposit;

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

  // TODO: Add support for `SpokePoolVerifier` contract

  let fillDeadline = _fillDeadline;

  if (!fillDeadline) {
    const fillDeadlineBuffer = await publicClient.readContract({
      address: spokePoolAddress,
      abi: spokePoolAbi,
      functionName: "fillDeadlineBuffer",
    });
    fillDeadline = getCurrentTimeSeconds() - 60 + fillDeadlineBuffer;
  }

  const useExclusiveRelayer =
    exclusiveRelayer !== zeroAddress && exclusivityDeadline > 0;

  logger?.debug(`Using exclusive relayer: ${useExclusiveRelayer}`);

  const result = await publicClient.simulateContract({
    account: walletClient.account,
    abi: spokePoolAbi,
    address: spokePoolAddress,
    functionName: useExclusiveRelayer ? "depositExclusive" : "depositV3",
    args: [
      account.address,
      recipient ?? account.address,
      inputToken,
      outputToken,
      BigInt(inputAmount),
      outputAmount,
      BigInt(destinationChainId),
      exclusiveRelayer,
      quoteTimestamp,
      fillDeadline,
      exclusivityDeadline,
      message,
    ],
    value: isNative ? BigInt(inputAmount) : 0n,
    dataSuffix: getIntegratorDataSuffix(integratorId),
  });

  logger?.debug("Simulation result", result);

  return result as unknown as SimulateContractReturnType;
}
