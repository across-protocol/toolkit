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

export const testClient = AcrossClient.create({
  useTestnet: false,
  logLevel: "DEBUG",
  chains: Object.values(chains),
  tenderly: {
    simOnError: true,
    accessKey: TENDERLY_KEY,
    accountSlug: "gsteenkamp",
    projectSlug: "project",
  },
});
