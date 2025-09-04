[@across-protocol/app-sdk](../README.md) / GetSuggestedFeesReturnType

# Type Alias: GetSuggestedFeesReturnType

> **GetSuggestedFeesReturnType** = `object`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:69](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L69)

## Properties

### capitalFeePct

> **capitalFeePct**: `number`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:70](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L70)

***

### capitalFeeTotal

> **capitalFeeTotal**: `bigint`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:71](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L71)

***

### destinationSpokePoolAddress

> **destinationSpokePoolAddress**: `Address`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:110](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L110)

The spoke pool address on the destination chain.

***

### estimatedFillTimeSec

> **estimatedFillTimeSec**: `number`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:81](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L81)

The estimated fill time in seconds.

***

### exclusiveRelayer

> **exclusiveRelayer**: `string`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:98](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L98)

The exclusive relayer address. Will be the zero address if no exclusivity is
determined.

***

### exclusivityDeadline

> **exclusivityDeadline**: `number`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:102](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L102)

The exclusivity deadline. Will be 0 if no exclusivity is determined.

***

### fillDeadline

> **fillDeadline**: `number`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:77](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L77)

***

### inputToken

> **inputToken**: `object`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:154](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L154)

#### address

> **address**: `Address`

#### chainId

> **chainId**: `number`

#### decimals

> **decimals**: `number`

#### symbol

> **symbol**: `string`

***

### isAmountTooLow

> **isAmountTooLow**: `boolean`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:89](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L89)

Whether the deposit amount is too low.

***

### limits

> **limits**: `object`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:147](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L147)

The deposit limits.

#### maxDeposit

> **maxDeposit**: `bigint`

#### maxDepositInstant

> **maxDepositInstant**: `bigint`

#### maxDepositShortDelay

> **maxDepositShortDelay**: `bigint`

#### minDeposit

> **minDeposit**: `bigint`

#### recommendedDepositInstant

> **recommendedDepositInstant**: `bigint`

***

### lpFee

> **lpFee**: `object`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:140](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L140)

The lp fee.

#### pct

> **pct**: `bigint`

#### total

> **total**: `bigint`

***

### lpFeePct?

> `optional` **lpFeePct**: `string`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:76](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L76)

***

### outputAmount

> **outputAmount**: `bigint`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:114](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L114)

The output amount that will be received after deducting the fees.

***

### outputToken

> **outputToken**: `object`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:160](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L160)

#### address

> **address**: `Address`

#### chainId

> **chainId**: `number`

#### decimals

> **decimals**: `number`

#### symbol

> **symbol**: `string`

***

### quoteBlock

> **quoteBlock**: `number`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:93](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L93)

The quote block.

***

### relayerCapitalFee

> **relayerCapitalFee**: `object`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:126](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L126)

The relayer capital fee.

#### pct

> **pct**: `bigint`

#### total

> **total**: `bigint`

***

### relayerGasFee

> **relayerGasFee**: `object`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:133](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L133)

The relayer gas fee.

#### pct

> **pct**: `bigint`

#### total

> **total**: `bigint`

***

### relayFeePct

> **relayFeePct**: `number`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:74](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L74)

***

### relayFeeTotal

> **relayFeeTotal**: `bigint`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:75](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L75)

***

### relayGasFeePct

> **relayGasFeePct**: `number`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:72](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L72)

***

### relayGasFeeTotal

> **relayGasFeeTotal**: `bigint`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:73](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L73)

***

### spokePoolAddress

> **spokePoolAddress**: `Address`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:106](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L106)

The spoke pool address on the origin chain.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:85](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L85)

The timestamp of the quote.

***

### totalRelayFee

> **totalRelayFee**: `object`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:119](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L119)

The total relay fee, i.e. the sum of the relayer capital fee, the relayer gas fee,
and the lp fee.

#### pct

> **pct**: `bigint`

#### total

> **total**: `bigint`
