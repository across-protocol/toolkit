[@across-protocol/app-sdk](../README.md) / parseSuggestedFees

# Function: parseSuggestedFees()

> **parseSuggestedFees**(`raw`): [`GetSuggestedFeesReturnType`](../type-aliases/GetSuggestedFeesReturnType.md)

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:188](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L188)

## Parameters

### raw

#### capitalFeePct

`string` = `percentageString`

#### capitalFeeTotal

`string` = `bigNumberString`

#### destinationSpokePoolAddress

`string` = `ethereumAddress`

#### estimatedFillTimeSec

`number` = `positiveInteger`

#### exclusiveRelayer

`string` = `ethereumAddress`

#### exclusivityDeadline

`number` = `...`

#### fillDeadline

`string` = `numericString`

#### inputToken

\{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \} = `...`

#### inputToken.address

`string` = `ethereumAddress`

#### inputToken.chainId

`number` = `...`

#### inputToken.decimals

`number` = `...`

#### inputToken.symbol

`string` = `...`

#### isAmountTooLow

`boolean` = `...`

#### limits

\{ `maxDeposit`: `string`; `maxDepositInstant`: `string`; `maxDepositShortDelay`: `string`; `minDeposit`: `string`; `recommendedDepositInstant`: `string`; \} = `...`

#### limits.maxDeposit

`string` = `bigNumberString`

#### limits.maxDepositInstant

`string` = `bigNumberString`

#### limits.maxDepositShortDelay

`string` = `bigNumberString`

#### limits.minDeposit

`string` = `bigNumberString`

#### limits.recommendedDepositInstant

`string` = `bigNumberString`

#### lpFee

\{ `pct`: `string`; `total`: `string`; \} = `...`

#### lpFee.pct

`string` = `percentageString`

#### lpFee.total

`string` = `bigNumberString`

#### lpFeePct

`string` = `percentageString`

#### outputAmount

`string` = `bigNumberString`

#### outputToken

\{ `address`: `string`; `chainId`: `number`; `decimals`: `number`; `symbol`: `string`; \} = `...`

#### outputToken.address

`string` = `ethereumAddress`

#### outputToken.chainId

`number` = `...`

#### outputToken.decimals

`number` = `...`

#### outputToken.symbol

`string` = `...`

#### quoteBlock

`string` = `numericString`

#### relayerCapitalFee

\{ `pct`: `string`; `total`: `string`; \} = `...`

#### relayerCapitalFee.pct

`string` = `percentageString`

#### relayerCapitalFee.total

`string` = `bigNumberString`

#### relayerGasFee

\{ `pct`: `string`; `total`: `string`; \} = `...`

#### relayerGasFee.pct

`string` = `percentageString`

#### relayerGasFee.total

`string` = `bigNumberString`

#### relayFeePct

`string` = `percentageString`

#### relayFeeTotal

`string` = `bigNumberString`

#### relayGasFeePct

`string` = `percentageString`

#### relayGasFeeTotal

`string` = `bigNumberString`

#### spokePoolAddress

`string` = `ethereumAddress`

#### timestamp

`string` = `numericString`

#### totalRelayFee

\{ `pct`: `string`; `total`: `string`; \} = `...`

#### totalRelayFee.pct

`string` = `percentageString`

#### totalRelayFee.total

`string` = `bigNumberString`

## Returns

[`GetSuggestedFeesReturnType`](../type-aliases/GetSuggestedFeesReturnType.md)
