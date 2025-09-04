[@across-protocol/app-sdk](../README.md) / ExecuteSwapQuoteResponseParams

# Type Alias: ExecuteSwapQuoteResponseParams

> **ExecuteSwapQuoteResponseParams** = `object`

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:128](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L128)

Response parameters for [executeSwapQuote](../functions/executeSwapQuote.md).

## Properties

### depositId?

> `optional` **depositId**: `bigint`

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:132](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L132)

The ID of the deposit transaction.

***

### error?

> `optional` **error**: `Error`

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:144](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L144)

Error object if an error occurred and throwOnError was false.

***

### fillTxReceipt?

> `optional` **fillTxReceipt**: `TransactionReceipt`

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:140](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L140)

The receipt of the fill transaction.

***

### swapTxReceipt?

> `optional` **swapTxReceipt**: `TransactionReceipt`

Defined in: [packages/sdk/src/actions/executeSwapQuote.ts:136](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeSwapQuote.ts#L136)

The receipt of the swap transaction.
