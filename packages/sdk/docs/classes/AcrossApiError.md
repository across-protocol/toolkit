[@across-protocol/app-sdk](../README.md) / AcrossApiError

# Class: AcrossApiError

Defined in: [packages/sdk/src/errors/index.ts:32](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L32)

## Extends

- [`HttpError`](HttpError.md)

## Extended by

- [`AcrossApiSimulationError`](AcrossApiSimulationError.md)

## Constructors

### Constructor

> **new AcrossApiError**(`params`, `opts?`): `AcrossApiError`

Defined in: [packages/sdk/src/errors/index.ts:33](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L33)

#### Parameters

##### params

###### code

`"INVALID_PARAM"` \| `"INVALID_METHOD"` \| `"MISSING_PARAM"` \| `"SIMULATION_ERROR"` \| `"AMOUNT_TOO_LOW"` \| `"AMOUNT_TOO_HIGH"` \| `"ROUTE_NOT_ENABLED"` \| `"SWAP_LIQUIDITY_INSUFFICIENT"` \| `"SWAP_QUOTE_UNAVAILABLE"` \| `"SWAP_TYPE_NOT_GUARANTEED"` \| `"ABI_ENCODING_ERROR"` \| `"UPSTREAM_RPC_ERROR"` \| `"UPSTREAM_HTTP_ERROR"` \| `"UPSTREAM_GATEWAY_TIMEOUT"` \| `"UNEXPECTED_ERROR"`

###### message?

`string`

###### name?

`string`

###### requestId?

`string`

###### status

`number`

###### url

`string`

##### opts?

`ErrorOptions`

#### Returns

`AcrossApiError`

#### Overrides

[`HttpError`](HttpError.md).[`constructor`](HttpError.md#constructor)

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

#### Inherited from

[`HttpError`](HttpError.md).[`cause`](HttpError.md#cause)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

[`HttpError`](HttpError.md).[`message`](HttpError.md#message)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

[`HttpError`](HttpError.md).[`name`](HttpError.md#name)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

[`HttpError`](HttpError.md).[`stack`](HttpError.md#stack)

***

### status

> `readonly` **status**: `number`

Defined in: [packages/sdk/src/errors/index.ts:15](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L15)

#### Inherited from

[`HttpError`](HttpError.md).[`status`](HttpError.md#status)

***

### url

> `readonly` **url**: `string`

Defined in: [packages/sdk/src/errors/index.ts:14](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L14)

#### Inherited from

[`HttpError`](HttpError.md).[`url`](HttpError.md#url)

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/.pnpm/@types+node@20.17.16/node\_modules/@types/node/globals.d.ts:98

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`HttpError`](HttpError.md).[`prepareStackTrace`](HttpError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@20.17.16/node\_modules/@types/node/globals.d.ts:100

#### Inherited from

[`HttpError`](HttpError.md).[`stackTraceLimit`](HttpError.md#stacktracelimit)

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/@types+node@20.17.16/node\_modules/@types/node/globals.d.ts:91

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

[`HttpError`](HttpError.md).[`captureStackTrace`](HttpError.md#capturestacktrace)
