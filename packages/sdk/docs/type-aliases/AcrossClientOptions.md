[@across-protocol/app-sdk](../README.md) / AcrossClientOptions

# Type Alias: AcrossClientOptions

> **AcrossClientOptions** = `object`

Defined in: [packages/sdk/src/client.ts:89](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L89)

Options for [AcrossClient.create](../classes/AcrossClient.md#create)

## Properties

### chains

> **chains**: `Chain`[]

Defined in: [packages/sdk/src/client.ts:97](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L97)

The chains to use for the Across API. Should be imported from `viem/chains`.

***

### integratorId?

> `optional` **integratorId**: `Hex`

Defined in: [packages/sdk/src/client.ts:93](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L93)

An identifier representing the integrator.

***

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

Defined in: [packages/sdk/src/client.ts:120](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L120)

A custom logger to use for the Across API. Defaults to a console logger.

***

### logLevel?

> `optional` **logLevel**: [`LogLevel`](LogLevel.md)

Defined in: [packages/sdk/src/client.ts:112](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L112)

The log level to use. Defaults to `"ERROR"`.

***

### pollingInterval?

> `optional` **pollingInterval**: `number`

Defined in: [packages/sdk/src/client.ts:125](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L125)

The polling interval in milliseconds to use for the Across API.
Defaults to `3_000` milliseconds.

***

### rpcUrls?

> `optional` **rpcUrls**: `object`

Defined in: [packages/sdk/src/client.ts:106](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L106)

The RPC URLs to use for the Across API. Will fall back to the default public RPC URL
for the chain if not specified.

#### Index Signature

\[`chainId`: `number`\]: `string`

***

### tenderly?

> `optional` **tenderly**: `object`

Defined in: [packages/sdk/src/client.ts:130](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L130)

Tenderly related options. Can be used for additional debugging support on Tenderly.

#### accessKey

> **accessKey**: `string`

The Tenderly API access key.

##### See

https://docs.tenderly.co/account/projects/how-to-generate-api-access-token

#### accountSlug

> **accountSlug**: `string`

The Tenderly account slug.

##### See

https://docs.tenderly.co/account/projects/account-project-slug

#### projectSlug

> **projectSlug**: `string`

The Tenderly project slug.

##### See

https://docs.tenderly.co/account/projects/account-project-slug

#### simOnError?

> `optional` **simOnError**: `boolean`

Whether to automatically simulate transactions on Tenderly when an error occurs.
Defaults to `true` if credentials `tenderly.accessKey`, `tenderly.accountSlug`,
and `tenderly.projectSlug` are provided.

#### See

https://tenderly.co/transaction-simulator

***

### useTestnet?

> `optional` **useTestnet**: `boolean`

Defined in: [packages/sdk/src/client.ts:116](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L116)

Whether to use the testnet API. Defaults to `false`.

***

### walletClient?

> `optional` **walletClient**: [`ConfiguredWalletClient`](ConfiguredWalletClient.md)

Defined in: [packages/sdk/src/client.ts:101](https://github.com/across-protocol/toolkit/blob/6b29eb5487c0ac0b498f1f420b1793303bd8b70a/packages/sdk/src/client.ts#L101)

A wallet client to use for the Across API.
