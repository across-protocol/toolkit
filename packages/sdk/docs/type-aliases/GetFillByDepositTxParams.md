[@across-protocol/integrator-sdk](../README.md) / GetFillByDepositTxParams

# Type Alias: GetFillByDepositTxParams

> **GetFillByDepositTxParams**: `object`

## Type declaration

### deposit

> **deposit**: `object`

### deposit.depositId

> **depositId**: `number`

### deposit.depositTxHash

> **depositTxHash**: `Hash`

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

[packages/sdk/src/actions/getFillByDepositTx.ts:15](https://github.com/across-protocol/toolkit/blob/0408e9d38e7f5e4687131c33ea4b58d12a946b0d/packages/sdk/src/actions/getFillByDepositTx.ts#L15)
