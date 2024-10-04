[@across-protocol/app-sdk](../README.md) / GetDepositParams

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

packages/sdk/src/actions/getDeposit.ts:7
