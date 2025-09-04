[@across-protocol/app-sdk](../README.md) / buildSearchParams

# Function: buildSearchParams()

> **buildSearchParams**\<`T`\>(`params`): `string`

Defined in: [packages/sdk/src/utils/fetch.ts:20](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/fetch.ts#L20)

Builds a URL search string from an object of query parameters.

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `ParamBaseValue` \| `ParamBaseValue`[]\>

## Parameters

### params

`T`

An object where keys are query parameter names and values are either a string or an array of strings representing the parameter values.

## Returns

`string`

queryString - A properly formatted query string for use in URLs, (without the leading '?').
