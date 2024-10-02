[@across-protocol/integrator-sdk](../README.md) / AcrossClientOptions

# Type Alias: AcrossClientOptions

> **AcrossClientOptions**: `object`

Options for [AcrossClient.create](../classes/AcrossClient.md#create)

## Type declaration

### chains

> **chains**: `Chain`[]

The chains to use for the Across API. Should be imported from `viem/chains`.

### integratorId?

> `optional` **integratorId**: `string`

An identifier representing the integrator.

### logger?

> `optional` **logger**: [`LoggerT`](LoggerT.md)

A custom logger to use for the Across API. Defaults to a console logger.

### logLevel?

> `optional` **logLevel**: [`LogLevel`](LogLevel.md)

The log level to use. Defaults to `"ERROR"`.

### pollingInterval?

> `optional` **pollingInterval**: `number`

The polling interval in milliseconds to use for the Across API.
Defaults to `3_000` milliseconds.

### rpcUrls?

> `optional` **rpcUrls**: `object`

The RPC URLs to use for the Across API. Will fall back to the default public RPC URL
for the chain if not specified.

#### Index Signature

 \[`chainId`: `number`\]: `string`

### tenderly?

> `optional` **tenderly**: `object`

Tenderly related options. Can be used for additional debugging support on Tenderly.

#### See

https://tenderly.co/transaction-simulator

### tenderly.accessKey

> **accessKey**: `string`

The Tenderly API access key.

#### See

https://docs.tenderly.co/account/projects/how-to-generate-api-access-token

### tenderly.accountSlug

> **accountSlug**: `string`

The Tenderly account slug.

#### See

https://docs.tenderly.co/account/projects/account-project-slug

### tenderly.projectSlug

> **projectSlug**: `string`

The Tenderly project slug.

#### See

https://docs.tenderly.co/account/projects/account-project-slug

### tenderly.simOnError?

> `optional` **simOnError**: `boolean`

Whether to automatically simulate transactions on Tenderly when an error occurs.
Defaults to `true` if credentials `tenderly.accessKey`, `tenderly.accountSlug`,
and `tenderly.projectSlug` are provided.

### useTestnet?

> `optional` **useTestnet**: `boolean`

Whether to use the testnet API. Defaults to `false`.

### walletClient?

> `optional` **walletClient**: [`ConfiguredWalletClient`](ConfiguredWalletClient.md)

A wallet client to use for the Across API.

## Defined in

[packages/sdk/src/client.ts:66](https://github.com/across-protocol/toolkit/blob/fa61c35c7597804e093096de254dbc326f096003/packages/sdk/src/client.ts#L66)
