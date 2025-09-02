import { assert, assertType, describe, test } from "vitest";
import { type SwapApprovalApiResponse } from "../../../src/api/swap-approval.js";
import { getSwapQuote } from "../../../src/actions/getSwapQuote.js";
import { parseEther } from "viem";

// Mainnet WETH
const inputToken = {
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  symbol: "WETH",
  name: "Wrapped Ether",
  decimals: 18,
} as const;

// Optimism WETH
const outputToken = {
  address: "0x4200000000000000000000000000000000000006",
  symbol: "WETH",
  name: "Wrapped Ether",
  decimals: 18,
} as const;

const testRecipient = "0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D";
const inputAmount = 1; // 1 WETH

describe("getSwapQuote", () => {
  test("Gets a swap quote for a simple bridge transfer", async () => {
    const quote = await getSwapQuote({
      amount: parseEther("inputAmount"),
      tradeType: "exactInput",
      inputToken: inputToken.address,
      outputToken: outputToken.address,
      originChainId: 1, // Mainnet
      destinationChainId: 10, // Optimism
      depositor: testRecipient,
      recipient: testRecipient,
      slippage: 0.01,
      appFee: 0.001,
      appFeeRecipient: testRecipient,
    });

    assert(quote, "No swap quote returned for the provided parameters");
    assertType<SwapApprovalApiResponse>(quote);
  });
});
