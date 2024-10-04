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

> **integratorId**: `string`

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

### publicClient

> **publicClient**: `PublicClient`

### walletClient

> **walletClient**: `WalletClient`

## Defined in

[packages/sdk/src/actions/simulateDepositTx.ts:15](https://github.com/across-protocol/toolkit/blob/fa61c35c7597804e093096de254dbc326f096003/packages/sdk/src/actions/simulateDepositTx.ts#L15)
