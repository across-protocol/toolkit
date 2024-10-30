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

Now, you can retrieve a quote for a given route.

```ts
import { parseEther } from "viem";

// WETH from Arbitrum -> Optimism
const route = {
  originChainId: arbitrum.id,
  destinationChainId: optimism.id,
  inputToken: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH arb
  outputToken: "0x4200000000000000000000000000000000000006", // WETH opt
};

const quote = await client.getQuote({
  route,
  inputAmount: parseEther("1"),
});
```

Note that we provide additional utilities for retrieving available routes, chain details, and token infos.
See [here](#chains-and-routes).

### 3. Execute a quote

After retrieving a quote, you are ready to execute it.

```ts
import { useWalletClient } from "wagmi";

const wallet = useWalletClient();

await client.executeQuote({
  walletClient: wallet,
  deposit: quote.deposit, // returned by `getQuote`
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

1. Approving the SpokePool contract if necessary
2. Depositing the input token on the origin chain
3. Waiting for the deposit to be filled on the destination chain

You can use the `onProgress` callback to act on different stages of the execution.
Have a look at our [example app](../../apps/example) for a more detailed usage of this method.

## Cross-chain message handling

Across enables users to seamlessly interact with your dApp or chain using assets from other chains.

### Example: Stake Native ETH on Destination Chain

To stake native ETH in one step:

1. Bridge WETH to the destination chain, sending the output tokens (WETH) to Across's MulticallHandler contract (since contracts receive WETH).
2. Unwrap WETH to obtain native ETH.
3. Stake the ETH on your staking contract.

**Note**: If your calldata depends on the output amount, you must use the `update()` function.

### 1. Craft a cross-chain message

```ts
import { type Amount } from "@across-protocol/app-sdk";
import { encodeFunctionData } from "viem";
import { optimism } from "viem/chains";

// constants
const userAddress = "0xFoo";
const multicallHandlerOptimism = "0x924a9f036260DdD5808007E1AA95f08eD08aA569";

export const WETH_OPTIMISM = {
  chain: optimism,
  abi: WethAbi,
  address: "0x4200000000000000000000000000000000000006",
  decimals: 18,
  logoUrl:
    "https://raw.githubusercontent.com/across-protocol/frontend/master/src/assets/token-logos/weth.svg",
  name: "Wrapped Ether",
  symbol: "WETH",
} as const;

export const STAKE_CONTRACT = {
  address: "0x733Debf51574c70CfCdb7918F032E16F686bd9f8",
  chain: optimism,
  abi: StakerContractABI,
} as const;

// WETH unwrap action
function generateUnwrapCallData(wethAmount: Amount) {
  return encodeFunctionData({
    abi: WETH_OPTIMISM.abi,
    functionName: "withdraw",
    args: [BigInt(wethAmount)],
  });
}

// STAKE action
function generateStakeCallData(userAddress: Address) {
  return encodeFunctionData({
    abi: STAKE_CONTRACT.abi,
    functionName: "stake",
    args: [userAddress],
  });
}

const unwrapAndStakeMessage = {
  actions: [
    {
      target: WETH_OPTIMISM.address,
      callData: generateUnwrapCallData(inputAmount),
      value: 0n,
      // we only update the calldata since the unwrap call is non-payable, but we DO care about the output amount.
      update: (updatedOutputAmount) => {
        return {
          callData: generateUnwrapCallData(updatedOutputAmount),
        };
      },
    },
    {
      target: STAKE_CONTRACT.address,
      callData: generateStakeCallData(userAddress),
      // 🔔 the initial value may be set equal to the output amount. This MUST be updated via the `update()` function below oir this call will fail!
      value: inputAmount,
      // now we MUST update msg.value since this last call is calling a payable function.
      update: (updatedOutputAmount) => {
        return {
          value: updatedOutputAmount,
        };
      },
    },
  ],
  fallbackRecipient: userAddress,
};
```

### 2. Retrieve a quote

After specifying a cross-chain message, you simply can fetch a quote the same way as a normal bridge

```ts
const route = {
  originChainId: arbitrum.id,
  destinationChainId: optimism.id,
  inputToken: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH arbitrum
  outputToken: "0x4200000000000000000000000000000000000006", // WETH optimism
};

const quote = await client.getQuote({
  route,
  inputAmount: parseEther("1"),
  // 🔔 Notice the recipient is not the staking contract itself or even the user, but the contract that will execute our cross chain messages
  recipient: multicallHandlerOptimism,
  crossChainMessage: unwrapAndStakeMessage,
});
```

### 3. Execute a quote

If the quote is available, you can execute like so

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

- [`getSupportedChains`](./docs/classes/AcrossClient.md#getsupportedchains)
- [`getAvailableRoutes`](./docs/classes/AcrossClient.md#getavailableroutes)

### Quotes, Fees and Limits

- [`getQuote`](./docs/classes/AcrossClient.md#getquote)

### Transaction Simulations and Executions

- [`executeQuote`](./docs/classes/AcrossClient.md#executequote)
- [`simulateDepositTx`](./docs/classes/AcrossClient.md#simulatedeposittx)

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
