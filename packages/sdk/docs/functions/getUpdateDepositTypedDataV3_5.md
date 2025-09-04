[@across-protocol/app-sdk](../README.md) / getUpdateDepositTypedDataV3\_5

# Function: getUpdateDepositTypedDataV3\_5()

> **getUpdateDepositTypedDataV3\_5**(`__namedParameters`): `object`

Defined in: [packages/sdk/src/utils/typedData.ts:46](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/typedData.ts#L46)

## Parameters

### \_\_namedParameters

#### depositId

`number` \| `bigint`

#### originChainId

`number` \| `bigint`

#### signerAddress

`` `0x${string}` ``

#### updatedMessage

`` `0x${string}` ``

#### updatedOutputAmount

`bigint`

#### updatedRecipient

`` `0x${string}` ``

## Returns

`object`

### account

> `readonly` **account**: `` `0x${string}` `` = `signerAddress`

### domain

> `readonly` **domain**: `object`

#### domain.chainId

> `readonly` **chainId**: `number`

#### domain.name

> `readonly` **name**: `"ACROSS-V2"` = `"ACROSS-V2"`

#### domain.version

> `readonly` **version**: `"1.0.0"` = `"1.0.0"`

### message

> `readonly` **message**: `object`

#### message.depositId

> `readonly` **depositId**: `bigint`

#### message.originChainId

> `readonly` **originChainId**: `bigint`

#### message.updatedMessage

> **updatedMessage**: `` `0x${string}` ``

#### message.updatedOutputAmount

> **updatedOutputAmount**: `bigint`

#### message.updatedRecipient

> `readonly` **updatedRecipient**: `` `0x${string}` ``

### primaryType

> `readonly` **primaryType**: `"UpdateDepositDetails"` = `"UpdateDepositDetails"`

### types

> `readonly` **types**: `object`

#### types.UpdateDepositDetails

> `readonly` **UpdateDepositDetails**: readonly \[\{ `name`: `"depositId"`; `type`: `"uint256"`; \}, \{ `name`: `"originChainId"`; `type`: `"uint256"`; \}, \{ `name`: `"updatedOutputAmount"`; `type`: `"uint256"`; \}, \{ `name`: `"updatedRecipient"`; `type`: `"bytes32"`; \}, \{ `name`: `"updatedMessage"`; `type`: `"bytes"`; \}\]
