import { assertType, describe, expect, test } from "vitest";
import { testClient } from "../common/client";
import {
  DefaultLogger,
  type AcrossChain,
  type ConfiguredPublicClient,
} from "../../src";
import type { Address } from "viem";
import { chains } from "../common/anvil";

const chainIds = Object.values(chains).map((chain) => chain.id);

describe("Initialize client", () => {
  test("Client properties set correctly", async () => {
    expect(testClient).to.not.be.undefined;
    expect(testClient.logger).toBeInstanceOf(DefaultLogger);
    expect(testClient.isTenderlyEnabled).toBe(false);
  });

  test("Public clients configured on init", async () => {
    expect(testClient).to.not.be.undefined;

    for (const id of chainIds) {
      const publicClient = testClient.getPublicClient(id);
      expect(publicClient).toBeDefined();
      assertType<ConfiguredPublicClient>(publicClient);
    }
  });

  test("Caches chain info for all supported chains", async () => {
    for (const id of chainIds) {
      const chainInfo = await testClient.getChainInfo(id);
      expect(chainInfo).toBeDefined();
      assertType<AcrossChain>(chainInfo);
    }
  });

  test("Can fetch spokePool Addresses for chain ID", async () => {
    for (const id of chainIds) {
      const spokePoolAddress = await testClient.getSpokePoolAddress(id);
      expect(spokePoolAddress).toBeDefined();
      assertType<Address>(spokePoolAddress);
    }
  });
});
