[@across-protocol/app-sdk](../README.md) / buildSearchParams

# Function: buildSearchParams()

> **buildSearchParams**\<`T`\>(`params`): `string`

Builds a URL search string from an object of query parameters.

## Type Parameters

• **T** _extends_ `Record`\<`string`, `ParamBaseValue` \| `ParamBaseValue`[]\>

## Parameters

• **params**: `T`

An object where keys are query parameter names and values are either a string or an array of strings representing the parameter values.

## Returns

`string`

queryString - A properly formatted query string for use in URLs, (without the leading '?').

## Defined in

[packages/sdk/src/utils/fetch.ts:20](https://github.com/across-protocol/toolkit/blob/fa61c35c7597804e093096de254dbc326f096003/packages/sdk/src/utils/fetch.ts#L20)
