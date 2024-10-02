# `@across-protocol/integrator-sdk` Reference

## `AcrossClient`

### Set Up

- [`createAcrossClient`](_media/createAcrossClient.md)
- [`getAcrossClient`](_media/getAcrossClient.md)

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

- [`tagIntegratorId`](_media/tagIntegratorId.md)
- [`getIntegratorDataSuffix`](_media/getIntegratorDataSuffix.md)

### Cross-chain message

- [`buildMulticallHandlerMessage`](_media/buildMulticallHandlerMessage.md)
