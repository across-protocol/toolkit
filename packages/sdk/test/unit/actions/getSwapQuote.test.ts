import { assert, assertType, describe, test } from "vitest";
import { type SwapApprovalApiResponse } from "../../../src/api/swap-approval.js";
import { getSwapQuote } from "../../../src/actions/getSwapQuote.js";
import { Hex, parseEther } from "viem";
import { hasIntegratorIdAppended } from "../../../src/utils/hex.js";
import { mainnetTestClient } from "../../common/sdk.js";

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
const inputAmount = "0.001"; // 0.001 WETH

describe("getSwapQuote", () => {
  test("Gets a swap quote for a simple bridge transfer", async () => {
    const quote = await getSwapQuote({
      amount: parseEther(inputAmount),
      tradeType: "exactInput",
      route: {
        originChainId: 1, // Mainnet
        inputToken: inputToken.address,
        destinationChainId: 10, // Optimism
        outputToken: outputToken.address,
      },
      depositor: testRecipient,
      recipient: testRecipient,
      slippage: 0.01,
      appFee: 0.001,
      appFeeRecipient: testRecipient,
    });

    assert(quote, "No swap quote returned for the provided parameters");
    assertType<SwapApprovalApiResponse>(quote);
  });

  test("Gets a swap quote for a simple bridge transfer with actions", async () => {
    const quote = await getSwapQuote({
      amount: parseEther(inputAmount),
      route: {
        originChainId: 1, // Mainnet
        inputToken: inputToken.address,
        destinationChainId: 10, // Optimism
        outputToken: "0x0000000000000000000000000000000000000000", // Native ETH
      },
      depositor: testRecipient,
      recipient: testRecipient,
      actions: [
        {
          target: "0x733Debf51574c70CfCdb7918F032E16F686bd9f8", // Test staking contract on OP
          functionSignature: "function stake(address recipient)",
          args: [{ value: testRecipient }],
          populateCallValueDynamically: true,
        },
      ],
    });

    assert(quote, "No swap quote returned for the provided parameters");
    assertType<SwapApprovalApiResponse>(quote);
  });

  test("swap approval calldata has integrator id appended", async () => {
    const integratorId: Hex = "0xdead";

    const quote = await getSwapQuote({
      amount: parseEther(inputAmount),
      route: {
        originChainId: 1,
        inputToken: inputToken.address,
        destinationChainId: 10,
        outputToken: outputToken.address,
      },
      depositor: testRecipient,
      recipient: testRecipient,
      integratorId,
    });

    assert(quote.swapTx, "swapTx missing in swap approval response");
    let data: Hex;
    if ("eip712" in quote.swapTx) {
      data = quote.swapTx.swapTx.data as Hex;
    } else {
      const simple = quote.swapTx as { data: string };
      data = simple.data as Hex;
    }

    assert(
      hasIntegratorIdAppended(data, integratorId, {
        isSwap: true,
      }),
      "Expected swap calldata to have integrator id suffix",
    );
  });

  test("client injects integratorId when omitted", async () => {
    const quote = await mainnetTestClient.getSwapQuote({
      amount: parseEther(inputAmount),
      route: {
        originChainId: 1,
        inputToken: inputToken.address,
        destinationChainId: 10,
        outputToken: outputToken.address,
      },
      depositor: testRecipient,
      recipient: testRecipient,
      // no integrator ID
    });

    assert(quote.swapTx, "swapTx missing in swap approval response");
    let data: Hex;
    if ("eip712" in quote.swapTx) {
      data = quote.swapTx.swapTx.data as Hex;
    } else {
      const simple = quote.swapTx as { data: string };
      data = simple.data as Hex;
    }

    // Client default integratorId is 0xdead when not configured explicitly
    const expectedIntegratorId: Hex = "0xdead";
    assert(
      hasIntegratorIdAppended(data, expectedIntegratorId, { isSwap: true }),
      "Expected swap calldata to include client's integrator id when omitted in params",
    );
  });
});
