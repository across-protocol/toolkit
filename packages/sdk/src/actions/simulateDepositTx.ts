import {
  Hex,
  PublicClient,
  SimulateContractReturnType,
  WalletClient,
  zeroAddress,
} from "viem";
import { Quote } from "./getQuote.js";
import { getIntegratorDataSuffix, LoggerT } from "../utils/index.js";
import { spokePoolAbiV4 } from "../abis/SpokePool/index.js";

export type SimulateDepositTxParams = {
  walletClient: WalletClient;
  publicClient: PublicClient;
  deposit: Quote["deposit"] & {
    fillDeadline?: number;
  };
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
    const [fillDeadlineBufferResult, getCurrentTimeResult] =
      await publicClient.multicall({
        contracts: [
          {
            address: spokePoolAddress,
            abi: spokePoolAbiV4,
            functionName: "fillDeadlineBuffer",
          },
          {
            address: spokePoolAddress,
            abi: spokePoolAbiV4,
            functionName: "getCurrentTime",
          },
        ],
      });
    if (fillDeadlineBufferResult.error || getCurrentTimeResult.error) {
      const error =
        fillDeadlineBufferResult.error || getCurrentTimeResult.error;
      throw new Error(
        `Failed to fetch 'fillDeadlineBuffer' or 'getCurrentTime': ${error}`,
      );
    }
    fillDeadline =
      Number(getCurrentTimeResult.result) + fillDeadlineBufferResult.result;
  }

  const useExclusiveRelayer =
    exclusiveRelayer !== zeroAddress && exclusivityDeadline > 0;

  logger?.debug(`Using exclusive relayer: ${useExclusiveRelayer}`);

  const result = await publicClient.simulateContract({
    account: walletClient.account,
    abi: spokePoolAbiV4,
    address: spokePoolAddress,
    functionName: "depositV3",
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
