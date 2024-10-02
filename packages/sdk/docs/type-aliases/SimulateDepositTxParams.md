[@across-protocol/integrator-sdk](../README.md) / SimulateDepositTxParams

# Type Alias: SimulateDepositTxParams

> **SimulateDepositTxParams**: `object`

## Type declaration

### deposit

> **deposit**: [`Quote`](Quote.md)\[`"deposit"`\] & `object`

#### Type declaration

##### fillDeadline?

> `optional` **fillDeadline**: `number`

### integratorId

> **integratorId**: `string`

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

### publicClient

> **publicClient**: `PublicClient`

### walletClient

> **walletClient**: `WalletClient`

## Defined in

[packages/sdk/src/actions/simulateDepositTx.ts:15](https://github.com/across-protocol/toolkit/blob/0408e9d38e7f5e4687131c33ea4b58d12a946b0d/packages/sdk/src/actions/simulateDepositTx.ts#L15)
