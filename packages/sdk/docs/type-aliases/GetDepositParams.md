[@across-protocol/app-sdk](../README.md) / GetDepositParams

# Type Alias: GetDepositParams

> **GetDepositParams** = `object`

Defined in: [packages/sdk/src/actions/getDeposit.ts:7](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getDeposit.ts#L7)

## Properties

### depositLogFromBlock?

> `optional` **depositLogFromBlock**: `bigint`

Defined in: [packages/sdk/src/actions/getDeposit.ts:19](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getDeposit.ts#L19)

***

### destinationChainClient

> **destinationChainClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

Defined in: [packages/sdk/src/actions/getDeposit.ts:9](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getDeposit.ts#L9)

***

### fillLogFromBlock?

> `optional` **fillLogFromBlock**: `bigint`

Defined in: [packages/sdk/src/actions/getDeposit.ts:20](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getDeposit.ts#L20)

***

### findBy

> **findBy**: `object` & `Partial`\<\{ `depositId`: `bigint` \| `number`; `depositTxHash`: `Hex`; `originSpokePoolAddress`: `Address`; \}\>

Defined in: [packages/sdk/src/actions/getDeposit.ts:10](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getDeposit.ts#L10)

#### Type Declaration

##### destinationChainId

> **destinationChainId**: `number`

##### destinationSpokePoolAddress

> **destinationSpokePoolAddress**: `Address`

##### originChainId

> **originChainId**: `number`

***

### indexerUrl?

> `optional` **indexerUrl**: `string`

Defined in: [packages/sdk/src/actions/getDeposit.ts:21](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getDeposit.ts#L21)

***

### originChainClient

> **originChainClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

Defined in: [packages/sdk/src/actions/getDeposit.ts:8](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/getDeposit.ts#L8)
