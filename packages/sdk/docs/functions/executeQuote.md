[@across-protocol/integrator-sdk](../globals.md) / executeQuote

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

[packages/sdk/src/actions/executeQuote.ts:167](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/actions/executeQuote.ts#L167)
