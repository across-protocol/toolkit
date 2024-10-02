[@across-protocol/integrator-sdk](../globals.md) / simulateTxOnTenderly

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

[packages/sdk/src/utils/tenderly.ts:34](https://github.com/across-protocol/toolkit/blob/eee89a253938d54aa640eb34f40c2d714b9d031f/packages/sdk/src/utils/tenderly.ts#L34)
