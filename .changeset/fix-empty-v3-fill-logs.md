---
"@across-protocol/app-sdk": patch
---

Fix `getFillLogs` returning an empty `v3Logs` array instead of falling back to `v3_5Logs`. The previous `v3Logs ?? v3_5Logs` check never fell through because `getContractEvents` always returns an array, so fills emitted via the v3.5 `FilledRelay` event were not found by `getFillByDepositTx`.
