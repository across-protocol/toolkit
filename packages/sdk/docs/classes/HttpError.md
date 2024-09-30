[@across-protocol/integrator-sdk](../globals.md) / HttpError

# Class: HttpError

## Extends

- `Error`

## Extended by

- [`AcrossApiError`](AcrossApiError.md)

## Constructors

### new HttpError()

> **new HttpError**(`params`, `opts`?): [`HttpError`](HttpError.md)

#### Parameters

• **params**

• **params.message?**: `string`

• **params.name?**: `string`

• **params.status?**: `number`

• **params.url?**: `string`

• **opts?**: `ErrorOptions`

#### Returns

[`HttpError`](HttpError.md)

#### Overrides

`Error.constructor`

#### Defined in

[packages/sdk/src/errors/index.ts:16](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/errors/index.ts#L16)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Defined in

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Defined in

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1075

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Defined in

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### status

> `readonly` **status**: `number`

#### Defined in

[packages/sdk/src/errors/index.ts:15](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/errors/index.ts#L15)

***

### url

> `readonly` **url**: `string`

#### Defined in

[packages/sdk/src/errors/index.ts:14](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/errors/index.ts#L14)

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

`Error.prepareStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@20.16.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

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

`Error.captureStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@20.16.2/node\_modules/@types/node/globals.d.ts:21
