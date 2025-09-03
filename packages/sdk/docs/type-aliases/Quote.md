[@across-protocol/app-sdk](../README.md) / Quote

# Type Alias: Quote

> **Quote** = `object`

Defined in: [packages/sdk/src/actions/getQuote.ts:69](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L69)

## Properties

### deposit

> **deposit**: `object`

Defined in: [packages/sdk/src/actions/getQuote.ts:70](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L70)

#### destinationChainId

> **destinationChainId**: `number`

#### destinationSpokePoolAddress

> **destinationSpokePoolAddress**: `Address`

#### exclusiveRelayer

> **exclusiveRelayer**: `Address`

#### exclusivityDeadline

> **exclusivityDeadline**: `number`

#### fillDeadline

> **fillDeadline**: `number`

#### inputAmount

> **inputAmount**: `bigint`

#### inputToken

> **inputToken**: `Address`

#### isNative?

> `optional` **isNative**: `boolean`

#### message

> **message**: `Hex`

#### originChainId

> **originChainId**: `number`

#### outputAmount

> **outputAmount**: `bigint`

#### outputToken

> **outputToken**: `Address`

#### quoteTimestamp

> **quoteTimestamp**: `number`

#### recipient

> **recipient**: `Address`

#### spokePoolAddress

> **spokePoolAddress**: `Address`

***

### estimatedFillTimeSec

> **estimatedFillTimeSec**: `number`

Defined in: [packages/sdk/src/actions/getQuote.ts:111](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L111)

***

### fees

> **fees**: `object`

Defined in: [packages/sdk/src/actions/getQuote.ts:92](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L92)

#### lpFee

> **lpFee**: `object`

##### lpFee.pct

> **pct**: `bigint`

##### lpFee.total

> **total**: `bigint`

#### relayerCapitalFee

> **relayerCapitalFee**: `object`

##### relayerCapitalFee.pct

> **pct**: `bigint`

##### relayerCapitalFee.total

> **total**: `bigint`

#### relayerGasFee

> **relayerGasFee**: `object`

##### relayerGasFee.pct

> **pct**: `bigint`

##### relayerGasFee.total

> **total**: `bigint`

#### totalRelayFee

> **totalRelayFee**: `object`

##### totalRelayFee.pct

> **pct**: `bigint`

##### totalRelayFee.total

> **total**: `bigint`

***

### isAmountTooLow

> **isAmountTooLow**: `boolean`

Defined in: [packages/sdk/src/actions/getQuote.ts:110](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L110)

***

### limits

> **limits**: `object`

Defined in: [packages/sdk/src/actions/getQuote.ts:87](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L87)

#### maxDeposit

> **maxDeposit**: `bigint`

#### maxDepositInstant

> **maxDepositInstant**: `bigint`

#### minDeposit

> **minDeposit**: `bigint`
