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

[packages/sdk/src/actions/getDepositFromLogs.ts:5](https://github.com/across-protocol/toolkit/blob/291e746cb19cfa8d76835b72ba70acec1a2f9971/packages/sdk/src/actions/getDepositFromLogs.ts#L5)
