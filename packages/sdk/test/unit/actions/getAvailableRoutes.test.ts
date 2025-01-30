import { describe, expect, test } from "vitest";
import { mainnetTestClient as testClient } from "../../common/sdk.js";

// MAINNET => OPTIMISM
const testnetRoute = {
  originChainId: 1,
  destinationChainId: 10,
  originToken: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
} as const;

describe("getAvailableRoutes", async () => {
  test("gets a route response for mainnet chains", async () => {
    const availableRoutes = await testClient.getAvailableRoutes(testnetRoute);
    console.log(JSON.stringify(availableRoutes));
    expect(availableRoutes).to.not.be.undefined;
  });
});
