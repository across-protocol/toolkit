import {
  Address,
  parseAbi,
  PublicClient,
  SimulateContractReturnType,
  WalletClient,
} from "viem";
import { bytes32ToAddress } from "../utils/hex.js";

export type SimulateApproveTxParams = {
  walletClient: WalletClient;
  publicClient: PublicClient;
  spender: Address;
  approvalAmount: bigint;
  tokenAddress: Address;
};

export async function simulateApproveTx(params: SimulateApproveTxParams) {
  const { walletClient, publicClient, spender, approvalAmount, tokenAddress } =
    params;

  if (!walletClient.account) {
    throw new Error("Wallet account has to be set");
  }

  const simulationResult = await publicClient.simulateContract({
    account: walletClient.account,
    abi: parseAbi([
      "function approve(address spender, uint256 amount) public returns (bool)",
    ]),
    address: bytes32ToAddress(tokenAddress),
    functionName: "approve",
    args: [bytes32ToAddress(spender), approvalAmount],
  });

  return simulationResult as unknown as SimulateContractReturnType;
}
