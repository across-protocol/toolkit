import { Hex, zeroAddress, type Address, type PublicClient } from "viem";
import { USDC_MAINNET, USDC_WHALE } from "./constants.js";
import { type ChainClient } from "./anvil.js";
import { addressToBytes32, type Deposit } from "../../src/index.js";

export function isAddressDefined(address?: Address): address is Address {
  return address && address !== "0x" && address !== zeroAddress ? true : false;
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}

export type Compute<type> = { [key in keyof type]: type[key] } & unknown;

// ERC20 transfer
export const transferAbi = [
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

// ERC20 balanceOf
const balanceOfAbi = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const transferAmount = 1_000_000_000n;

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

type V3RelayData = {
  depositor: Hex;
  recipient: Hex;
  exclusiveRelayer: Hex;
  inputToken: Hex;
  outputToken: Hex;
  inputAmount: bigint;
  outputAmount: bigint;
  originChainId: bigint;
  depositId: bigint;
  fillDeadline: number;
  exclusivityDeadline: number;
  message: Hex;
};

export function toV3RelayData(v3LegacyData: Deposit): V3RelayData {
  return {
    message: v3LegacyData.message,
    exclusivityDeadline: v3LegacyData.exclusivityDeadline,
    fillDeadline: v3LegacyData.fillDeadline,
    originChainId: BigInt(v3LegacyData.originChainId),
    depositor: addressToBytes32(v3LegacyData.depositor),
    recipient: addressToBytes32(v3LegacyData.recipient),
    exclusiveRelayer: addressToBytes32(v3LegacyData.exclusiveRelayer),
    inputToken: addressToBytes32(v3LegacyData.inputToken),
    outputToken: addressToBytes32(v3LegacyData.outputToken),
    depositId: BigInt(v3LegacyData.depositId),
    inputAmount: v3LegacyData.inputAmount,
    outputAmount: v3LegacyData.outputAmount,
  };
}
