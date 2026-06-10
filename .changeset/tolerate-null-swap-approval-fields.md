---
"@across-protocol/app-sdk": patch
---

Accept `null` (in addition to `undefined`) for optional fields in `swapApprovalResponseSchema`: `approvalTxns`, `steps.originSwap`, `steps.destinationSwap`, and `swapTx`. The `/swap/approval` endpoint now serializes these as explicit `null` for cases where they don't apply (e.g. `bridgeableToBridgeable` routes), which previously caused `getSwapQuote` to throw `Invalid swap approval response`. Consumers already coerce to truthy, so behavior is unchanged.
