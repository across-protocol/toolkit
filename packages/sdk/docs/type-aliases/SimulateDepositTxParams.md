[@across-protocol/integrator-sdk](../globals.md) / SimulateDepositTxParams

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

[packages/sdk/src/actions/simulateDepositTx.ts:15](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/actions/simulateDepositTx.ts#L15)
