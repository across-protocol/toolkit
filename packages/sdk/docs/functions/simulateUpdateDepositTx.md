[@across-protocol/app-sdk](../README.md) / simulateUpdateDepositTx

# Function: simulateUpdateDepositTx()

> **simulateUpdateDepositTx**(`params`): `Promise`\<`SimulateContractReturnType`\>

Defined in: [packages/sdk/src/actions/simulateUpdateDepositTx.ts:62](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/simulateUpdateDepositTx.ts#L62)

This function simulates the update of a deposit on the origin chain. Can be used to
update:
- the recipient address
- the output amount, i.e. the fees
- the cross-chain message
Note that this requires a signature from the depositor.

## Parameters

### params

[`SimulateUpdateDepositTxParams`](../type-aliases/SimulateUpdateDepositTxParams.md)

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
