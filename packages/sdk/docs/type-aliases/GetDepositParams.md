[@across-protocol/integrator-sdk](../README.md) / GetDepositParams

# Type Alias: GetDepositParams

> **GetDepositParams**: `object`

## Type declaration

### depositLogFromBlock?

> `optional` **depositLogFromBlock**: `bigint`

### destinationChainClient

> **destinationChainClient**: `PublicClient`

### fillLogFromBlock?

> `optional` **fillLogFromBlock**: `bigint`

### findBy

> **findBy**: `object` & `Partial`\<`object`\>

#### Type declaration

##### destinationChainId

> **destinationChainId**: `number`

##### destinationSpokePoolAddress

> **destinationSpokePoolAddress**: `Address`

##### originChainId

> **originChainId**: `number`

### indexerUrl?

> `optional` **indexerUrl**: `string`

### originChainClient

> **originChainClient**: `PublicClient`

## Defined in

[packages/sdk/src/actions/getDeposit.ts:7](https://github.com/across-protocol/toolkit/blob/0408e9d38e7f5e4687131c33ea4b58d12a946b0d/packages/sdk/src/actions/getDeposit.ts#L7)
