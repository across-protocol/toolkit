[@across-protocol/app-sdk](../README.md) / DefaultLogger

# Class: DefaultLogger

## Implements

- [`LoggerT`](../type-aliases/LoggerT.md)

## Constructors

### new DefaultLogger()

> **new DefaultLogger**(`logLevel`): [`DefaultLogger`](DefaultLogger.md)

#### Parameters

• **logLevel**: `"ERROR"` \| `"DEBUG"` \| `"INFO"` \| `"WARN"`

#### Returns

[`DefaultLogger`](DefaultLogger.md)

#### Defined in

[packages/sdk/src/utils/logger.ts:16](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/utils/logger.ts#L16)

## Properties

### logLevel

> **logLevel**: `"ERROR"` \| `"DEBUG"` \| `"INFO"` \| `"WARN"`

#### Defined in

[packages/sdk/src/utils/logger.ts:12](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/utils/logger.ts#L12)

***

### logPrefix

> `readonly` **logPrefix**: `">"` = `">"`

#### Defined in

[packages/sdk/src/utils/logger.ts:14](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/utils/logger.ts#L14)

***

### secondaryLabel

> `readonly` **secondaryLabel**: `"@across-protocol/app-sdk"` = `"@across-protocol/app-sdk"`

#### Defined in

[packages/sdk/src/utils/logger.ts:13](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/utils/logger.ts#L13)

## Methods

### createLogLevelLabel()

> **createLogLevelLabel**(`logLevel`): `object`

#### Parameters

• **logLevel**: `"ERROR"` \| `"DEBUG"` \| `"INFO"` \| `"WARN"`

#### Returns

`object`

##### label

> **label**: `string`

##### prefix

> **prefix**: `string`

#### Defined in

[packages/sdk/src/utils/logger.ts:20](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/utils/logger.ts#L20)

***

### debug()

> **debug**(...`data`): `void`

#### Parameters

• ...**data**: `unknown`[]

#### Returns

`void`

#### Implementation of

`LoggerT.debug`

#### Defined in

[packages/sdk/src/utils/logger.ts:42](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/utils/logger.ts#L42)

***

### error()

> **error**(...`data`): `void`

#### Parameters

• ...**data**: `unknown`[]

#### Returns

`void`

#### Implementation of

`LoggerT.error`

#### Defined in

[packages/sdk/src/utils/logger.ts:61](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/utils/logger.ts#L61)

***

### info()

> **info**(...`data`): `void`

#### Parameters

• ...**data**: `unknown`[]

#### Returns

`void`

#### Implementation of

`LoggerT.info`

#### Defined in

[packages/sdk/src/utils/logger.ts:49](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/utils/logger.ts#L49)

***

### log()

> **log**(`logLevel`, ...`data`): `void`

Description - creates an indentation group for each call to `logger.[logLevel]()`

#### Parameters

• **logLevel**: `"ERROR"` \| `"DEBUG"` \| `"INFO"` \| `"WARN"`

• ...**data**: `unknown`[]

#### Returns

`void`

#### Defined in

[packages/sdk/src/utils/logger.ts:33](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/utils/logger.ts#L33)

***

### warn()

> **warn**(...`data`): `void`

#### Parameters

• ...**data**: `unknown`[]

#### Returns

`void`

#### Implementation of

`LoggerT.warn`

#### Defined in

[packages/sdk/src/utils/logger.ts:55](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/utils/logger.ts#L55)
