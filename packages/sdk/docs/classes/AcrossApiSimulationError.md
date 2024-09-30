[@across-protocol/integrator-sdk](../README.md) / AcrossApiSimulationError

# Class: AcrossApiSimulationError

## Extends

- [`AcrossApiError`](AcrossApiError.md)

## Constructors

### new AcrossApiSimulationError()

> **new AcrossApiSimulationError**(`params`, `opts`?): [`AcrossApiSimulationError`](AcrossApiSimulationError.md)

#### Parameters

• **params**

• **params.message?**: `string`

• **params.transaction?**

• **params.transaction.data?**: \`0x$\{string\}\`

• **params.transaction.from?**: \`0x$\{string\}\`

• **params.transaction.to?**: \`0x$\{string\}\`

• **params.transaction.value?**: `string`

• **params.url?**: `string`

• **opts?**: `ErrorOptions`

#### Returns

[`AcrossApiSimulationError`](AcrossApiSimulationError.md)

#### Overrides

[`AcrossApiError`](AcrossApiError.md).[`constructor`](AcrossApiError.md#constructors)

#### Defined in

[packages/sdk/src/errors/index.ts:61](https://github.com/across-protocol/toolkit/blob/fa61c35c7597804e093096de254dbc326f096003/packages/sdk/src/errors/index.ts#L61)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`cause`](AcrossApiError.md#cause)

#### Defined in

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`message`](AcrossApiError.md#message)

#### Defined in

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### name

> **name**: `string`

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`name`](AcrossApiError.md#name)

#### Defined in

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1075

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`stack`](AcrossApiError.md#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### status

> `readonly` **status**: `number`

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`status`](AcrossApiError.md#status)

#### Defined in

[packages/sdk/src/errors/index.ts:15](https://github.com/across-protocol/toolkit/blob/fa61c35c7597804e093096de254dbc326f096003/packages/sdk/src/errors/index.ts#L15)

***

### transaction

> `readonly` **transaction**: `object`

#### data

> **data**: \`0x$\{string\}\`

#### from

> **from**: \`0x$\{string\}\`

#### to

> **to**: \`0x$\{string\}\`

#### value?

> `optional` **value**: `string`

#### Defined in

[packages/sdk/src/errors/index.ts:54](https://github.com/across-protocol/toolkit/blob/fa61c35c7597804e093096de254dbc326f096003/packages/sdk/src/errors/index.ts#L54)

***

### url

> `readonly` **url**: `string`

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`url`](AcrossApiError.md#url)

#### Defined in

[packages/sdk/src/errors/index.ts:14](https://github.com/across-protocol/toolkit/blob/fa61c35c7597804e093096de254dbc326f096003/packages/sdk/src/errors/index.ts#L14)

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

[`AcrossApiError`](AcrossApiError.md).[`prepareStackTrace`](AcrossApiError.md#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.16.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`AcrossApiError`](AcrossApiError.md).[`stackTraceLimit`](AcrossApiError.md#stacktracelimit)

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

[`AcrossApiError`](AcrossApiError.md).[`captureStackTrace`](AcrossApiError.md#capturestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.16.2/node\_modules/@types/node/globals.d.ts:21
