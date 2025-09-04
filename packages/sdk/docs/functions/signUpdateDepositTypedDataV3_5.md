[@across-protocol/app-sdk](../README.md) / signUpdateDepositTypedDataV3\_5

# Function: signUpdateDepositTypedDataV3\_5()

> **signUpdateDepositTypedDataV3\_5**(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/sdk/src/actions/signUpdateDeposit.ts:62](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/signUpdateDeposit.ts#L62)

Creates a signature that allows signer to update a deposit. Can be used with
`SpokePool` contract's `speedUpDeposit` method. Is used internally by
[simulateUpdateDepositTx](simulateUpdateDepositTx.md)

## Parameters

### params

[`SignUpdateDepositTypedDataParams`](../type-aliases/SignUpdateDepositTypedDataParams.md)

See [SignUpdateDepositTypedDataParams](../type-aliases/SignUpdateDepositTypedDataParams.md)

## Returns

`Promise`\<`` `0x${string}` ``\>

Hex-encoded signature
