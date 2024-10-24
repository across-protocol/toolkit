import { assertType, describe, expect, test } from "vitest";
import { testClient } from "../common/client";
import {
  DefaultLogger,
  type AcrossChain,
  type ConfiguredPublicClient,
} from "../../src";
import type { Address } from "viem";

describe("Initialize client", () => {
  test("Client properties set correctly", async () => {
    expect(testClient).to.not.be.undefined;
    expect(testClient.logger).toBeInstanceOf(DefaultLogger);
    expect(testClient.isTenderlyEnabled).toBe(false);
  });

  test("Public clients configured on init", async () => {
    expect(testClient).to.not.be.undefined;
    const originPublicClient = testClient.getPublicClient(1);
    expect(originPublicClient).toBeDefined();
    assertType<ConfiguredPublicClient>(originPublicClient);
  });

  test("Caches chain info for all supported chains", async () => {
    const chainInfo = await testClient.getChainInfo(1);
    expect(chainInfo).toBeDefined();
    assertType<AcrossChain>(chainInfo);
  });

  test("Can fetch spokePool Addresses for chain ID", async () => {
    const originSpokePoolAddress = await testClient.getSpokePoolAddress(1);
    expect(originSpokePoolAddress).toBeDefined();
    assertType<Address>(originSpokePoolAddress);
  });
});
