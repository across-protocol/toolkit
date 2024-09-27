import { ChainsQueryResponse, TokenInfo } from "@across-toolkit/sdk";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address, Chain, Hash, Hex } from "viem";
import { SUPPORTED_CHAINS } from "./chains";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}

export function truncateHexString(string: Hex) {
  return `${string.slice(0, 6)}...${string.slice(-5)}`;
}

export function reduceAcrossChains(
  acrossChains: ChainsQueryResponse | undefined,
  configuredChains: Chain[],
) {
  if (!acrossChains) return;
  // Create a Set of IDs for efficient lookup
  const configuredChainIds = new Set(configuredChains.map((chain) => chain.id));

  // Only use across chain data this app is configured for
  return acrossChains.filter((chain) => configuredChainIds.has(chain.chainId));
}

export function buildQueryKey<T extends object | undefined>(
  queryName: string,
  params: T,
) {
  if (!params) return [queryName];
  return [queryName, ...Object.entries(params).map((entry) => entry.join("="))];
}

export type NoNullValuesOfObject<T extends object> = {
  [Property in keyof T]-?: NonNullable<T[Property]>;
};

type ExplorerLinkParams = {
  chain: Chain;
} & (
  | {
      type: "address";
      address: Address;
    }
  | {
      type: "transaction";
      txHash: Hash;
    }
  | {
      type: "event";
      txHash: Hash;
      eventIndex: number;
    }
);

export function getExplorerLink(params: ExplorerLinkParams) {
  const url = params.chain.blockExplorers?.default.url;
  if (!url) {
    return;
  }

  if (params.type === "address") {
    return `${url}/address/${params.address}`;
  }

  if (params.type === "transaction") {
    return `${url}/tx/${params.txHash}`;
  }

  if (params.type === "event") {
    return `${url}/tx/${params.txHash}#eventlog#${params.eventIndex}`;
  }
}

export function isNativeToken(
  token: TokenInfo | undefined,
  chainId: number | undefined,
) {
  if (!token || !chainId) return;
  const chainNativeCurrency = SUPPORTED_CHAINS.find(
    (chain) => chain.id === chainId,
  )?.nativeCurrency;
  if (!chainNativeCurrency) {
    throw new Error("Chain not supported");
  }
  return Boolean(
    chainNativeCurrency.symbol === token.symbol &&
      chainNativeCurrency.decimals === token.decimals,
  );
}
