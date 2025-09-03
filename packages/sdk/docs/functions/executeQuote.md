[@across-protocol/app-sdk](../README.md) / executeQuote

# Function: executeQuote()

> **executeQuote**(`params`): `Promise`\<[`ExecuteQuoteResponseParams`](../type-aliases/ExecuteQuoteResponseParams.md)\>

Defined in: [packages/sdk/src/actions/executeQuote.ts:203](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L203)

Executes a quote by:
1. Approving the SpokePool contract if necessary
2. Depositing the input token on the origin chain
3. Waiting for the deposit to be filled on the destination chain

## Parameters

### params

[`ExecuteQuoteParams`](../type-aliases/ExecuteQuoteParams.md)

See [ExecuteQuoteParams](../type-aliases/ExecuteQuoteParams.md).

## Returns

`Promise`\<[`ExecuteQuoteResponseParams`](../type-aliases/ExecuteQuoteResponseParams.md)\>

The deposit ID and receipts for the deposit and fill transactions. See [ExecuteQuoteResponseParams](../type-aliases/ExecuteQuoteResponseParams.md).
