import { createAcrossClient } from "../../src/client.js";
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
import { TENDERLY_KEY } from "./constants.js";
import { MAINNET_API_URL } from "../../src/constants/index.js";

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

const tenderly = TENDERLY_KEY
  ? {
      simOnError: true,
      accessKey: TENDERLY_KEY,
      accountSlug: "account",
      projectSlug: "project",
    }
  : undefined;

export const TEST_BASE_URL = MAINNET_API_URL;

export const testClient = createAcrossClient({
  useTestnet: false,
  logLevel: "WARN",
  chains: [...MAINNET_SUPPORTED_CHAINS],
  pollingInterval: 1_000,
  tenderly,
});
