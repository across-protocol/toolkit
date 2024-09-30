[@across-protocol/integrator-sdk](../globals.md) / RoutesQueryParams

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

### originChainId

> **originChainId**: `number`

The origin chain id. If set only routes with this chain id as origin are returned.

### originToken

> **originToken**: `Address`

The origin token address. If set only routes with this token as origin are returned.

## Defined in

[packages/sdk/src/actions/getAvailableRoutes.ts:6](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/actions/getAvailableRoutes.ts#L6)
