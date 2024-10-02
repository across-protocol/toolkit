[@across-protocol/integrator-sdk](../globals.md) / buildSearchParams

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

[packages/sdk/src/utils/fetch.ts:20](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/utils/fetch.ts#L20)
