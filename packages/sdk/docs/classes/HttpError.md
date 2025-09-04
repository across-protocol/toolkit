[@across-protocol/app-sdk](../README.md) / HttpError

# Class: HttpError

Defined in: [packages/sdk/src/errors/index.ts:13](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L13)

## Extends

- `Error`

## Extended by

- [`AcrossApiError`](AcrossApiError.md)

## Constructors

### Constructor

> **new HttpError**(`params`, `opts?`): `HttpError`

Defined in: [packages/sdk/src/errors/index.ts:16](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L16)

#### Parameters

##### params

###### message?

`string`

###### name?

`string`

###### status

`number`

###### url

`string`

##### opts?

`ErrorOptions`

#### Returns

`HttpError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

#### Inherited from

`Error.cause`

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.stack`

***

### status

> `readonly` **status**: `number`

Defined in: [packages/sdk/src/errors/index.ts:15](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L15)

***

### url

> `readonly` **url**: `string`

Defined in: [packages/sdk/src/errors/index.ts:14](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/errors/index.ts#L14)

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

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@20.17.16/node\_modules/@types/node/globals.d.ts:100

#### Inherited from

`Error.stackTraceLimit`

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

`Error.captureStackTrace`
