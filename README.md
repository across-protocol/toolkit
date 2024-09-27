<br/>

<p align="center">
  <a href="https://across.to">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="./.github/across-logo-dark.png">
        <img alt="viem logo" src="./.github/across-logo-light.png" width="auto" height="60">
      </picture>
</a>
</p>

<p align="center">
  Toolkit for building on top of the <a href="https://across.to">Across Protocol</a> 🛠️ 
<p>

<p align="center">
  <a href="https://www.npmjs.com/package/@across-protocol/integrator-sdk">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/@across-protocol/integrator-sdk?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/v/@across-protocol/integrator-sdk?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="Version">
    </picture>
  </a>
  <a href="https://github.com//@across-protocol/integrator/blob/master/LICENSE">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/license-AGPL-21262d?style=flat">
      <img src="https://img.shields.io/badge/license-AGPL-f6f8fa?style=flat" alt="MIT License">
    </picture>
  </a>
</p>

<br>

# Getting Started

The `@across-protocol/integrator-sdk` provides useful abstractions on top of Across' Smart Contracts and Quotes API.

To learn more visit our [docs](https://docs.across.to/).

## Installation

To get started, install the integrator sdk and its peer dependency [viem](https://viem.sh/).

```bash
pnpm i @across-protocol/integrator-sdk viem
```

## Quick Start

### 1. Set up the `AcrossClient`

Firstly, you need to set up the `AcrossClient` and configure the chains you want to support.

```ts
import { createAcrossClient } from "@across-protocol/integrator-sdk";
import { mainnet, optimism, arbitrum } from "viem/chains";

const client = createAcrossClient({
  integratorId: "YOUR_INTEGRATOR_ID",
  chains: [mainnet, optimism, arbitrum],
});
```

### 2. Retrieve a quote

Now, you can retrieve a quote for a given route.

```ts
// USDC from Optimism -> Arbitrum
const route = {
  originChainId: optimism.chainId
  destinationChainId: arbitrum.chainId,
  inputToken: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  outputToken: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
};
const quote = await client.actions.getQuote({
  route,
  inputAmount: parseUnit("1000", 6) // USDC decimals
})
```

Note that we provide additional utilities for retrieving available routes, chain details, and token infos.
See [SDK reference]().

### 3. Execute a quote

After retrieving a quote, you are ready to execute it.

```ts
import { useWalletClient } from "wagmi";

const wallet = useWalletClient();

await client.executeQuote({
  walletClient: wallet,
  deposit: quote.deposit, // returned by `getQuote`
  onProgress: (progress) => {
    // handle progress
  },
});
```

The method will execute a quote by:

1. Approving the SpokePool contract if necessary
2. Depositing the input token on the origin chain
3. Waiting for the deposit to be filled on the destination chain

You can use the `onProgress` callback to act on different stages of the execution.
Have a look at our [example app](./apps/example/) for a more detailed usage of this method.

## Cross-chain message handling

TODO

## Error handling and debugging

TODO

## Route, chain and token details

TODO
