[@across-protocol/app-sdk](../README.md) / DefaultLogger

# Class: DefaultLogger

Defined in: [packages/sdk/src/utils/logger.ts:11](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/logger.ts#L11)

## Implements

- [`LoggerT`](../type-aliases/LoggerT.md)

## Constructors

### Constructor

> **new DefaultLogger**(`logLevel`): `DefaultLogger`

Defined in: [packages/sdk/src/utils/logger.ts:16](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/logger.ts#L16)

#### Parameters

##### logLevel

`"DEBUG"` | `"INFO"` | `"WARN"` | `"ERROR"`

#### Returns

`DefaultLogger`

## Properties

### logLevel

> **logLevel**: `"DEBUG"` \| `"INFO"` \| `"WARN"` \| `"ERROR"`

Defined in: [packages/sdk/src/utils/logger.ts:12](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/logger.ts#L12)

***

### logPrefix

> `readonly` **logPrefix**: `">"` = `">"`

Defined in: [packages/sdk/src/utils/logger.ts:14](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/logger.ts#L14)

***

### secondaryLabel

> `readonly` **secondaryLabel**: `"@across-protocol/app-sdk"` = `"@across-protocol/app-sdk"`

Defined in: [packages/sdk/src/utils/logger.ts:13](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/logger.ts#L13)

## Methods

### createLogLevelLabel()

> **createLogLevelLabel**(`logLevel`): `object`

Defined in: [packages/sdk/src/utils/logger.ts:20](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/logger.ts#L20)

#### Parameters

##### logLevel

`"DEBUG"` | `"INFO"` | `"WARN"` | `"ERROR"`

#### Returns

`object`

##### label

> **label**: `string`

##### prefix

> **prefix**: `string`

***

### debug()

> **debug**(...`data`): `void`

Defined in: [packages/sdk/src/utils/logger.ts:42](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/logger.ts#L42)

#### Parameters

##### data

...`unknown`[]

#### Returns

`void`

#### Implementation of

`LoggerT.debug`

***

### error()

> **error**(...`data`): `void`

Defined in: [packages/sdk/src/utils/logger.ts:61](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/logger.ts#L61)

#### Parameters

##### data

...`unknown`[]

#### Returns

`void`

#### Implementation of

`LoggerT.error`

***

### info()

> **info**(...`data`): `void`

Defined in: [packages/sdk/src/utils/logger.ts:49](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/logger.ts#L49)

#### Parameters

##### data

...`unknown`[]

#### Returns

`void`

#### Implementation of

`LoggerT.info`

***

### log()

> **log**(`logLevel`, ...`data`): `void`

Defined in: [packages/sdk/src/utils/logger.ts:33](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/logger.ts#L33)

Description - creates an indentation group for each call to `logger.[logLevel]()`

#### Parameters

##### logLevel

`"DEBUG"` | `"INFO"` | `"WARN"` | `"ERROR"`

##### data

...`unknown`[]

#### Returns

`void`

***

### warn()

> **warn**(...`data`): `void`

Defined in: [packages/sdk/src/utils/logger.ts:55](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/logger.ts#L55)

#### Parameters

##### data

...`unknown`[]

#### Returns

`void`

#### Implementation of

`LoggerT.warn`
