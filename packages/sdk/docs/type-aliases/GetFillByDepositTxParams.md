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

[packages/sdk/src/actions/getFillByDepositTx.ts:15](https://github.com/across-protocol/toolkit/blob/291e746cb19cfa8d76835b72ba70acec1a2f9971/packages/sdk/src/actions/getFillByDepositTx.ts#L15)
