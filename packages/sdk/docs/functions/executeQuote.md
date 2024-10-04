[@across-protocol/app-sdk](../README.md) / executeQuote

# Function: executeQuote()

> **executeQuote**(`params`): `Promise`\<`object` \| `object`\>

Executes a quote by:

1. Approving the SpokePool contract if necessary
2. Depositing the input token on the origin chain
3. Waiting for the deposit to be filled on the destination chain

## Parameters

• **params**: [`ExecuteQuoteParams`](../type-aliases/ExecuteQuoteParams.md)

See [ExecuteQuoteParams](../type-aliases/ExecuteQuoteParams.md).

## Returns

`Promise`\<`object` \| `object`\>

The deposit ID and receipts for the deposit and fill transactions.

## Defined in

[packages/sdk/src/actions/executeQuote.ts:167](https://github.com/across-protocol/toolkit/blob/fa61c35c7597804e093096de254dbc326f096003/packages/sdk/src/actions/executeQuote.ts#L167)
