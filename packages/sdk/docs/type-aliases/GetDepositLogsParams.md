[@across-protocol/app-sdk](../README.md) / GetDepositLogsParams

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

[packages/sdk/src/actions/getDepositFromLogs.ts:6](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/actions/getDepositFromLogs.ts#L6)
