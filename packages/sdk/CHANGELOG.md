# @across-protocol/app-sdk

## 0.4.0

### Minor Changes

- 75248ce: Added getSwapQuote action
- 6d8613b: destination chain actions
- 3a018ba: Added executeSwapQuote action

### Patch Changes

- 4d33487: add getSwapTokens action
- 309e427: feat: add simulation steps to `executeSwapQuote`
- ebe66cd: align progress updates for 5792 deposits
- 0de91e6: update AcrossApiErrors
- 2aca217: add getSwapChains
- 6d8613b: improve getSwapQuote params
- f7a6521: use actionsSucceeded from indexer response

## 0.3.0

### Minor Changes

- 050a2e4: The executeQuote client function should return a deposit id and deposit/fill transaction receipts.

### Patch Changes

- 284e24d: Added atomic sendCalls with fallback to `executeQuote`

## 0.2.3

### Patch Changes

- b18629c: Improve: use Indexer API instead of Scraper API

## 0.2.2

### Patch Changes

- b778821: Add support for outputAmount field returned by suggested fees. this allows the safe handling of routes where input and output tokens do not have the same decimals

## 0.2.0

### Minor Changes

- 51eea3d: Pull fillDeadline from suggested-fees response, pass to deposit()

## 0.1.2

### Patch Changes

- 6481f02: Adds tests for API queries.

## 0.1.1

### Patch Changes

- b764aec: Fix for speed up typed data

## 0.1.0

### Minor Changes

- d027d7c: Adds support for minor upgrade in SpokePools.

## 0.0.5

### Patch Changes

- bb73f49: add TSDoc comments to SpokePool ABI with scope reduction warning
- 6c46231: Allow passing of pre encoded message field in getQuote

## 0.0.4

### Patch Changes

- 614d48c: add `updateDeposit` to allow updating message, recipient and output amount
- 614d48c: add `simulateUpdateDeposit` for updating deposit
- 94fc23d: Waiting for fill transaction reverts to using eth_getLogs if eth_newFilter or eth_getFilterChanges throws an error
- 0f96e3f: Allow async message update callbacks for `getQuote`
- f5633db: Simplify build using tsc for a more tree-shakable, unbundled output.

## 0.0.3

### Patch Changes

- 78e0b66: fix `fillDeadline` calculation

## 0.0.2

### Patch Changes

- 790c7b9: stricter integrator id check
- 8d48bd4: decrease required `getDeposit` params

## 0.0.1

### Patch Changes

- 7bbd827: Initial feature set that include methods for:

  - retrieving chain, token, and route information
  - retrieving limits, fees, and quote
  - simulating and executing transactions
  - building cross-chain messages
