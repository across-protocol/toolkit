[@across-protocol/app-sdk](../README.md) / AcrossApiError

# Class: AcrossApiError

## Extends

- [`HttpError`](HttpError.md)

## Extended by

- [`AcrossApiSimulationError`](AcrossApiSimulationError.md)

## Constructors

### new AcrossApiError()

> **new AcrossApiError**(`params`, `opts`?): [`AcrossApiError`](AcrossApiError.md)

#### Parameters

• **params**

• **params.code**: `"INVALID_PARAM"` \| `"MISSING_PARAM"` \| `"SIMULATION_ERROR"` \| `"AMOUNT_TOO_LOW"` \| `"AMOUNT_TOO_HIGH"` \| `"ROUTE_NOT_ENABLED"` \| `"UPSTREAM_RPC_ERROR"` \| `"UPSTREAM_HTTP_ERROR"`

• **params.message?**: `string`

• **params.name?**: `string`

• **params.status?**: `number`

• **params.url?**: `string`

• **opts?**: `ErrorOptions`

#### Returns

[`AcrossApiError`](AcrossApiError.md)

#### Overrides

[`HttpError`](HttpError.md).[`constructor`](HttpError.md#constructors)

#### Defined in

[packages/sdk/src/errors/index.ts:33](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/errors/index.ts#L33)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

[`HttpError`](HttpError.md).[`cause`](HttpError.md#cause)

#### Defined in

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

[`HttpError`](HttpError.md).[`message`](HttpError.md#message)

#### Defined in

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### name

> **name**: `string`

#### Inherited from

[`HttpError`](HttpError.md).[`name`](HttpError.md#name)

#### Defined in

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1075

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`HttpError`](HttpError.md).[`stack`](HttpError.md#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### status

> `readonly` **status**: `number`

#### Inherited from

[`HttpError`](HttpError.md).[`status`](HttpError.md#status)

#### Defined in

[packages/sdk/src/errors/index.ts:15](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/errors/index.ts#L15)

***

### url

> `readonly` **url**: `string`

#### Inherited from

[`HttpError`](HttpError.md).[`url`](HttpError.md#url)

#### Defined in

[packages/sdk/src/errors/index.ts:14](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/errors/index.ts#L14)

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`HttpError`](HttpError.md).[`prepareStackTrace`](HttpError.md#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.16.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`HttpError`](HttpError.md).[`stackTraceLimit`](HttpError.md#stacktracelimit)

#### Defined in

node\_modules/.pnpm/@types+node@20.16.2/node\_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

[`HttpError`](HttpError.md).[`captureStackTrace`](HttpError.md#capturestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.16.2/node\_modules/@types/node/globals.d.ts:21
