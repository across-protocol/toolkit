[@across-protocol/integrator-sdk](../README.md) / getSuggestedFees

# Function: getSuggestedFees()

> **getSuggestedFees**(`params`): `Promise`\<`object`\>

Returns the suggested fees for a given deposit route.

## Parameters

• **params**: [`GetSuggestedFeesParams`](../type-aliases/GetSuggestedFeesParams.md)

See [GetSuggestedFeesParams](../type-aliases/GetSuggestedFeesParams.md).

## Returns

`Promise`\<`object`\>

See [GetSuggestedFeesReturnType](../type-aliases/GetSuggestedFeesReturnType.md).

### destinationSpokePoolAddress

> **destinationSpokePoolAddress**: \`0x$\{string\}\`

### estimatedFillTimeSec

> **estimatedFillTimeSec**: `number` = `data.estimatedFillTimeSec`

### exclusiveRelayer

> **exclusiveRelayer**: \`0x$\{string\}\`

### exclusivityDeadline

> **exclusivityDeadline**: `number` = `data.exclusivityDeadline`

### isAmountTooLow

> **isAmountTooLow**: `boolean` = `data.isAmountTooLow`

### limits

> **limits**: `object`

### limits.maxDeposit

> **maxDeposit**: `bigint`

### limits.maxDepositInstant

> **maxDepositInstant**: `bigint`

### limits.minDeposit

> **minDeposit**: `bigint`

### lpFee

> **lpFee**: `object`

### lpFee.pct

> **pct**: `bigint`

### lpFee.total

> **total**: `bigint`

### outputAmount

> **outputAmount**: `bigint`

### quoteBlock

> **quoteBlock**: `number`

### relayerCapitalFee

> **relayerCapitalFee**: `object`

### relayerCapitalFee.pct

> **pct**: `bigint`

### relayerCapitalFee.total

> **total**: `bigint`

### relayerGasFee

> **relayerGasFee**: `object`

### relayerGasFee.pct

> **pct**: `bigint`

### relayerGasFee.total

> **total**: `bigint`

### spokePoolAddress

> **spokePoolAddress**: \`0x$\{string\}\`

### timestamp

> **timestamp**: `number`

### totalRelayFee

> **totalRelayFee**: `object`

### totalRelayFee.pct

> **pct**: `bigint`

### totalRelayFee.total

> **total**: `bigint`

## Defined in

[packages/sdk/src/actions/getSuggestedFees.ts:146](https://github.com/across-protocol/toolkit/blob/fa61c35c7597804e093096de254dbc326f096003/packages/sdk/src/actions/getSuggestedFees.ts#L146)
