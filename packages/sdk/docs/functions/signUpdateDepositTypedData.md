[@across-protocol/app-sdk](../README.md) / signUpdateDepositTypedData

# Function: signUpdateDepositTypedData()

> **signUpdateDepositTypedData**(`params`): `Promise`\<\`0x$\{string\}\`\>

Creates a signature that allows signer to update a deposit. Can be used with
`SpokePool` contract's `speedUpV3Deposit` method. Is used internally by
[simulateUpdateDepositTx](simulateUpdateDepositTx.md)

## Parameters

• **params**: [`SignUpdateDepositTypedDataParams`](../type-aliases/SignUpdateDepositTypedDataParams.md)

See [SignUpdateDepositTypedDataParams](../type-aliases/SignUpdateDepositTypedDataParams.md)

## Returns

`Promise`\<\`0x$\{string\}\`\>

Hex-encoded signature

## Defined in

[packages/sdk/src/actions/signUpdateDeposit.ts:20](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/actions/signUpdateDeposit.ts#L20)
