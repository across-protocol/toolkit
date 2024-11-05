import type { Address, PublicClient } from "viem";
import { USDC_MAINNET, USDC_WHALE } from "./constants.js";
import type { ChainClient } from "./anvil.js";

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}

export type Compute<type> = { [key in keyof type]: type[key] } & unknown;

const transferAbi = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const balanceOfAbi = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const transferAmount = 1_000_000_000n;

export async function getUsdcBalance(
  walletAddress: Address,
  publicClient: PublicClient,
) {
  const data = await publicClient.readContract({
    address: USDC_MAINNET,
    abi: balanceOfAbi,
    functionName: "balanceOf",
    args: [walletAddress],
  });

  return data;
}

export async function fundUsdc(
  testClient: ChainClient,
  walletAddress: Address,
  amount = transferAmount,
) {
  await testClient.impersonateAccount({
    address: USDC_WHALE,
  });

  const { request } = await testClient.simulateContract({
    address: USDC_MAINNET,
    abi: transferAbi,
    functionName: "transfer",
    args: [walletAddress, amount],
    account: USDC_WHALE,
  });

  const hash = await testClient.writeContract(request);
  const receipt = await testClient.waitForTransactionReceipt({ hash });

  console.log("USDC funded!", receipt);

  return receipt;
}
