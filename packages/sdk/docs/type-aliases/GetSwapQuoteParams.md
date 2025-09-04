[@across-protocol/app-sdk](../README.md) / GetSwapQuoteParams

# Type Alias: GetSwapQuoteParams

> **GetSwapQuoteParams** = `Omit`\<`BaseSwapQueryParams`, `"amount"` \| `"inputToken"` \| `"outputToken"` \| `"originChainId"` \| `"destinationChainId"` \| `"skipOriginTxEstimation"` \| `"slippage"` \| `"appFee"`\> & `object`

Defined in: [packages/sdk/src/actions/getSwapQuote.ts:14](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSwapQuote.ts#L14)

Params for [getSwapQuote](../functions/getSwapQuote.md).

## Type Declaration

### actions?

> `optional` **actions**: [`Action`](Action.md)[]

### amount

> **amount**: [`Amount`](Amount.md)

### apiUrl?

> `optional` **apiUrl**: `string`

[Optional] The Across API URL to use. Defaults to the mainnet API URL.

### appFee?

> `optional` **appFee**: `number`

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

[Optional] The logger to use.

### route

> **route**: `object`

#### route.destinationChainId

> **destinationChainId**: `number`

#### route.inputToken

> **inputToken**: `Address`

#### route.originChainId

> **originChainId**: `number`

#### route.outputToken

> **outputToken**: `Address`

### skipOriginTxEstimation?

> `optional` **skipOriginTxEstimation**: `boolean`

### slippage?

> `optional` **slippage**: `number`
