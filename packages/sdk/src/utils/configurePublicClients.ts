import { Chain, createPublicClient, http, Transport, webSocket } from "viem";
import { ConfiguredPublicClientMap } from "../types";

// creates a mapping chainId => publicClient
export function configurePublicClients(
  chains: Chain[],
  pollingInterval: number, // milliseconds
  rpcUrls?: {
    [key: number]: string;
  },
  transports?: {
    [key: number]: Transport;
  },
): ConfiguredPublicClientMap {
  return new Map(
    chains.map((chain) => {
      const rpcUrl = rpcUrls?.[chain.id];
      const customTransport = transports?.[chain.id];
      const transport =
        customTransport ??
        (rpcUrl?.startsWith("wss") ? webSocket(rpcUrl) : http(rpcUrl));
      return [
        chain.id,
        createPublicClient({
          chain,
          pollingInterval,
          key: chain.id.toString(),
          transport,
          batch: {
            multicall: true,
          },
        }),
      ];
    }),
  );
}
