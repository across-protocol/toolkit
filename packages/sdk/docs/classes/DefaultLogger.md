[@across-protocol/integrator-sdk](../globals.md) / DefaultLogger

# Class: DefaultLogger

## Implements

- [`LoggerT`](../type-aliases/LoggerT.md)

## Constructors

### new DefaultLogger()

> **new DefaultLogger**(`logLevel`): [`DefaultLogger`](DefaultLogger.md)

#### Parameters

• **logLevel**: `"DEBUG"` \| `"INFO"` \| `"WARN"` \| `"ERROR"`

#### Returns

[`DefaultLogger`](DefaultLogger.md)

#### Defined in

[packages/sdk/src/utils/logger.ts:16](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/utils/logger.ts#L16)

## Properties

### logLevel

> **logLevel**: `"DEBUG"` \| `"INFO"` \| `"WARN"` \| `"ERROR"`

#### Defined in

[packages/sdk/src/utils/logger.ts:12](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/utils/logger.ts#L12)

***

### logPrefix

> `readonly` **logPrefix**: `">"` = `">"`

#### Defined in

[packages/sdk/src/utils/logger.ts:14](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/utils/logger.ts#L14)

***

### secondaryLabel

> `readonly` **secondaryLabel**: `"@across-protocol/integrator-sdk"` = `"@across-protocol/integrator-sdk"`

#### Defined in

[packages/sdk/src/utils/logger.ts:13](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/utils/logger.ts#L13)

## Methods

### createLogLevelLabel()

> **createLogLevelLabel**(`logLevel`): `object`

#### Parameters

• **logLevel**: `"DEBUG"` \| `"INFO"` \| `"WARN"` \| `"ERROR"`

#### Returns

`object`

##### label

> **label**: `string`

##### prefix

> **prefix**: `string`

#### Defined in

[packages/sdk/src/utils/logger.ts:20](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/utils/logger.ts#L20)

***

### debug()

> **debug**(...`data`): `void`

#### Parameters

• ...**data**: `any`[]

#### Returns

`void`

#### Implementation of

`LoggerT.debug`

#### Defined in

[packages/sdk/src/utils/logger.ts:42](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/utils/logger.ts#L42)

***

### error()

> **error**(...`data`): `void`

#### Parameters

• ...**data**: `any`[]

#### Returns

`void`

#### Implementation of

`LoggerT.error`

#### Defined in

[packages/sdk/src/utils/logger.ts:61](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/utils/logger.ts#L61)

***

### info()

> **info**(...`data`): `void`

#### Parameters

• ...**data**: `any`[]

#### Returns

`void`

#### Implementation of

`LoggerT.info`

#### Defined in

[packages/sdk/src/utils/logger.ts:49](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/utils/logger.ts#L49)

***

### log()

> **log**(`logLevel`, ...`data`): `void`

Description - creates an indentation group for each call to `logger.[logLevel]()`

#### Parameters

• **logLevel**: `"DEBUG"` \| `"INFO"` \| `"WARN"` \| `"ERROR"`

• ...**data**: `any`[]

#### Returns

`void`

#### Defined in

[packages/sdk/src/utils/logger.ts:33](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/utils/logger.ts#L33)

***

### warn()

> **warn**(...`data`): `void`

#### Parameters

• ...**data**: `any`[]

#### Returns

`void`

#### Implementation of

`LoggerT.warn`

#### Defined in

[packages/sdk/src/utils/logger.ts:55](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/utils/logger.ts#L55)
