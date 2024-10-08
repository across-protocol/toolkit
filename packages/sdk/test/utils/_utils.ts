import { AcrossClient } from "../../src/client";
import { hardhat } from "viem/chains";

export const testSDK = AcrossClient.create({
  useTestnet: true,
  logLevel: "WARN",
  chains: [hardhat],
});
