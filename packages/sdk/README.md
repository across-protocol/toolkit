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
  TypeScript package for building on top of the <a href="https://across.to">Across Protocol</a>
<p>

<p align="center">
  <a href="https://www.npmjs.com/package/@across-protocol/app-sdk">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/@across-protocol/app-sdk?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/v/@across-protocol/app-sdk?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="Version">
    </picture>
  </a>
  <a href="https://github.com/across-protocol/toolkit/blob/master/LICENSE">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/license-AGPL-21262d?style=flat">
      <img src="https://img.shields.io/badge/license-AGPL-f6f8fa?style=flat" alt="MIT License">
    </picture>
  </a>
</p>

<br>

# Getting Started

The `@across-protocol/app-sdk` provides useful abstractions on top of Across' Smart Contracts and Quotes API.

To learn more visit our [docs](https://docs.across.to/).

## Installation

To get started, install the app sdk and its peer dependency [viem](https://viem.sh/).

```bash
pnpm i @across-protocol/app-sdk viem
```

## Quick Start

### 1. Set up the `AcrossClient`

Firstly, you need to set up the `AcrossClient` and configure the chains you want to support.

```ts
import { createAcrossClient } from "@across-protocol/app-sdk";
import { mainnet, optimism, arbitrum } from "viem/chains";

const client = createAcrossClient({
  integratorId: "0xdead", // 2-byte hex string
  chains: [mainnet, optimism, arbitrum],
});
```

### 2. Retrieve a quote

Now, you can retrieve a quote for a given route with an arbitrary token pair.

```ts
import { parseEther } from "viem";

// USDC from Arbitrum -> ETH on Optimism
const route = {
  originChainId: arbitrum.id,
  destinationChainId: optimism.id,
  inputToken: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC
  outputToken: "0x0000000000000000000000000000000000000000", // Native ETH
};

const swapQuote = await client.getSwapQuote({
  route,
  amount: parseUnit("10", 6), // USDC decimals
});
```

Note that we provide additional utilities for retrieving available routes, chain details, and token infos.
See [here](#chains-and-routes).

### 3. Execute a quote

After retrieving a quote, you are ready to execute it.

```ts
import { useWalletClient } from "wagmi";

const wallet = useWalletClient();

await client.executeSwapQuote({
  walletClient: wallet,
  swapQuote, // returned by `client.getSwapQuote`
  onProgress: (progress) => {
    if (progress.step === "approve" && progress.status === "txSuccess") {
      // if approving an ERC20, you have access to the approval receipt
      const { txReceipt } = progress;
    }
    if (progress.step === "deposit" && progress.status === "txSuccess") {
      // once deposit is successful you have access to depositId and the receipt
      const { depositId, txReceipt } = progress;
    }
    if (progress.step === "fill" && progress.status === "txSuccess") {
      // if the fill is successful, you have access the following data
      const { fillTxTimestamp, txReceipt, actionSuccess } = progress;
      // actionSuccess is a boolean flag, telling us if your cross chain messages were successful
    }
  },
});
```

The method will execute a quote by:

1. Approving the `SpokePool` or `SpokePoolPeriphery` contract if necessary
2. Depositing the input token on the origin chain (also facilitating an origin swap if necessary)
3. Waiting for the deposit to be filled on the destination chain

You can use the `onProgress` callback to act on different stages of the execution.
Have a look at our [example app](../../apps/example) for a more detailed usage of this method.

## Cross-chain message handling

Across enables users to seamlessly interact with your dApp or chain using assets from other chains.

### Example: Stake Native ETH on Destination Chain

This example shows you how to use the app-sdk to swap, bridge and stake native ETH across chains.
You only need to specify the destination chain actions.

```ts
import { createAcrossClient } from "@across-protocol/app-sdk";
import { mainnet, optimism, arbitrum } from "viem/chains";
import { useWalletClient } from "wagmi";

const wallet = useWalletClient();

// Example Staking contract on OP
const stakingAddress = "0x733Debf51574c70CfCdb7918F032E16F686bd9f8";

// 1. Create client
const client = createAcrossClient({
  integratorId: "0xdead", // 2-byte hex string
  chains: [mainnet, optimism, arbitrum],
});

// 2. Retrieve quote for USDC from Arbitrum -> ETH on Optimism
const route = {
  originChainId: arbitrum.id,
  destinationChainId: optimism.id,
  inputToken: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC
  outputToken: "0x0000000000000000000000000000000000000000", // Native ETH
};
const swapQuote = await client.getSwapQuote({
  route,
  amount: parseUnit("10", 6), // USDC decimals
  actions: [
    {
      // Target contract of destination chain actions
      target: stakingAddress,
      // Human-readable ABI format of method to call
      functionSignature: "function stake(address stakerAddress)",
      // Args to above
      args: [{ value: wallet.address }],
      // Allows to set call value to available balance AFTER bridge
      populateCallValueDynamically: true,
    },
  ],
});

// 3. Execute quote
await client.executeSwapQuote({
  walletClient: wallet,
  swapQuote,
  onProgress: (progress) => {
    // handle progress
  },
});
```

## Deposit details

TODO

## Error handling and debugging

TODO

## Route, chain and token details

TODO

# `@across-protocol/app-sdk` Reference

For the full detailed reference see [here](./docs/README.md).

## `AcrossClient`

### Set Up

- [`createAcrossClient`](./docs/functions/createAcrossClient.md)
- [`getAcrossClient`](./docs/functions/getAcrossClient.md)

### Chains and Routes

- [`getSwapChains`](./docs/classes/AcrossClient.md#getswapchains)
- [`getSwapTokens`](./docs/classes/AcrossClient.md#getswaptokens)

### Quotes, Fees and Limits

- [`getSwapQuote`](./docs/classes/AcrossClient.md#getswapquote)

### Transaction Simulations and Executions

- [`executeSwapQuote`](./docs/classes/AcrossClient.md#executeswapquote)

### Deposit and Fill Status

- [`getDeposit`](./docs/classes/AcrossClient.md#getdeposit)
- [`waitForFillTx`](./docs/classes/AcrossClient.md#waitforfilltx)

### Debugging via Tenderly

- [`simulateTxOnTenderly`](./docs/classes/AcrossClient.md#simulatetxontenderly)

## Utilities

### Integrator tag

- [`tagIntegratorId`](./docs/functions/tagIntegratorId.md)
- [`getIntegratorDataSuffix`](./docs/functions/getIntegratorDataSuffix.md)

### Cross-chain message

- [`buildMulticallHandlerMessage`](./docs/functions/buildMulticallHandlerMessage.md)
