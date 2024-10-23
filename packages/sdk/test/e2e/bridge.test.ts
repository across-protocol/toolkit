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
  type TokenInfo,
} from "../../src/index";
import { type Address, formatUnits, parseEther, parseUnits } from "viem";
import {
  chainClientArbitrum,
  chainClientMainnet,
  publicClientArbitrum,
  publicClientMainnet,
  testWalletMainnet,
} from "../common/anvil";
import { mainnetChainInfo } from "../mocks/data/chains";
import {
  BLOCK_NUMBER_ARBITRUM,
  BLOCK_NUMBER_MAINNET,
} from "../common/constants";
import { fundUsdc, getUsdcBalance } from "../common/utils";

const inputToken = mainnetChainInfo
  .find((chain) => chain.chainId === 1)
  ?.inputTokens.find((token) => token.symbol === "USDC") as TokenInfo;

const inputAmount = 100;
const inputAmountBN = parseUnits(inputAmount.toString(), inputToken.decimals);

// MAINNET => ARBITRUM
const testRoute = {
  originChainId: 1,
  destinationChainId: 42161,
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
      expect(chainInfo).toEqual(mainnetChainInfo[0]);
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
      inputAmount: inputAmountBN,
    });

    assert(_quote, "No quote for route");
    assertType<Quote>(_quote);
    quote = _quote;
  });

  test("Executes with correct params", async () => {
    // sanity check that we have fresh anvil instances running in this case
    const blockNumberArbitrum = await chainClientArbitrum.getBlockNumber();
    expect(blockNumberArbitrum).toBe(BLOCK_NUMBER_ARBITRUM);
    const blockNumberMainnet = await chainClientMainnet.getBlockNumber();
    expect(blockNumberMainnet).toBe(BLOCK_NUMBER_MAINNET);

    // give wallet 1 ETH
    await chainClientMainnet.setBalance({
      address: chainClientMainnet.account.address,
      value: parseEther("1"),
    });

    await fundUsdc(chainClientMainnet, testWalletMainnet.account.address);

    const usdcBalance = await getUsdcBalance(
      testWalletMainnet.account.address,
      publicClientMainnet,
    );

    console.log("USDC Balance", formatUnits(usdcBalance, inputToken.decimals));

    const latestBlock = await chainClientMainnet.getBlock({
      blockTag: "latest",
    });

    const depositTimestamp = latestBlock.timestamp - 20n;

    // override quote timestamp
    const deposit = {
      ...quote.deposit,
      quoteTimestamp: Number(depositTimestamp),
    };

    const result = await new Promise((res, rej) => {
      testClient.executeQuote({
        deposit: deposit,
        walletClient: testWalletMainnet,
        // override publicClients because for some reason the configurePublicClients is not respecting the rpcUrls defined for each chain in anvil.ts
        originClient: publicClientMainnet as ConfiguredPublicClient,
        destinationClient: publicClientArbitrum as ConfiguredPublicClient,
        infiniteApproval: true,
        onProgress: (progress) => {
          console.log(progress);

          if (progress.status === "simulationError") {
            rej(false);
          }

          if (progress.status === "error") {
            rej(false);
          }
          if (progress.status === "txSuccess" && progress.step === "deposit") {
            // execute relayer transaction
            res(true);
          }
        },
      });
    });
    expect(result).toBe(true);
  });
});
