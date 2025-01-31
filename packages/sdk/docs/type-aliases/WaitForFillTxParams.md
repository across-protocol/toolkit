[@across-protocol/app-sdk](../README.md) / WaitForFillTxParams

# Type Alias: WaitForFillTxParams

> **WaitForFillTxParams**: `object`

## Type declaration

### deposit

> **deposit**: `object`

### deposit.destinationChainId

> **destinationChainId**: `number`

### deposit.destinationSpokePoolAddress

> **destinationSpokePoolAddress**: `Address`

### deposit.message

> **message**: `Hex`

### deposit.originChainId

> **originChainId**: `number`

### depositId

> **depositId**: `bigint` \| `number`

### depositTxHash?

> `optional` **depositTxHash**: `Hash`

### destinationChainClient

> **destinationChainClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

### fromBlock

> **fromBlock**: `bigint`

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

## Defined in

[packages/sdk/src/actions/waitForFillTx.ts:11](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/actions/waitForFillTx.ts#L11)
