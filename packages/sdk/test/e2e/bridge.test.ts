import {
  assert,
  assertType,
  describe,
  expect,
  expectTypeOf,
  test,
} from "vitest";
import { testClient } from "../common/client";
import { type AcrossChain } from "../../src/utils/getSupportedChains";
import {
  type ConfiguredPublicClient,
  type Quote,
  type Route,
} from "../../src/index";
import { type Address, parseUnits } from "viem";
import { chainClientArbitrum, chainClientMainnet } from "../common/anvil";
import { mainnetChainInfo } from "../mocks/data/getSupportedChains";
import {
  BLOCK_NUMBER_ARBITRUM,
  BLOCK_NUMBER_MAINNET,
} from "../common/constants";

const inputToken = {
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  decimals: 6,
  symbol: "USDC",
} as const;

// MAINNET => OPTIMISM
const testRoute = {
  originChainId: 1,
  destinationChainId: 10,
  originToken: inputToken.address,
} as const;

let route: Route;
let quote: Quote;

describe("Simple Bridge", async () => {
  describe("Client configured correctly", () => {
    test("Public clients configured on init", async () => {
      expect(testClient).to.not.be.undefined;
      const originPublicClient = testClient.getPublicClient(
        testRoute.originChainId,
      );
      expect(originPublicClient).toBeDefined();
      assertType<ConfiguredPublicClient>(originPublicClient);

      const destinationPublicClient = testClient.getPublicClient(
        testRoute.destinationChainId,
      );
      expect(destinationPublicClient).toBeDefined();
      assertType<ConfiguredPublicClient>(destinationPublicClient);
    });

    test("Caches chain info for all supported chains", async () => {
      const chainInfo = await testClient.getChainInfo(testRoute.originChainId);
      expect(chainInfo).toBeDefined();
      assertType<AcrossChain>(chainInfo);
      expect(chainInfo).toEqual(mainnetChainInfo);
    });

    test("Can fetch spokePool Addresses for route", async () => {
      const originSpokePoolAddress = await testClient.getSpokePoolAddress(
        testRoute.originChainId,
      );
      expect(originSpokePoolAddress).toBeDefined();
      expectTypeOf(originSpokePoolAddress).toMatchTypeOf<Address>();

      const destinationSpokePoolAddress = await testClient.getSpokePoolAddress(
        testRoute.destinationChainId,
      );
      expect(destinationSpokePoolAddress).toBeDefined();
      assertType<Address>(destinationSpokePoolAddress);
    });
  });

  test("Gets available routes for intent", async () => {
    const [_route] = await testClient.getAvailableRoutes(testRoute);
    assert(_route !== undefined, "route is not defined");
    assertType<Route>(_route);
    route = _route;
  });

  test("Gets a quote for a route", async () => {
    const _quote = await testClient.getQuote({
      route,
      inputAmount: parseUnits("10", inputToken.decimals),
    });

    assert(_quote, "No quote for route");
    assertType<Quote>(_quote);
    quote = _quote;
  });

  test("Executes with correct params", async () => {
    const blockNumberArbitrum = await chainClientArbitrum.getBlockNumber();
    expect(blockNumberArbitrum).toBe(BLOCK_NUMBER_ARBITRUM);
    const blockNumberMainnet = await chainClientMainnet.getBlockNumber();
    expect(blockNumberMainnet).toBe(BLOCK_NUMBER_MAINNET);
    // const result = await new Promise((res, rej) => {
    //   testClient.executeQuote({
    //     deposit: quote.deposit,
    //     walletClient: testWalletMainnet,
    //     infiniteApproval: true,
    //     onProgress: (progress) => {
    //       console.log(progress);

    //       if (progress.status === "error") {
    //         rej(false);
    //       }
    //       if (progress.status === "txSuccess" && progress.step === "deposit") {
    //         // execute relayer transaction
    //         res(true);
    //       }
    //     },
    //   });
    // });
    // console.log(result);
  });
});
