[@across-protocol/integrator-sdk](../README.md) / GetSuggestedFeesReturnType

# Type Alias: GetSuggestedFeesReturnType

> **GetSuggestedFeesReturnType**: `object`

## Type declaration

### destinationSpokePoolAddress

> **destinationSpokePoolAddress**: `Address`

The spoke pool address on the destination chain.

### estimatedFillTimeSec

> **estimatedFillTimeSec**: `number`

The estimated fill time in seconds.

### exclusiveRelayer

> **exclusiveRelayer**: `string`

The exclusive relayer address. Will be the zero address if no exclusivity is
determined.

### exclusivityDeadline

> **exclusivityDeadline**: `number`

The exclusivity deadline. Will be 0 if no exclusivity is determined.

### isAmountTooLow

> **isAmountTooLow**: `boolean`

Whether the deposit amount is too low.

### limits

> **limits**: `object`

The deposit limits.

### limits.maxDeposit

> **maxDeposit**: `bigint`

### limits.maxDepositInstant

> **maxDepositInstant**: `bigint`

### limits.minDeposit

> **minDeposit**: `bigint`

### lpFee

> **lpFee**: `object`

The lp fee.

### lpFee.pct

> **pct**: `bigint`

### lpFee.total

> **total**: `bigint`

### outputAmount

> **outputAmount**: `bigint`

The output amount that will be received after deducting the fees.

### quoteBlock

> **quoteBlock**: `number`

The quote block.

### relayerCapitalFee

> **relayerCapitalFee**: `object`

The relayer capital fee.

### relayerCapitalFee.pct

> **pct**: `bigint`

### relayerCapitalFee.total

> **total**: `bigint`

### relayerGasFee

> **relayerGasFee**: `object`

The relayer gas fee.

### relayerGasFee.pct

> **pct**: `bigint`

### relayerGasFee.total

> **total**: `bigint`

### spokePoolAddress

> **spokePoolAddress**: `Address`

The spoke pool address on the origin chain.

### timestamp

> **timestamp**: `number`

The timestamp of the quote.

### totalRelayFee

> **totalRelayFee**: `object`

The total relay fee, i.e. the sum of the relayer capital fee, the relayer gas fee,
and the lp fee.

### totalRelayFee.pct

> **pct**: `bigint`

### totalRelayFee.total

> **total**: `bigint`

## Defined in

[packages/sdk/src/actions/getSuggestedFees.ts:63](https://github.com/across-protocol/toolkit/blob/fa61c35c7597804e093096de254dbc326f096003/packages/sdk/src/actions/getSuggestedFees.ts#L63)
