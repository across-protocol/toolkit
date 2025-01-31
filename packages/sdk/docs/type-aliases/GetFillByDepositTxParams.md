[@across-protocol/app-sdk](../README.md) / GetFillByDepositTxParams

# Type Alias: GetFillByDepositTxParams

> **GetFillByDepositTxParams**: `object`

## Type declaration

### deposit

> **deposit**: `object`

### deposit.depositId

> **depositId**: `bigint` \| `number`

### deposit.depositTxHash?

> `optional` **depositTxHash**: `Hash`

### deposit.destinationChainId

> **destinationChainId**: `number`

### deposit.destinationSpokePoolAddress

> **destinationSpokePoolAddress**: `Address`

### deposit.message

> **message**: `Hex`

### deposit.originChainId

> **originChainId**: `number`

### destinationChainClient

> **destinationChainClient**: `PublicClient`

### fromBlock?

> `optional` **fromBlock**: `bigint`

### indexerUrl?

> `optional` **indexerUrl**: `string`

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

## Defined in

[packages/sdk/src/actions/getFillByDepositTx.ts:16](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/actions/getFillByDepositTx.ts#L16)
