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
  logLevel: "DEBUG",
  chains: [hardhat],
});

export const mainnetTestSDK = AcrossClient.create({
  useTestnet: false,
  logLevel: "DEBUG",
  chains: [...MAINNET_SUPPORTED_CHAINS],
});
