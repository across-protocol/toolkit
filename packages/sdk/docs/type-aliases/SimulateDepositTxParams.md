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

[packages/sdk/src/actions/simulateDepositTx.ts:15](https://github.com/across-protocol/toolkit/blob/291e746cb19cfa8d76835b72ba70acec1a2f9971/packages/sdk/src/actions/simulateDepositTx.ts#L15)
