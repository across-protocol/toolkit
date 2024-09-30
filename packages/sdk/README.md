# Reference `@across-protocol/integrator-sdk`

## `AcrossClient`

### Set Up

- [`createAcrossClient`](./docs/functions/createAcrossClient.md)
- [`getAcrossClient`](./docs/functions/getAcrossClient.md)

### Chains and Routes

- [`getSupportedChains`](./docs/classes/AcrossClient.md#getsupportedchains)
- [`getAvailableRoutes`](./docs/classes/AcrossClient.md#getquote)

### Quotes, Fees and Limits

- [`getQuote`](./docs/classes/AcrossClient.md#getquote)
- [`getLimits`](./docs/classes/AcrossClient.md#getlimits)
- [`getSuggestedFees`](./docs/classes/AcrossClient.md#getsuggestedfees)

### Transaction Simulations and Executions

- [`executeQuote`](./docs/classes/AcrossClient.md#executequote)
- [`simulateDepositTx`](./docs/classes/AcrossClient.md#simulatedeposittx)

### Deposit and Fill Status

- [`waitForDepositTx`](./docs/classes/AcrossClient.md#waitfordeposittx)
- [`getDepositLogs`](./docs/classes/AcrossClient.md#getdepositlogs)
- [`getFillByDepositTx`](./docs/classes/AcrossClient.md#getfillbydeposittx)

### Debugging via Tenderly

- [`simulateTxOnTenderly`](./docs/classes/AcrossClient.md#simulatetxontenderly)

## Utilities

### Integrator tag

- [`tagIntegratorId`](./docs/functions/tagIntegratorId.md)
- [`getIntegratorDataSuffix`](./docs/functions/getIntegratorDataSuffix.md)

### Cross-chain message

- [`buildMulticallHandlerMessage`](./docs/functions/buildMulticallHandlerMessage.md)
