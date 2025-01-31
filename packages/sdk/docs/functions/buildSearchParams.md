[@across-protocol/app-sdk](../README.md) / buildSearchParams

# Function: buildSearchParams()

> **buildSearchParams**\<`T`\>(`params`): `string`

Builds a URL search string from an object of query parameters.

## Type Parameters

• **T** *extends* `Record`\<`string`, `ParamBaseValue` \| `ParamBaseValue`[]\>

## Parameters

• **params**: `T`

An object where keys are query parameter names and values are either a string or an array of strings representing the parameter values.

## Returns

`string`

queryString - A properly formatted query string for use in URLs, (without the leading '?').

## Defined in

[packages/sdk/src/utils/fetch.ts:20](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/utils/fetch.ts#L20)
