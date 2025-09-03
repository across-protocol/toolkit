[@across-protocol/app-sdk](../README.md) / simulateTxOnTenderly

# Function: simulateTxOnTenderly()

> **simulateTxOnTenderly**(`params`): `Promise`\<\{ `simulationId`: `string`; `simulationUrl`: `string`; \}\>

Defined in: [packages/sdk/src/utils/tenderly.ts:34](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/utils/tenderly.ts#L34)

Simulates a transaction on Tenderly and returns a shareable URL.

## Parameters

### params

[`TenderlySimulateTxParams`](../type-aliases/TenderlySimulateTxParams.md)

The parameters for the simulation.

## Returns

`Promise`\<\{ `simulationId`: `string`; `simulationUrl`: `string`; \}\>

A URL to the simulation result.
