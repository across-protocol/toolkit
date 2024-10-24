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
// USDC from Optimism -> Arbitrum
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
    // handle progress
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

- ### Example A - _Stake an ERC20 on destination chain_

### 1. Craft a cross-chain message (A)

To implement this feature, you first need to specify a `crossChainMessage`.
The example below shows a cross-chain message for staking USDC into a contract deployed
on Optimism by:

1. Approve USDC to be pulled into staking
2. Stake approved amount into contract

```ts
// Example staking contract on Optimism
const stakingContractAddress = "0x733Debf51574c70CfCdb7918F032E16F686bd9f8";
// USDC on Optimism
const usdcAddress = "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
// Example user address
const userAddress = "0x924a9f036260DdD5808007E1AA95f08eD08aA569a";
const inputAmount = parseUnits("200", 6);

const crossChainMessage = {
  // This address will receive the amount of bridged tokens on the destination chain if
  // one of the cross-chain actions fail. Leftover tokens are here as well if all actions
  // succeed.
  fallbackRecipient: userAddress,
  // List of actions that should be executed on the destination chain
  actions: [
    {
      // Address of target contract on destination chain, i.e. USDC on Optimism
      target: usdcAddress,
      // Encoded function data, i.e. calldata for approving USDC to be pulled in by
      // staking contract
      callData: generateApproveCallData(
        stakingContractAddress,
        inputAmount
      ),
      // Native msg.value, can be 0 in the context of USDC
      value: 0n,
      // Update call data callback - we need to provide a callback function to
      // re-generate calldata because it depends on the `outputAmount`, i.e.
      // `inputAmount` - `relayer fee`. This is the amount the user has available after a
      // relayer filled the deposit on the destination chain.
      updateCallData: (outputAmount) => generateApproveCallData(
        stakingContractAddress,
        outputAmount
      )
    },
    {
      // Address of target contract on destination chain, i.e. staking contract
      // on Optimism
      target: stakingContractAddress,
      // Encoded function data, i.e. calldata for staking USDC on behalf of user
      callData: generateStakeCallData(
        userAddress,
        inputAmount
      )
      // Native msg.value, can be 0 in the context of USDC
      value: 0n,
      // Same reasoning as above in the approve step.
      updateCallData: (outputAmount) => generateStakeCallData(
        stakingContractAddress,
        outputAmount
      )
    }
  ]
}

function generateApproveCallData(spender: Address, amount: uint256) {
  const approveCallData = encodeFunctionData({
    abi: [parseAbiItem("function approve(address spender, uint256 value)")],
    args: [spender, amount],
  });

  return approveCallData;
}

function generateStakeCallData(userAddress: Address, amount: uint256) {
  return encodeFunctionData({
    abi: [parseAbiItem("function stake(address stakerAddress, uint256 amount")],
    args: [userAddress, amount],
  });
}
```

### 2. Retrieve a quote

After specifying a cross-chain message, you simply can fetch a quote the same way as a normal bridge

```ts
const route = {
  originChainId: arbitrum.chainId
  destinationChainId: optimism.chainId,
  inputToken: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  outputToken: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
};
const quote = await client.getQuote({
  route,
  inputAmount,
  crossChainMessage // crated above
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

- ### **Example (B)** - _Stake Native ETH on destination chain_

> This follows the logic in the example app.

To implement this feature, we need to bridge either ETH or WETH from our origin chain to our destination chain. Across will always send WETH to the recipient on the destination chain, **unless the recipient is an EOA**. For our use-case, we want to stake native ETH, moreover we want to do this in one step. For this we recommend using Across's MulticallHandler contract (or deploying your own).

So here's how we can stake ETH onto our staking contract:

1. Bridge ETH => destination chain and send output tokens to MulticallHandler contract (this will be WETH since it's a contract).
2. Unwrap WETH
3. Stake ETH on the staking contract.

The rest of the flow is exactly the same as the previous example.

It is also worth noting that whenever our calldata is dependant on the output amount we **MUST** make use of the `update()` function.

### 1. Craft a cross-chain message (B)

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
  token: {
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    logoUrl:
      "https://raw.githubusercontent.com/across-protocol/frontend/master/src/assets/token-logos/weth.svg",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  address: "0x4200000000000000000000000000000000000006",
} as const;

export const STAKE_CONTRACT = {
  address: "0x733Debf51574c70CfCdb7918F032E16F686bd9f8",
  chain: optimism,
  token: {
    address: "0x4200000000000000000000000000000000000006", // notice that ETH & WETH both have the same address
    symbol: "ETH",
    name: "Ether",
    decimals: 18,
    logoUrl:
      "https://raw.githubusercontent.com/across-protocol/frontend/master/src/assets/token-logos/eth.svg",
  },
  abi: StakerContractABI,
} as const;

// WETH unwrap action
function generateUnwrapCallData(wethAmount: Amount) {
  return encodeFunctionData({
    abi: WethAbi,
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

const crossChainMessage = {
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

// Then get a quote
const quote = await client.getQuote({
  route,
  inputAmount: parseEther("1"),
  // 🔔 Notice the recipient is not the staking contract itself or even the user, but is instead the contract that will execute our cross chain messages
  recipient: multicallHandlerOptimism,
  crossChainMessage: buildCrossChainMessage(parseEther("1")),
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
