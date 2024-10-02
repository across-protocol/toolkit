[@across-protocol/integrator-sdk](../README.md) / Quote

# Type Alias: Quote

> **Quote**: `object`

## Type declaration

### deposit

> **deposit**: `object`

### deposit.destinationChainId

> **destinationChainId**: `number`

### deposit.destinationSpokePoolAddress

> **destinationSpokePoolAddress**: `Address`

### deposit.exclusiveRelayer

> **exclusiveRelayer**: `Address`

### deposit.exclusivityDeadline

> **exclusivityDeadline**: `number`

### deposit.inputAmount

> **inputAmount**: `bigint`

### deposit.inputToken

> **inputToken**: `Address`

### deposit.isNative?

> `optional` **isNative**: `boolean`

### deposit.message

> **message**: `Hex`

### deposit.originChainId

> **originChainId**: `number`

### deposit.outputAmount

> **outputAmount**: `bigint`

### deposit.outputToken

> **outputToken**: `Address`

### deposit.quoteTimestamp

> **quoteTimestamp**: `number`

### deposit.recipient

> **recipient**: `Address`

### deposit.spokePoolAddress

> **spokePoolAddress**: `Address`

### estimatedFillTimeSec

> **estimatedFillTimeSec**: `number`

### fees

> **fees**: `object`

### fees.lpFee

> **lpFee**: `object`

### fees.lpFee.pct

> **pct**: `bigint`

### fees.lpFee.total

> **total**: `bigint`

### fees.relayerCapitalFee

> **relayerCapitalFee**: `object`

### fees.relayerCapitalFee.pct

> **pct**: `bigint`

### fees.relayerCapitalFee.total

> **total**: `bigint`

### fees.relayerGasFee

> **relayerGasFee**: `object`

### fees.relayerGasFee.pct

> **pct**: `bigint`

### fees.relayerGasFee.total

> **total**: `bigint`

### fees.totalRelayFee

> **totalRelayFee**: `object`

### fees.totalRelayFee.pct

> **pct**: `bigint`

### fees.totalRelayFee.total

> **total**: `bigint`

### isAmountTooLow

> **isAmountTooLow**: `boolean`

### limits

> **limits**: `object`

### limits.maxDeposit

> **maxDeposit**: `bigint`

### limits.maxDepositInstant

> **maxDepositInstant**: `bigint`

### limits.minDeposit

> **minDeposit**: `bigint`

## Defined in

[packages/sdk/src/actions/getQuote.ts:69](https://github.com/across-protocol/toolkit/blob/291e746cb19cfa8d76835b72ba70acec1a2f9971/packages/sdk/src/actions/getQuote.ts#L69)
