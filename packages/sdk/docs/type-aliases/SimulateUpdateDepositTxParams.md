[@across-protocol/app-sdk](../README.md) / SimulateUpdateDepositTxParams

# Type Alias: SimulateUpdateDepositTxParams

> **SimulateUpdateDepositTxParams**: `object`

## Type declaration

### apiUrl?

> `optional` **apiUrl**: `string`

### deposit

> **deposit**: `object`

### deposit.depositId

> **depositId**: `bigint` \| `number`

### deposit.destinationChainId

> **destinationChainId**: `number`

### deposit.destinationSpokePoolAddress

> **destinationSpokePoolAddress**: `Address`

### deposit.originChainId

> **originChainId**: `number`

### deposit.originSpokePoolAddress

> **originSpokePoolAddress**: `Address`

### destinationChainClient

> **destinationChainClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

### originChainClient

> **originChainClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

### update

> **update**: `Partial`\<`object`\>

#### Type declaration

##### crossChainMessage

> **crossChainMessage**: `object` \| `Hex`

##### outputAmount

> **outputAmount**: `bigint`

##### recipient

> **recipient**: `Address`

### walletClient

> **walletClient**: `WalletClient`

## Defined in

[packages/sdk/src/actions/simulateUpdateDepositTx.ts:9](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/actions/simulateUpdateDepositTx.ts#L9)
