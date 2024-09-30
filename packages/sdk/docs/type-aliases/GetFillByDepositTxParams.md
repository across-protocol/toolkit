[@across-protocol/integrator-sdk](../globals.md) / GetFillByDepositTxParams

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

[packages/sdk/src/actions/getFillByDepositTx.ts:16](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/actions/getFillByDepositTx.ts#L16)
