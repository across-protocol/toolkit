import { Chain, createPublicClient, http } from "viem";
import { ConfiguredPublicClientMap } from "../types";

// creates a mapping chainId => publicClient
export function configurePublicClients(
  chains: Chain[],
  pollingInterval: number, // milliseconds
  rpcUrls?: {
    [key: number]: string;
  },
): ConfiguredPublicClientMap {
  return new Map(
    chains.map((chain) => {
      // get custom rpc if one is specified, or use default
      const rpcUrl = rpcUrls?.[chain.id];
      return [
        chain.id,
        createPublicClient({
          chain,
          pollingInterval,
          key: chain.id.toString(),
          transport: http(rpcUrl),
          batch: {
            multicall: true,
          },
        }),
      ];
    }),
  );
}
