import {
  parseEther,
  WalletClient,
  zeroAddress,
  type Address,
  type PublicClient,
} from "viem";
import { USDC_MAINNET, USDC_WHALE } from "./constants.js";
import { type ChainClient } from "./anvil.js";
import { UpgradeTestEnvironment } from "./upgrade.2025.js";

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

// WETH deposit
const depositAbi = [
  {
    constant: false,
    inputs: [],
    name: "deposit",
    outputs: [],
    payable: true,
    stateMutability: "payable",
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

export function fundWeth1(
  params: Omit<Parameters<typeof fundWeth>[0], "wethAddress">,
) {
  return fundWeth({
    ...params,
    wethAddress: UpgradeTestEnvironment.spokePool1.WETH.address,
  });
}

export function fundWeth2(
  params: Omit<Parameters<typeof fundWeth>[0], "wethAddress">,
) {
  return fundWeth({
    ...params,
    wethAddress: UpgradeTestEnvironment.spokePool2.WETH.address,
  });
}

export async function fundWeth({
  chainClient,
  walletClient,
  amount = parseEther("1"),
  wethAddress,
}: {
  chainClient: ChainClient;
  walletClient: ChainClient | WalletClient;
  amount?: bigint;
  wethAddress: Address;
}) {
  try {
    if (!walletClient.account?.address) {
      throw new Error(
        `No ACCOUNT attached to the walletClient for chain ${walletClient.chain?.id}`,
      );
    }
    // fund ETH
    await chainClient.setBalance({
      address: walletClient.account.address,
      value: amount * 2n,
    });

    console.log("ETH funded!");

    // wrap
    const { request } = await chainClient.simulateContract({
      address: wethAddress,
      abi: depositAbi,
      functionName: "deposit",
      account: walletClient.account.address,
      value: amount,
    });

    console.log("simulating WETH deposit...");

    const hash = await walletClient.writeContract(request);
    const receipt = await chainClient.waitForTransactionReceipt({ hash });

    console.log("WETH funded!", receipt);

    return receipt;
  } catch (e) {
    console.log(
      `Unable to fund WETH for client with account ${walletClient.account?.address}`,
    );
    console.log(e);
  }
}
