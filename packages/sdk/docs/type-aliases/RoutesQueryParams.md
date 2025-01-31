[@across-protocol/app-sdk](../README.md) / RoutesQueryParams

# Type Alias: RoutesQueryParams

> **RoutesQueryParams**: `Partial`\<`object`\>

## Type declaration

### destinationChainId

> **destinationChainId**: `number`

The destination chain id. If set only routes with this chain id as destination
are returned.

### destinationToken

> **destinationToken**: `Address`

The destination token address. If set only routes with this token as destination
are returned.

### destinationTokenSymbol

> **destinationTokenSymbol**: `string`

### originChainId

> **originChainId**: `number`

The origin chain id. If set only routes with this chain id as origin are returned.

### originToken

> **originToken**: `Address`

The origin token address. If set only routes with this token as origin are returned.

### originTokenSymbol

> **originTokenSymbol**: `string`

## Defined in

[packages/sdk/src/actions/getAvailableRoutes.ts:6](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/actions/getAvailableRoutes.ts#L6)
