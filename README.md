<br/>

<p align="center">
  <a href="https://across.to">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/across-protocol/toolkit/refs/heads/master/.github/across-logo-dark.png">
        <img alt="across logo" src="https://raw.githubusercontent.com/across-protocol/toolkit/refs/heads/master/.github/across-logo-light.png" width="auto" height="60">
      </picture>
</a>
</p>

<p align="center">
  Toolkit  🛠️ for building on top of the <a href="https://across.to">Across Protocol</a> 
<p>
<p align="center">
  Fastest and lowest-cost bridging for end-users. Streamlined interoperability for developers.
</p>

<p align="center">
  <a href="https://discord.across.to" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Chat%20on-Discord-%235766f2" />
  </a>
  <a href="https://github.com/across-protocol/toolkit/blob/master/LICENSE">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/license-AGPL-21262d?style=flat">
      <img src="https://img.shields.io/badge/license-AGPL-f6f8fa?style=flat" alt="MIT License">
    </picture>
  </a>
  <a href="https://twitter.com/AcrossProtocol/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/twitter/follow/AcrossProtocol?style=social"/>
  </a>
</p>

<br>

## Overview

Quickly integrate with a few lines of code. See [here](./packages/sdk/README.md) for more details.

```ts
import { createAcrossClient } from "@across-protocol/integrator-sdk";
import { mainnet, optimism, arbitrum } from "viem/chains";
import { useWalletClient } from "wagmi";

const wallet = useWalletClient();

// 1. Create client
const client = createAcrossClient({
  integratorId: "0xdead", // 2-byte hex string
  chains: [mainnet, optimism, arbitrum],
});

// 2. Retrieve quote for USDC from Optimism -> Arbitrum
const route = {
  originChainId: optimism.chainId
  destinationChainId: arbitrum.chainId,
  inputToken: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  outputToken: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
};
const quote = await client.getQuote({
  route,
  inputAmount: parseUnit("1000", 6) // USDC decimals
})

// 3. Execute quote
await client.executeQuote({
  walletClient: wallet,
  deposit: quote.deposit,
  onProgress: (progress) => {
    // handle progress
  },
});
```

## Tools

| Package                                                       | Description                                                                                |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [`@across-protocol/integrator-sdk`](./packages/sdk/README.md) | TypeScript package for building on top of Across Protocol's Smart Contracts and Quotes API |

## Examples

| App                                | Description                          |
| ---------------------------------- | ------------------------------------ |
| [using viem](./apps/example/app)   | Example Next.js app using [viem]()   |
| [using ethers](./apps/example/app) | Example Next.js app using [ethers]() |

## Links

- Website: <https://across.to>
- App: <https://app.across.to>
- Docs: <https://docs.across.to>
- Medium: <https://medium.com/across-protocol>
