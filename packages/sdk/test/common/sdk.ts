import { AcrossClient } from "../../src/client";
import { hardhat } from "viem/chains";

import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  linea,
  lisk,
  scroll,
  redstone,
  zora,
} from "viem/chains";

export const MAINNET_SUPPORTED_CHAINS = [
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  linea,
  lisk,
  scroll,
  redstone,
  zora,
] as const;

export const testnetTestSDK = AcrossClient.create({
  useTestnet: true,
  logLevel: "WARN",
  chains: [hardhat],
});

export const mainnetTestSDK = AcrossClient.create({
  useTestnet: false,
  logLevel: "WARN",
  chains: [...MAINNET_SUPPORTED_CHAINS],
});
