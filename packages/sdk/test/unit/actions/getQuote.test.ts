import { assert, assertType, describe, test } from "vitest";
import { testClient } from "../../common/sdk.js";
import {
  buildMulticallHandlerMessage,
  getMultiCallHandlerAddress,
  type Quote,
  type Route,
} from "../../../src/index.js";
import { encodeFunctionData, erc20Abi, parseUnits } from "viem";
import { arbitrum, optimism } from "viem/chains";

// arbitrum USDC
const inputToken = {
  address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6,
} as const;

// optimism USDC
const outputToken = {
  address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6,
} as const;

const testEoa = "0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D";
const inputAmount = 100;
const inputAmountBN = parseUnits(inputAmount.toString(), inputToken.decimals);
const outputAmountBN = inputAmountBN / 2n; // 50% of input ensures this doesn't fail, since we cannot recompute after getting the initial quote

// ARBITRUM => OPTIMISM
const testRoute: Route = {
  originChainId: arbitrum.id,
  destinationChainId: optimism.id,
  inputToken: inputToken.address,
  outputToken: outputToken.address,
  inputTokenSymbol: inputToken.symbol,
  outputTokenSymbol: outputToken.symbol,
  isNative: false,
};

describe("getQuote with Raw Pre-Encoded Message", () => {
  test("Gets a quote using a raw pre-encoded message from a test EOA", async () => {
    // pre compute a simple transfer message
    const calldata = buildMulticallHandlerMessage({
      fallbackRecipient: testEoa,
      actions: [
        {
          target: outputToken.address,
          value: 0n,
          callData: encodeFunctionData({
            abi: erc20Abi,
            functionName: "transfer",
            args: [testEoa, outputAmountBN],
          }),
        },
      ],
    });

    // Invoke getQuote with the raw message
    const _quote = await testClient.getQuote({
      route: testRoute,
      recipient: getMultiCallHandlerAddress(testRoute.destinationChainId),
      inputAmount: inputAmountBN,
      crossChainMessage: calldata,
      // Removed 'sender' as it's not a parameter for getQuote
    });

    // Assert that a quote was returned
    assert(_quote, "No quote returned for the provided route and message");
    assertType<Quote>(_quote);

    // Optional: Additional assertions to verify quote details
    assert.equal(
      _quote.deposit.inputAmount.toString(),
      inputAmountBN.toString(),
      "Input amounts should match",
    );
    assert.equal(
      _quote.deposit.originChainId,
      testRoute.originChainId,
      "Origin chain IDs should match",
    );
    assert.equal(
      _quote.deposit.destinationChainId,
      testRoute.destinationChainId,
      "Destination chain IDs should match",
    );
    assert.equal(
      _quote.deposit.inputToken,
      testRoute.inputToken,
      "Input tokens should match",
    );
    assert.equal(
      _quote.deposit.outputToken,
      testRoute.outputToken,
      "Output tokens should match",
    );
  });
});
