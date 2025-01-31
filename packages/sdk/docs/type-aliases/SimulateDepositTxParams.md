[@across-protocol/app-sdk](../README.md) / SimulateDepositTxParams

# Type Alias: SimulateDepositTxParams

> **SimulateDepositTxParams**: `object`

## Type declaration

### deposit

> **deposit**: [`Quote`](Quote.md)\[`"deposit"`\] & `object`

#### Type declaration

##### fillDeadline?

> `optional` **fillDeadline**: `number`

### integratorId

> **integratorId**: `Hex`

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

### publicClient

> **publicClient**: `PublicClient`

### walletClient

> **walletClient**: `WalletClient`

## Defined in

[packages/sdk/src/actions/simulateDepositTx.ts:12](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/actions/simulateDepositTx.ts#L12)
