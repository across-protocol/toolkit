import {
  Hex,
  PublicClient,
  WalletClient,
  parseAbi,
  SimulateCallsReturnType,
  Call,
  encodeFunctionData,
  concatHex,
} from "viem";
import { Quote } from "./getQuote.js";
import { LoggerT } from "../utils/index.js";
import { spokePoolAbiV3_5 } from "../abis/SpokePool/index.js";
import { addressToBytes32, getIntegratorDataSuffix } from "../utils/index.js";

export type PrepareAtomicApproveDepositTxParams = {
  walletClient: WalletClient;
  publicClient: PublicClient;
  deposit: Quote["deposit"];
  approvalAmount: bigint;
  integratorId: Hex;
  logger?: LoggerT;
};

export type PrepareAtomicApproveDepositTxResult = {
  simulationResult?: SimulateCallsReturnType<readonly Call[]>;
  calls: readonly Call[];
  simulationError?: Error;
};

export async function prepareAtomicApproveDepositTx(
  params: PrepareAtomicApproveDepositTxParams,
): Promise<PrepareAtomicApproveDepositTxResult> {
  const {
    walletClient,
    publicClient,
    deposit,
    approvalAmount,
    integratorId,
    logger,
  } = params;

  const account = walletClient.account;

  if (!account) {
    throw new Error("Wallet account has to be set");
  }

  const connectedChainId = await walletClient.getChainId();

  if (connectedChainId !== deposit.originChainId) {
    throw new Error(
      `Connected chainId ${connectedChainId} does not match originChainId ${deposit.originChainId}`,
    );
  }

  const calls: readonly Call[] = [
    {
      to: deposit.inputToken,
      abi: parseAbi([
        "function approve(address spender, uint256 amount) public returns (bool)",
      ]),
      functionName: "approve",
      args: [deposit.spokePoolAddress, approvalAmount],
    },
    {
      to: deposit.spokePoolAddress,
      data: concatHex([
        encodeFunctionData({
          abi: spokePoolAbiV3_5,
          functionName: "deposit",
          args: [
            addressToBytes32(account.address),
            addressToBytes32(deposit.recipient ?? account.address),
            addressToBytes32(deposit.inputToken),
            addressToBytes32(deposit.outputToken),
            BigInt(deposit.inputAmount),
            deposit.outputAmount,
            BigInt(deposit.destinationChainId),
            addressToBytes32(deposit.exclusiveRelayer),
            deposit.quoteTimestamp,
            deposit.fillDeadline,
            deposit.exclusivityDeadline,
            deposit.message,
          ],
        }),
        getIntegratorDataSuffix(integratorId),
      ]),
      value: deposit.isNative ? BigInt(deposit.inputAmount) : 0n,
    },
  ] as const;

  try {
    const simulationResult = await publicClient.simulateCalls({
      account,
      calls,
    });

    logger?.debug("Atomic transaction simulation result", simulationResult);

    return {
      simulationResult: simulationResult,
      calls,
    };
  } catch (error) {
    logger?.debug("Atomic transaction simulation failed", error);
    return {
      simulationError: error as Error,
      calls,
    };
  }
}
