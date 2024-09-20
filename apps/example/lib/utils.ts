import { ChainsQueryResponse } from "@across-toolkit/sdk";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Chain, Hex } from "viem";

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
  return [
    queryName,
    ...Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("="),
  ];
}

export type NoNullValuesOfObject<T extends object> = {
  [Property in keyof T]-?: NonNullable<T[Property]>;
};
