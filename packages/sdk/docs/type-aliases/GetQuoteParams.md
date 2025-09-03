[@across-protocol/app-sdk](../README.md) / GetQuoteParams

# Type Alias: GetQuoteParams

> **GetQuoteParams** = `object`

Defined in: [packages/sdk/src/actions/getQuote.ts:13](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L13)

Params for [getQuote](../functions/getQuote.md).

## Properties

### apiUrl?

> `optional` **apiUrl**: `string`

Defined in: [packages/sdk/src/actions/getQuote.ts:49](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L49)

[Optional] The Across API URL to use. Defaults to the mainnet API URL.

***

### crossChainMessage?

> `optional` **crossChainMessage**: \{ `actions`: [`CrossChainAction`](CrossChainAction.md)[]; `fallbackRecipient`: `Address`; \} \| `Hex`

Defined in: [packages/sdk/src/actions/getQuote.ts:61](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L61)

A cross-chain message to be executed on the destination chain. Can either
be a pre-constructed hex string or an object containing the actions to be
executed and the fallback recipient.

***

### inputAmount

> **inputAmount**: [`Amount`](Amount.md)

Defined in: [packages/sdk/src/actions/getQuote.ts:41](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L41)

The input amount for deposit route.

***

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

Defined in: [packages/sdk/src/actions/getQuote.ts:45](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L45)

[Optional] The logger to use.

***

### recipient?

> `optional` **recipient**: `Address`

Defined in: [packages/sdk/src/actions/getQuote.ts:55](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L55)

[Optional] The recipient address. Should in most cases be omitted but is required
when using Across+, i.e. when a cross-chain message is attached to the deposit.
This needs to be the address of the handler contract on the destination chain.

***

### route

> **route**: `object`

Defined in: [packages/sdk/src/actions/getQuote.ts:14](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getQuote.ts#L14)

#### destinationChainId

> **destinationChainId**: `number`

The destination chain id for deposit route.

#### inputToken

> **inputToken**: `Address`

The input token for deposit route.

#### isNative?

> `optional` **isNative**: `boolean`

Whether the input token is a native token on the origin chain.
Defaults to `false`. Should be set to `true` for ETH only if origin chain is not
Polygon.

#### originChainId

> **originChainId**: `number`

The origin chain id for deposit route.

#### outputToken

> **outputToken**: `Address`

The output token for deposit route.
