import { arbitrum, base, mainnet, optimism, polygon } from "wagmi/chains";

export const SUPPORTED_CHAINS = [
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
] as const;
