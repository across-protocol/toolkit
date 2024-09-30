[@across-protocol/integrator-sdk](../README.md) / GetFillByDepositTxParams

# Type Alias: GetFillByDepositTxParams

> **GetFillByDepositTxParams**: `Pick`\<[`Quote`](Quote.md), `"deposit"`\> & `object`

## Type declaration

### depositId

> **depositId**: [`DepositStatus`](DepositStatus.md)\[`"depositId"`\]

### depositTransactionHash

> **depositTransactionHash**: `Hash`

### destinationChainClient

> **destinationChainClient**: `PublicClient`

### fromBlock

> **fromBlock**: `bigint`

### indexerUrl?

> `optional` **indexerUrl**: `string`

## Defined in

[packages/sdk/src/actions/getFillByDepositTx.ts:16](https://github.com/across-protocol/toolkit/blob/fa61c35c7597804e093096de254dbc326f096003/packages/sdk/src/actions/getFillByDepositTx.ts#L16)
