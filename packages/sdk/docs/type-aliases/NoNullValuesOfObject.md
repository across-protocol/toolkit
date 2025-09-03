[@across-protocol/app-sdk](../README.md) / NoNullValuesOfObject

# Type Alias: NoNullValuesOfObject\<T\>

> **NoNullValuesOfObject**\<`T`\> = `{ [Property in keyof T]-?: NonNullable<T[Property]> }`

Defined in: [packages/sdk/src/utils/typeUtils.ts:4](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/typeUtils.ts#L4)

## Type Parameters

### T

`T` *extends* `object`
