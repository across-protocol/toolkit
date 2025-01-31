[@across-protocol/app-sdk](../README.md) / simulateUpdateDepositTx

# Function: simulateUpdateDepositTx()

> **simulateUpdateDepositTx**(`params`): `Promise`\<`SimulateContractReturnType`\>

This function simulates the update of a deposit on the origin chain. Can be used to
update:
- the recipient address
- the output amount, i.e. the fees
- the cross-chain message
Note that this requires a signature from the depositor.

## Parameters

• **params**: [`SimulateUpdateDepositTxParams`](../type-aliases/SimulateUpdateDepositTxParams.md)

See [SimulateUpdateDepositTxParams](../type-aliases/SimulateUpdateDepositTxParams.md).

## Returns

`Promise`\<`SimulateContractReturnType`\>

The result of the simulation.

## Example

```ts
const result = await simulateUpdateDepositTx({
  walletClient,
. originChainClient,
  destinationChainClient,
  deposit: {
    // deposit details
  },
  update: {
    recipient: "0xNEW_RECIPIENT_ADDRESS",
  },
 });
const txHash = await walletClient.writeContract({
  account,
  ...txRequest,
});
```

## Defined in

[packages/sdk/src/actions/simulateUpdateDepositTx.ts:62](https://github.com/across-protocol/toolkit/blob/d027d7c23e7230b7b5f439570f9efd60c1d715ce/packages/sdk/src/actions/simulateUpdateDepositTx.ts#L62)
