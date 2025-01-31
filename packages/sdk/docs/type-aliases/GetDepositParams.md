[@across-protocol/app-sdk](../README.md) / GetDepositParams

# Type Alias: GetDepositParams

> **GetDepositParams**: `object`

## Type declaration

### depositLogFromBlock?

> `optional` **depositLogFromBlock**: `bigint`

### destinationChainClient

> **destinationChainClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

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

> **originChainClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

## Defined in

[packages/sdk/src/actions/getDeposit.ts:7](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/actions/getDeposit.ts#L7)
