import { AcrossClient } from "../../src/client.js";
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
import { MAINNET_API_URL } from "../../src/constants/index.ts";

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

export const TEST_BASE_URL = MAINNET_API_URL;

export const testClient = AcrossClient.create({
  useTestnet: false,
  logLevel: "WARN",
  chains: [...MAINNET_SUPPORTED_CHAINS],
});
