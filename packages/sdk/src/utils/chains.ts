import { Chain, createPublicClient, http } from "viem";
import { AcrossClient } from "../client";

// creates a mapping chainId => publicClient
export function createPublicClients(
  chains: Chain[],
  pollingInterval: number,
  rpcUrls?: {
    [key: number]: string;
  },
): AcrossClient["publicClients"] {
  return Object.fromEntries(
    chains.map((chain) => {
      // get custom rpc if one is specified, or use default
      const rpcUrl = rpcUrls?.[chain.id];
      const key = chain.id.toString();
      return [
        key,
        createPublicClient({
          chain,
          pollingInterval,
          key,
          transport: http(rpcUrl),
          batch: {
            multicall: true,
          },
        }),
      ];
    }),
  );
}
