[@across-protocol/app-sdk](../README.md) / GetQuoteParams

# Type Alias: GetQuoteParams

> **GetQuoteParams**: `object`

Params for [getQuote](../functions/getQuote.md).

## Type declaration

### apiUrl?

> `optional` **apiUrl**: `string`

[Optional] The Across API URL to use. Defaults to the mainnet API URL.

### crossChainMessage?

> `optional` **crossChainMessage**: `object` \| `Hex`

A cross-chain message to be executed on the destination chain. Can either
be a pre-constructed hex string or an object containing the actions to be
executed and the fallback recipient.

### inputAmount

> **inputAmount**: [`Amount`](Amount.md)

The input amount for deposit route.

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

[Optional] The logger to use.

### recipient?

> `optional` **recipient**: `Address`

[Optional] The recipient address. Should in most cases be omitted but is required
when using Across+, i.e. when a cross-chain message is attached to the deposit.
This needs to be the address of the handler contract on the destination chain.

### route

> **route**: `object`

### route.destinationChainId

> **destinationChainId**: `number`

The destination chain id for deposit route.

### route.inputToken

> **inputToken**: `Address`

The input token for deposit route.

### route.isNative?

> `optional` **isNative**: `boolean`

Whether the input token is a native token on the origin chain.
Defaults to `false`. Should be set to `true` for ETH only if origin chain is not
Polygon.

### route.originChainId

> **originChainId**: `number`

The origin chain id for deposit route.

### route.outputToken

> **outputToken**: `Address`

The output token for deposit route.

## Defined in

[packages/sdk/src/actions/getQuote.ts:13](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/actions/getQuote.ts#L13)
