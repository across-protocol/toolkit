[@across-protocol/app-sdk](../README.md) / AcrossApiSimulationError

# Class: AcrossApiSimulationError

Defined in: [packages/sdk/src/errors/index.ts:54](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L54)

## Extends

- [`AcrossApiError`](AcrossApiError.md)

## Constructors

### Constructor

> **new AcrossApiSimulationError**(`params`, `opts?`): `AcrossApiSimulationError`

Defined in: [packages/sdk/src/errors/index.ts:62](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L62)

#### Parameters

##### params

###### message?

`string`

###### requestId?

`string`

###### transaction

\{ `data`: `` `0x${string}` ``; `from`: `` `0x${string}` ``; `to`: `` `0x${string}` ``; `value?`: `string`; \}

###### transaction.data

`` `0x${string}` ``

###### transaction.from

`` `0x${string}` ``

###### transaction.to

`` `0x${string}` ``

###### transaction.value?

`string`

###### url

`string`

##### opts?

`ErrorOptions`

#### Returns

`AcrossApiSimulationError`

#### Overrides

[`AcrossApiError`](AcrossApiError.md).[`constructor`](AcrossApiError.md#constructor)

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`cause`](AcrossApiError.md#cause)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`message`](AcrossApiError.md#message)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`name`](AcrossApiError.md#name)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`stack`](AcrossApiError.md#stack)

***

### status

> `readonly` **status**: `number`

Defined in: [packages/sdk/src/errors/index.ts:15](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L15)

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`status`](AcrossApiError.md#status)

***

### transaction

> `readonly` **transaction**: `object`

Defined in: [packages/sdk/src/errors/index.ts:55](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L55)

#### data

> **data**: `` `0x${string}` ``

#### from

> **from**: `` `0x${string}` ``

#### to

> **to**: `` `0x${string}` ``

#### value?

> `optional` **value**: `string`

***

### url

> `readonly` **url**: `string`

Defined in: [packages/sdk/src/errors/index.ts:14](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L14)

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`url`](AcrossApiError.md#url)

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

[`AcrossApiError`](AcrossApiError.md).[`prepareStackTrace`](AcrossApiError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@20.17.16/node\_modules/@types/node/globals.d.ts:100

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`stackTraceLimit`](AcrossApiError.md#stacktracelimit)

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

[`AcrossApiError`](AcrossApiError.md).[`captureStackTrace`](AcrossApiError.md#capturestacktrace)
