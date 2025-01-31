[@across-protocol/app-sdk](../README.md) / getUpdateDepositTypedData

# Function: ~~getUpdateDepositTypedData()~~

> **getUpdateDepositTypedData**(`__namedParameters`): `object`

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.depositId**: `number` \| `bigint`

• **\_\_namedParameters.originChainId**: `number`

• **\_\_namedParameters.signerAddress**: \`0x$\{string\}\`

• **\_\_namedParameters.updatedMessage**: \`0x$\{string\}\`

• **\_\_namedParameters.updatedOutputAmount**: `bigint`

• **\_\_namedParameters.updatedRecipient**: \`0x$\{string\}\`

## Returns

`object`

### ~~account~~

> `readonly` **account**: \`0x$\{string\}\` = `signerAddress`

### ~~domain~~

> `readonly` **domain**: `object`

### domain.chainId

> `readonly` **chainId**: `number` = `originChainId`

### domain.name

> `readonly` **name**: `"ACROSS-V2"` = `"ACROSS-V2"`

### domain.version

> `readonly` **version**: `"1.0.0"` = `"1.0.0"`

### ~~message~~

> `readonly` **message**: `object`

### message.depositId

> `readonly` **depositId**: `number`

### message.originChainId

> `readonly` **originChainId**: `bigint`

### message.updatedMessage

> **updatedMessage**: \`0x$\{string\}\`

### message.updatedOutputAmount

> **updatedOutputAmount**: `bigint`

### message.updatedRecipient

> **updatedRecipient**: \`0x$\{string\}\`

### ~~primaryType~~

> `readonly` **primaryType**: `"UpdateDepositDetails"` = `"UpdateDepositDetails"`

### ~~types~~

> `readonly` **types**: `object`

### types.UpdateDepositDetails

> `readonly` **UpdateDepositDetails**: readonly [`object`, `object`, `object`, `object`, `object`]

## Deprecated

Use `getUpdateDepositTypedDataV3_5` instead.

## Defined in

[packages/sdk/src/utils/typedData.ts:7](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/utils/typedData.ts#L7)
