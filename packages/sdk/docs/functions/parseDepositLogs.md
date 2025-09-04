[@across-protocol/app-sdk](../README.md) / parseDepositLogs

# Function: parseDepositLogs()

> **parseDepositLogs**(`logs`, `filter?`): `undefined` \| [`DepositLog`](../type-aliases/DepositLog.md)

Defined in: [packages/sdk/src/actions/getDepositFromLogs.ts:20](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getDepositFromLogs.ts#L20)

## Parameters

### logs

`Log`[]

### filter?

`Partial`\<\{ `destinationChainId`: `bigint`; `inputAmount`: `bigint`; `inputToken`: `` `0x${string}` ``; `outputAmount`: `bigint`; `outputToken`: `` `0x${string}` ``; \}\>

## Returns

`undefined` \| [`DepositLog`](../type-aliases/DepositLog.md)
