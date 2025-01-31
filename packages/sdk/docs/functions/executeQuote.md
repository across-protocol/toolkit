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

[packages/sdk/src/actions/executeQuote.ts:172](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/actions/executeQuote.ts#L172)
