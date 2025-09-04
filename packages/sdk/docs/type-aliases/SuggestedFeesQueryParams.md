[@across-protocol/app-sdk](../README.md) / SuggestedFeesQueryParams

# Type Alias: SuggestedFeesQueryParams

> **SuggestedFeesQueryParams** = `object`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:7](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L7)

## Properties

### allowUnmatchedDecimals?

> `optional` **allowUnmatchedDecimals**: `boolean`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:52](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L52)

[Optional] Caller specifies whether to includes routes where input token
and output token do not have the same decimals

***

### amount

> **amount**: [`Amount`](Amount.md)

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:21](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L21)

The amount of input tokens to deposit.

***

### destinationChainId

> **destinationChainId**: `number`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:9](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L9)

***

### inputToken

> **inputToken**: `Address`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:13](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L13)

The input token address on origin chain.

***

### isNative?

> `optional` **isNative**: `boolean`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:27](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L27)

[Optional] Whether the input token is a native token on the origin chain.
Defaults to `false`. Should be set to `true` for ETH only if origin chain is not
Polygon.

***

### message?

> `optional` **message**: `string`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:33](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L33)

[Optional] The cross-chain message of the deposit when using Across+ that should
be executed on the destination chain. Note that `amount` is required when using
Across+.

***

### originChainId

> **originChainId**: `number`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:8](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L8)

***

### outputToken

> **outputToken**: `Address`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:17](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L17)

The output token address on destination chain.

***

### recipient?

> `optional` **recipient**: `Address`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:39](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L39)

[Optional] The recipient address. Should in most cases be omitted but is required
when using Across+, i.e. when a cross-chain message is attached to the deposit.
This needs to be the address of the handler contract on the destination chain.

***

### relayer?

> `optional` **relayer**: `Address`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:43](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L43)

[Optional] The relayer address to simulate fill with. Defaults to the Across relayer.

***

### skipAmountLimit?

> `optional` **skipAmountLimit**: `boolean`

Defined in: [packages/sdk/src/actions/getSuggestedFees.ts:47](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getSuggestedFees.ts#L47)

[Optional] Whether to skip the amount limit check. Defaults to `false`.
