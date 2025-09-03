[@across-protocol/app-sdk](../README.md) / parseFillLogs

# Function: parseFillLogs()

> **parseFillLogs**(`logs`, `filter?`): `undefined` \| \{ `depositId`: `bigint`; `depositor`: `` `0x${string}` ``; `depositTxBlock`: `bigint`; `depositTxHash`: `` `0x${string}` ``; `exclusiveRelayer`: `` `0x${string}` ``; `exclusivityDeadline`: `number`; `fillDeadline`: `number`; `inputAmount`: `bigint`; `inputToken`: `` `0x${string}` ``; `messageHash`: `` `0x${string}` ``; `originChainId`: `bigint`; `outputAmount`: `bigint`; `outputToken`: `` `0x${string}` ``; `recipient`: `` `0x${string}` ``; `relayer`: `` `0x${string}` ``; `relayExecutionInfo`: \{ `fillType`: `undefined` \| `string`; `updatedMessageHash`: `` `0x${string}` ``; `updatedOutputAmount`: `bigint`; `updatedRecipient`: `` `0x${string}` ``; \}; `repaymentChainId`: `bigint`; \} \| \{ `depositId`: `number`; `depositor`: `` `0x${string}` ``; `depositTxBlock`: `bigint`; `depositTxHash`: `` `0x${string}` ``; `exclusiveRelayer`: `` `0x${string}` ``; `exclusivityDeadline`: `number`; `fillDeadline`: `number`; `inputAmount`: `bigint`; `inputToken`: `` `0x${string}` ``; `message`: `` `0x${string}` ``; `originChainId`: `bigint`; `outputAmount`: `bigint`; `outputToken`: `` `0x${string}` ``; `recipient`: `` `0x${string}` ``; `relayer`: `` `0x${string}` ``; `relayExecutionInfo`: \{ `fillType`: `undefined` \| `string`; `updatedMessage`: `` `0x${string}` ``; `updatedOutputAmount`: `bigint`; `updatedRecipient`: `` `0x${string}` ``; \}; `repaymentChainId`: `bigint`; \}

Defined in: [packages/sdk/src/actions/waitForFillTx.ts:152](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/waitForFillTx.ts#L152)

## Parameters

### logs

`Log`[]

### filter?

`Partial`\<\{ `depositId`: `number` \| `bigint`; `depositor`: `` `0x${string}` ``; `inputAmount`: `bigint`; `inputToken`: `` `0x${string}` ``; `originChainId`: `bigint`; `outputAmount`: `bigint`; `outputToken`: `` `0x${string}` ``; \}\>

## Returns

`undefined` \| \{ `depositId`: `bigint`; `depositor`: `` `0x${string}` ``; `depositTxBlock`: `bigint`; `depositTxHash`: `` `0x${string}` ``; `exclusiveRelayer`: `` `0x${string}` ``; `exclusivityDeadline`: `number`; `fillDeadline`: `number`; `inputAmount`: `bigint`; `inputToken`: `` `0x${string}` ``; `messageHash`: `` `0x${string}` ``; `originChainId`: `bigint`; `outputAmount`: `bigint`; `outputToken`: `` `0x${string}` ``; `recipient`: `` `0x${string}` ``; `relayer`: `` `0x${string}` ``; `relayExecutionInfo`: \{ `fillType`: `undefined` \| `string`; `updatedMessageHash`: `` `0x${string}` ``; `updatedOutputAmount`: `bigint`; `updatedRecipient`: `` `0x${string}` ``; \}; `repaymentChainId`: `bigint`; \} \| \{ `depositId`: `number`; `depositor`: `` `0x${string}` ``; `depositTxBlock`: `bigint`; `depositTxHash`: `` `0x${string}` ``; `exclusiveRelayer`: `` `0x${string}` ``; `exclusivityDeadline`: `number`; `fillDeadline`: `number`; `inputAmount`: `bigint`; `inputToken`: `` `0x${string}` ``; `message`: `` `0x${string}` ``; `originChainId`: `bigint`; `outputAmount`: `bigint`; `outputToken`: `` `0x${string}` ``; `recipient`: `` `0x${string}` ``; `relayer`: `` `0x${string}` ``; `relayExecutionInfo`: \{ `fillType`: `undefined` \| `string`; `updatedMessage`: `` `0x${string}` ``; `updatedOutputAmount`: `bigint`; `updatedRecipient`: `` `0x${string}` ``; \}; `repaymentChainId`: `bigint`; \}
