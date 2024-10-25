import { createAcrossClient } from "../../src/client";

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
import { chains } from "./anvil";
import { TENDERLY_KEY } from "./constants";

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

export const testClient = createAcrossClient({
  useTestnet: false,
  logLevel: "DEBUG",
  chains: Object.values(chains),
  pollingInterval: 1_000,
  tenderly,
});
