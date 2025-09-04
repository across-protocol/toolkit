[@across-protocol/app-sdk](../README.md) / ExecuteQuoteParams

# Type Alias: ExecuteQuoteParams

> **ExecuteQuoteParams** = `object`

Defined in: [packages/sdk/src/actions/executeQuote.ts:121](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L121)

Params for [executeQuote](../functions/executeQuote.md).

## Properties

### atomicIfSupported?

> `optional` **atomicIfSupported**: `boolean`

Defined in: [packages/sdk/src/actions/executeQuote.ts:169](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L169)

Whether to use atomic transactions if supported by the wallet.

***

### deposit

> **deposit**: [`Quote`](Quote.md)\[`"deposit"`\]

Defined in: [packages/sdk/src/actions/executeQuote.ts:129](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L129)

The deposit to execute. Should be taken from return value of [getQuote](../functions/getQuote.md).

***

### destinationClient

> **destinationClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

Defined in: [packages/sdk/src/actions/executeQuote.ts:141](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L141)

The public client for the destination chain.

***

### forceOriginChain?

> `optional` **forceOriginChain**: `boolean`

Defined in: [packages/sdk/src/actions/executeQuote.ts:157](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L157)

Whether to force the origin chain by switching to it if necessary.

***

### infiniteApproval?

> `optional` **infiniteApproval**: `boolean`

Defined in: [packages/sdk/src/actions/executeQuote.ts:145](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L145)

Whether to use an infinite approval for the SpokePool contract.

***

### integratorId

> **integratorId**: `Hex`

Defined in: [packages/sdk/src/actions/executeQuote.ts:125](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L125)

An identifier for the integrator.

***

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

Defined in: [packages/sdk/src/actions/executeQuote.ts:165](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L165)

The logger to use.

***

### onProgress()?

> `optional` **onProgress**: (`progress`) => `void`

Defined in: [packages/sdk/src/actions/executeQuote.ts:161](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L161)

A handler for the execution progress. See [ExecutionProgress](ExecutionProgress.md) for steps.

#### Parameters

##### progress

[`ExecutionProgress`](ExecutionProgress.md)

#### Returns

`void`

***

### originClient

> **originClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

Defined in: [packages/sdk/src/actions/executeQuote.ts:137](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L137)

The public client for the origin chain.

***

### skipAllowanceCheck?

> `optional` **skipAllowanceCheck**: `boolean`

Defined in: [packages/sdk/src/actions/executeQuote.ts:149](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L149)

Whether to skip the allowance check.

***

### throwOnError?

> `optional` **throwOnError**: `boolean`

Defined in: [packages/sdk/src/actions/executeQuote.ts:153](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L153)

Whether to throw if an error occurs.

***

### walletClient

> **walletClient**: [`ConfiguredWalletClient`](ConfiguredWalletClient.md)

Defined in: [packages/sdk/src/actions/executeQuote.ts:133](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L133)

The wallet client to use for the deposit.
