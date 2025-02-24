import {
  Hex,
  PublicClient,
  SimulateContractReturnType,
  WalletClient,
  zeroAddress,
} from "viem";
import { Quote } from "./getQuote.js";
import {
  addressToBytes32,
  getIntegratorDataSuffix,
  LoggerT,
} from "../utils/index.js";
import { spokePoolAbiV3_5 } from "../abis/SpokePool/index.js";

export type SimulateDepositTxParams = {
  walletClient: WalletClient;
  publicClient: PublicClient;
  deposit: Quote["deposit"];
  integratorId: Hex;
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
    fillDeadline,
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

  const useExclusiveRelayer =
    exclusiveRelayer !== zeroAddress && exclusivityDeadline > 0;

  logger?.debug(`Using exclusive relayer: ${useExclusiveRelayer}`);

  const result = await publicClient.simulateContract({
    account: walletClient.account,
    abi: spokePoolAbiV3_5,
    address: spokePoolAddress,
    functionName: "deposit",
    args: [
      addressToBytes32(account.address),
      addressToBytes32(recipient ?? account.address),
      addressToBytes32(inputToken),
      addressToBytes32(outputToken),
      BigInt(inputAmount),
      outputAmount,
      BigInt(destinationChainId),
      addressToBytes32(exclusiveRelayer),
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
