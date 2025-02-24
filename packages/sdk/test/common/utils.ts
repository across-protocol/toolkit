import {
  Hex,
  parseEther,
  zeroAddress,
  type Address,
  type PublicClient,
} from "viem";
import { USDC_ADDRESS, USDC_WHALES } from "./constants.js";
import { type ChainClient } from "./anvil.js";
import { addressToBytes32, type Deposit } from "../../src/index.js";
import { spokePoolAbiV3_5 } from "../../src/abis/SpokePool/v3_5.js";

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
  publicClient: PublicClient | ChainClient,
) {
  const chainId = publicClient.chain?.id;
  const tokenAddress = chainId ? USDC_ADDRESS?.[chainId] : undefined;

  if (!tokenAddress) {
    throw new Error(
      `Unable to fetch USDC address on chain: ${publicClient?.chain?.name}`,
    );
  }

  const data = await publicClient.readContract({
    address: tokenAddress,
    abi: balanceOfAbi,
    functionName: "balanceOf",
    args: [walletAddress],
  });

  return data;
}

export async function fundUsdc(
  testClient: ChainClient,
  walletAddress: Address,
  chainId: number,
  amount = transferAmount,
) {
  const sender = USDC_WHALES?.[chainId];
  const tokenAddress = USDC_ADDRESS?.[chainId];

  if (!sender || !tokenAddress) {
    throw new Error(`USDC config missing for chainId ${chainId}`);
  }
  await testClient.setBalance({
    address: sender,
    value: parseEther("1"),
  });

  await testClient.impersonateAccount({
    address: sender,
  });

  const amountWithPadding = amount * 2n;

  const sponsorBalance = await getUsdcBalance(sender, testClient);

  if (sponsorBalance <= amountWithPadding) {
    throw new Error(
      `Sponsor with address ${testClient.account.address} does not have enough balance. Sponsor balance: ${sponsorBalance}`,
    );
  }

  const { request } = await testClient.simulateContract({
    address: tokenAddress,
    abi: transferAbi,
    functionName: "transfer",
    args: [walletAddress, amountWithPadding],
    account: sender,
  });

  const hash = await testClient.writeContract(request);
  const receipt = await testClient.waitForTransactionReceipt({ hash });

  console.log("USDC funded!", receipt);
  await testClient.stopImpersonatingAccount({
    address: sender,
  });

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

type FieldMapping = {
  [key: string]: string | FieldMapping;
};

function remapValues(raw: unknown, mapping: FieldMapping): unknown {
  if (typeof raw !== "object" || raw === null) return raw;

  const remapped: Record<string, unknown> = {};

  Object.entries(mapping).forEach(([oldKey, mapValue]) => {
    const rawValue = (raw as Record<string, unknown>)[oldKey];

    if (typeof mapValue === "string") {
      // Rename the key using the provided string.
      remapped[mapValue] = rawValue;
    } else if (typeof mapValue === "object") {
      // For a nested mapping, recursively remap the value.
      remapped[oldKey] = remapValues(rawValue, mapValue as FieldMapping);
    }
  });

  return remapped;
}

export function checkFields(
  _raw: unknown,
  parsed: unknown,
  fieldMapping?: FieldMapping,
): boolean {
  const raw = fieldMapping ? remapValues(_raw, fieldMapping) : _raw;

  // If raw is not an object, there's nothing to check
  if (typeof raw !== "object" || raw === null) {
    return true;
  }

  // If parsed is not an object while raw is, it's a mismatch
  if (typeof parsed !== "object" || parsed === null) {
    return false;
  }

  for (const key of Object.keys(raw)) {
    if (!(key in (parsed as Record<string, unknown>))) {
      console.log(`Key ${key} from raw is not present in parsed.`);
      // Field is missing in parsed
      return false;
    }

    const rawValue = (raw as Record<string, unknown>)[key];
    const parsedValue = (parsed as Record<string, unknown>)[key];

    // If the value is an object, perform a recursive check
    if (typeof rawValue === "object" && rawValue !== null) {
      if (!checkFields(rawValue, parsedValue)) {
        return false;
      }
    }
  }

  return true;
}

export async function getFillDeadline({
  publicClient,
  spokePoolAddress,
  buffer = 3600, // 1 hour
}: {
  publicClient: PublicClient;
  spokePoolAddress: Address;
  buffer?: number;
}): Promise<number> {
  const currentTime = await publicClient.readContract({
    address: spokePoolAddress,
    abi: spokePoolAbiV3_5,
    functionName: "getCurrentTime",
  });

  return Number(currentTime) + buffer;
}
