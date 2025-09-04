[@across-protocol/app-sdk](../README.md) / ExecuteQuoteResponseParams

# Type Alias: ExecuteQuoteResponseParams

> **ExecuteQuoteResponseParams** = `object`

Defined in: [packages/sdk/src/actions/executeQuote.ts:175](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L175)

Response parameters for [executeQuote](../functions/executeQuote.md).

## Properties

### depositId?

> `optional` **depositId**: [`DepositStatus`](DepositStatus.md)\[`"depositId"`\]

Defined in: [packages/sdk/src/actions/executeQuote.ts:179](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L179)

The ID of the deposit transaction.

***

### depositTxReceipt?

> `optional` **depositTxReceipt**: `TransactionReceipt`

Defined in: [packages/sdk/src/actions/executeQuote.ts:183](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L183)

The receipt of the deposit transaction.

***

### error?

> `optional` **error**: `Error`

Defined in: [packages/sdk/src/actions/executeQuote.ts:191](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L191)

Error object if an error occurred and throwOnError was false.

***

### fillTxReceipt?

> `optional` **fillTxReceipt**: `TransactionReceipt`

Defined in: [packages/sdk/src/actions/executeQuote.ts:187](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/actions/executeQuote.ts#L187)

The receipt of the fill transaction.
