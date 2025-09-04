[@across-protocol/app-sdk](../README.md) / ExecuteSwapQuoteParams

# Type Alias: ExecuteSwapQuoteParams

> **ExecuteSwapQuoteParams** = `object`

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:82](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L82)

Params for [executeSwapQuote](../functions/executeSwapQuote.md).

## Properties

### destinationClient

> **destinationClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:102](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L102)

The public client for the destination chain

***

### destinationSpokePoolAddress?

> `optional` **destinationSpokePoolAddress**: `Address`

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:106](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L106)

The address of the destination spoke pool.

***

### forceOriginChain?

> `optional` **forceOriginChain**: `boolean`

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:114](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L114)

Whether to force the origin chain by switching to it if necessary.

***

### integratorId

> **integratorId**: `Hex`

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:86](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L86)

An identifier for the integrator.

***

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:122](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L122)

The logger to use.

***

### onProgress()?

> `optional` **onProgress**: (`progress`) => `void`

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:118](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L118)

A handler for the execution progress. See [SwapExecutionProgress](SwapExecutionProgress.md) for steps.

#### Parameters

##### progress

[`SwapExecutionProgress`](SwapExecutionProgress.md)

#### Returns

`void`

***

### originClient

> **originClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:98](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L98)

The public client for the origin chain

***

### swapQuote

> **swapQuote**: `SwapApprovalApiResponse`

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:90](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L90)

The swap quote response from [getSwapQuote](../functions/getSwapQuote.md).

***

### throwOnError?

> `optional` **throwOnError**: `boolean`

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:110](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L110)

Whether to throw if an error occurs.

***

### walletClient

> **walletClient**: [`ConfiguredWalletClient`](ConfiguredWalletClient.md)

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:94](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L94)

The wallet client to use for the swap.
