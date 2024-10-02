[@across-protocol/integrator-sdk](../README.md) / SuggestedFeesQueryParams

# Type Alias: SuggestedFeesQueryParams

> **SuggestedFeesQueryParams**: `object`

## Type declaration

### amount

> **amount**: [`Amount`](Amount.md)

The amount of input tokens to deposit.

### destinationChainId

> **destinationChainId**: `number`

### inputToken

> **inputToken**: `Address`

The input token address on origin chain.

### isNative?

> `optional` **isNative**: `boolean`

[Optional] Whether the input token is a native token on the origin chain.
Defaults to `false`. Should be set to `true` for ETH only if origin chain is not
Polygon.

### message?

> `optional` **message**: `string`

[Optional] The cross-chain message of the deposit when using Across+ that should
be executed on the destination chain. Note that `amount` is required when using
Across+.

### originChainId

> **originChainId**: `number`

### outputToken

> **outputToken**: `Address`

The output token address on destination chain.

### recipient?

> `optional` **recipient**: `Address`

[Optional] The recipient address. Should in most cases be omitted but is required
when using Across+, i.e. when a cross-chain message is attached to the deposit.
This needs to be the address of the handler contract on the destination chain.

### relayer?

> `optional` **relayer**: `Address`

[Optional] The relayer address to simulate fill with. Defaults to the Across relayer.

### skipAmountLimit?

> `optional` **skipAmountLimit**: `boolean`

[Optional] Whether to skip the amount limit check. Defaults to `false`.

## Defined in

[packages/sdk/src/actions/getSuggestedFees.ts:6](https://github.com/across-protocol/toolkit/blob/291e746cb19cfa8d76835b72ba70acec1a2f9971/packages/sdk/src/actions/getSuggestedFees.ts#L6)
