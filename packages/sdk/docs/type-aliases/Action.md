[@across-protocol/app-sdk](../README.md) / Action

# Type Alias: Action

> **Action** = \{ `args`: [`ActionArg`](ActionArg.md)[]; `functionSignature`: `string`; `populateCallValueDynamically?`: `false`; `target`: `Address`; `value`: `bigint`; \} \| \{ `args`: [`ActionArg`](ActionArg.md)[]; `functionSignature`: `string`; `populateCallValueDynamically`: `true`; `target`: `Address`; `value?`: `bigint`; \} \| \{ `isNativeTransfer`: `true`; `populateCallValueDynamically?`: `false`; `target`: `Address`; `value`: `bigint`; \} \| \{ `isNativeTransfer`: `true`; `populateCallValueDynamically`: `true`; `target`: `Address`; `value?`: `bigint`; \}

Defined in: [packages/sdk/src/types/index.ts:129](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/types/index.ts#L129)
