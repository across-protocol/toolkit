[@across-protocol/integrator-sdk](../README.md) / simulateTxOnTenderly

# Function: simulateTxOnTenderly()

> **simulateTxOnTenderly**(`params`): `Promise`\<`object`\>

Simulates a transaction on Tenderly and returns a shareable URL.

## Parameters

• **params**: [`TenderlySimulateTxParams`](../type-aliases/TenderlySimulateTxParams.md)

The parameters for the simulation.

## Returns

`Promise`\<`object`\>

A URL to the simulation result.

### simulationId

> **simulationId**: `string`

### simulationUrl

> **simulationUrl**: `string` = `url`

## Defined in

[packages/sdk/src/utils/tenderly.ts:34](https://github.com/across-protocol/toolkit/blob/0408e9d38e7f5e4687131c33ea4b58d12a946b0d/packages/sdk/src/utils/tenderly.ts#L34)
