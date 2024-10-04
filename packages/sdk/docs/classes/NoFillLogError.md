[@across-protocol/app-sdk](../README.md) / NoFillLogError

# Class: NoFillLogError

## Extends

- `Error`

## Constructors

### new NoFillLogError()

> **new NoFillLogError**(`depositId`, `depositTxHash`, `chainId`): [`NoFillLogError`](NoFillLogError.md)

#### Parameters

• **depositId**: `number`

• **depositTxHash**: \`0x$\{string\}\`

• **chainId**: `number`

#### Returns

[`NoFillLogError`](NoFillLogError.md)

#### Overrides

`Error.constructor`

#### Defined in

[packages/sdk/src/errors/index.ts:130](https://github.com/across-protocol/toolkit/blob/fa61c35c7597804e093096de254dbc326f096003/packages/sdk/src/errors/index.ts#L130)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es2022.error.d.ts:24

---

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es5.d.ts:1076

---

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es5.d.ts:1075

---

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es5.d.ts:1077

---

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

node_modules/.pnpm/@types+node@20.16.2/node_modules/@types/node/globals.d.ts:28

---

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Defined in

node_modules/.pnpm/@types+node@20.16.2/node_modules/@types/node/globals.d.ts:30

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

node_modules/.pnpm/@types+node@20.16.2/node_modules/@types/node/globals.d.ts:21
