[@across-protocol/integrator-sdk](../README.md) / GetDepositLogsParams

# Type Alias: GetDepositLogsParams

> **GetDepositLogsParams**: `object`

## Type declaration

### filter?

> `optional` **filter**: `Partial`\<`object`\>

#### Type declaration

##### destinationChainId

> **destinationChainId**: `bigint`

##### inputAmount

> **inputAmount**: `bigint`

##### inputToken

> **inputToken**: `Address`

##### outputAmount

> **outputAmount**: `bigint`

##### outputToken

> **outputToken**: `Address`

### originChainId

> **originChainId**: `number`

### receipt

> **receipt**: `TransactionReceipt`

## Defined in

packages/sdk/src/actions/getDepositFromLogs.ts:5
