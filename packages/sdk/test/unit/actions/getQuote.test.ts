import { assert, assertType, describe, test } from "vitest";
import { testClient } from "../../common/sdk.js";
import { type Quote, type Route } from "../../../src/index.js";
import { encodeFunctionData, erc20Abi, parseUnits } from "viem";

const inputToken = {
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6,
  logoUrl:
    "https://raw.githubusercontent.com/across-protocol/frontend/master/src/assets/token-logos/usdc.svg",
} as const;

const inputAmount = 100;
const inputAmountBN = parseUnits(inputAmount.toString(), inputToken.decimals);

// MAINNET => ARBITRUM
const testRoute = {
  originChainId: 1,
  destinationChainId: 42161,
  originToken: inputToken.address,
} as const;

let route: Route;

const USDC_Arbitrum = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
const spender = "0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D";
const spendAmount = parseUnits("10", 6);

const message = encodeFunctionData({
  abi: erc20Abi,
  functionName: "approve",
  args: [spender, spendAmount],
});

describe("getQuote", async () => {
  test("Gets available routes for intent", async () => {
    const [_route] = await testClient.getAvailableRoutes(testRoute);
    assert(_route !== undefined, "route is not defined");
    assertType<Route>(_route);
    route = _route;
  });

  test("Gets a quote for a route with raw message", async () => {
    const _quote = await testClient.getQuote({
      route,
      recipient: USDC_Arbitrum,
      inputAmount: inputAmountBN,
      crossChainMessage: message,
    });

    assert(_quote, "No quote for route");
    assertType<Quote>(_quote);
  });
});
