[@across-protocol/app-sdk](../README.md) / executeSwapQuote

# Function: executeSwapQuote()

> **executeSwapQuote**(`params`): `Promise`\<[`ExecuteSwapQuoteResponseParams`](../type-aliases/ExecuteSwapQuoteResponseParams.md)\>

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:157](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L157)

Executes a swap quote by:
1. Validating the swap quote has transaction data
2. Executing the swap transaction
3. Waiting for the transaction to be confirmed
4. Waiting for the fill on the destination chain

## Parameters

### params

[`ExecuteSwapQuoteParams`](../type-aliases/ExecuteSwapQuoteParams.md)

See [ExecuteSwapQuoteParams](../type-aliases/ExecuteSwapQuoteParams.md).

## Returns

`Promise`\<[`ExecuteSwapQuoteResponseParams`](../type-aliases/ExecuteSwapQuoteResponseParams.md)\>

The deposit ID and receipts for the swap and fill transactions. See [ExecuteSwapQuoteResponseParams](../type-aliases/ExecuteSwapQuoteResponseParams.md).
