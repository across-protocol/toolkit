[@across-protocol/app-sdk](../README.md) / SimulateUpdateDepositTxParams

# Type Alias: SimulateUpdateDepositTxParams

> **SimulateUpdateDepositTxParams** = `object`

Defined in: [packages/sdk/src/actions/simulateUpdateDepositTx.ts:9](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/simulateUpdateDepositTx.ts#L9)

## Properties

### apiUrl?

> `optional` **apiUrl**: `string`

Defined in: [packages/sdk/src/actions/simulateUpdateDepositTx.ts:30](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/simulateUpdateDepositTx.ts#L30)

***

### deposit

> **deposit**: `object`

Defined in: [packages/sdk/src/actions/simulateUpdateDepositTx.ts:13](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/simulateUpdateDepositTx.ts#L13)

#### depositId

> **depositId**: `bigint` \| `number`

#### destinationChainId

> **destinationChainId**: `number`

#### destinationSpokePoolAddress

> **destinationSpokePoolAddress**: `Address`

#### originChainId

> **originChainId**: `number`

#### originSpokePoolAddress

> **originSpokePoolAddress**: `Address`

***

### destinationChainClient

> **destinationChainClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

Defined in: [packages/sdk/src/actions/simulateUpdateDepositTx.ts:12](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/simulateUpdateDepositTx.ts#L12)

***

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

Defined in: [packages/sdk/src/actions/simulateUpdateDepositTx.ts:31](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/simulateUpdateDepositTx.ts#L31)

***

### originChainClient

> **originChainClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

Defined in: [packages/sdk/src/actions/simulateUpdateDepositTx.ts:11](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/simulateUpdateDepositTx.ts#L11)

***

### update

> **update**: `Partial`\<\{ `crossChainMessage`: \{ `actions`: [`CrossChainAction`](CrossChainAction.md)[]; `fallbackRecipient`: `Address`; \} \| `Hex`; `outputAmount`: `bigint`; `recipient`: `Address`; \}\>

Defined in: [packages/sdk/src/actions/simulateUpdateDepositTx.ts:20](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/simulateUpdateDepositTx.ts#L20)

***

### walletClient

> **walletClient**: `WalletClient`

Defined in: [packages/sdk/src/actions/simulateUpdateDepositTx.ts:10](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/simulateUpdateDepositTx.ts#L10)
