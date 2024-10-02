[@across-protocol/integrator-sdk](../globals.md) / ExecuteQuoteParams

# Type Alias: ExecuteQuoteParams

> **ExecuteQuoteParams**: `object`

Params for [executeQuote](../functions/executeQuote.md).

## Type declaration

### deposit

> **deposit**: [`Quote`](Quote.md)\[`"deposit"`\]

The deposit to execute. Should be taken from return value of [getQuote](../functions/getQuote.md).

### destinationClient

> **destinationClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

The public client for the destination chain.

### forceOriginChain?

> `optional` **forceOriginChain**: `boolean`

Whether to force the origin chain by switching to it if necessary.

### infiniteApproval?

> `optional` **infiniteApproval**: `boolean`

Whether to use an infinite approval for the SpokePool contract.

### integratorId

> **integratorId**: `string`

An identifier for the integrator.

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

The logger to use.

### onProgress()?

> `optional` **onProgress**: (`progress`) => `void`

A handler for the execution progress. See [ExecutionProgress](ExecutionProgress.md) for steps.

#### Parameters

• **progress**: [`ExecutionProgress`](ExecutionProgress.md)

#### Returns

`void`

### originClient

> **originClient**: [`ConfiguredPublicClient`](ConfiguredPublicClient.md)

The public client for the origin chain.

### skipAllowanceCheck?

> `optional` **skipAllowanceCheck**: `boolean`

Whether to skip the allowance check.

### throwOnError?

> `optional` **throwOnError**: `boolean`

Whether to throw if an error occurs.

### walletClient

> **walletClient**: [`ConfiguredWalletClient`](ConfiguredWalletClient.md)

The wallet client to use for the deposit.

## Defined in

[packages/sdk/src/actions/executeQuote.ts:111](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/actions/executeQuote.ts#L111)