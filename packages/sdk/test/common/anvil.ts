import { arbitrum, base, type Chain, mainnet, optimism } from "viem/chains";
import {
  BLOCK_NUMBER_ARBITRUM,
  BLOCK_NUMBER_BASE,
  BLOCK_NUMBER_MAINNET,
  BLOCK_NUMBER_OPTIMISM,
  FORK_URL_ARBITRUM,
  FORK_URL_BASE,
  FORK_URL_MAINNET,
  FORK_URL_OPTIMISM,
  pool,
  PRIVATE_KEY,
} from "./constants";
import {
  type Client,
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
  publicActions,
  type PublicActions,
  type PublicClient,
  type TestActions,
  type TestRpcSchema,
  type Transport,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { type Compute } from "./utils";
import { type ConfiguredWalletClient } from "../../src/index";
import { createServer } from "prool";
import { anvil } from "prool/instances";
import {
  publicActionsL2,
  publicActionsL1,
  type PublicActionsL2,
  type PublicActionsL1,
} from "viem/op-stack";

export function getRpcUrls({ port }: { port: number }) {
  return {
    port,
    rpcUrls: {
      default: {
        // append the test worker id to the rpc urls.
        http: [`http://localhost:${port}/${pool}`],
        webSocket: [`ws://localhost:${port}/${pool}`],
      },
      public: {
        http: [`http://localhost:${port}/${pool}`],
        webSocket: [`ws://localhost:${port}/${pool}`],
      },
    },
  } as const;
}

type Fork = { blockNumber: bigint; url: string; opStack?: boolean };

export type AnvilChain = Compute<
  Chain & {
    fork: Fork;
    port: number;
  }
>;

const optimismFork = {
  blockNumber: BLOCK_NUMBER_OPTIMISM,
  url: FORK_URL_OPTIMISM,
  opStack: true,
} as const satisfies Fork;

const baseFork = {
  blockNumber: BLOCK_NUMBER_BASE,
  url: FORK_URL_BASE,
  opStack: true,
} as const satisfies Fork;

const mainnetFork = {
  blockNumber: BLOCK_NUMBER_MAINNET,
  url: FORK_URL_MAINNET,
} as const satisfies Fork;

const arbitrumFork = {
  blockNumber: BLOCK_NUMBER_ARBITRUM,
  url: FORK_URL_ARBITRUM,
} as const satisfies Fork;

//  PORT: 8545
const optimismAnvil = {
  ...optimism,
  ...getRpcUrls({ port: 8545 }),
  fork: optimismFork,
} as const satisfies AnvilChain;

//  PORT: 8546
const baseAnvil = {
  ...base,
  ...getRpcUrls({ port: 8546 }),
  fork: baseFork,
} as const satisfies AnvilChain;

//  PORT: 8547
const mainnetAnvil = {
  ...mainnet,
  ...getRpcUrls({ port: 8547 }),
  fork: mainnetFork,
} as const satisfies AnvilChain;

//  PORT: 8548
const arbitrumAnvil = {
  ...arbitrum,
  ...getRpcUrls({ port: 8548 }),
  fork: arbitrumFork,
} as const satisfies AnvilChain;

const account = privateKeyToAccount(PRIVATE_KEY);

// TEST (CHAIN) CLIENTS

export const chainClientMainnet: ChainClient = createTestClient({
  chain: mainnetAnvil,
  mode: "anvil",
  transport: http(),
})
  .extend(forkMethods)
  .extend(publicActions);

export const chainClientArbitrum: ChainClient = createTestClient({
  chain: arbitrumAnvil,
  mode: "anvil",
  transport: http(),
})
  .extend(forkMethods)
  .extend(publicActions);

export const chainClientOptimism: OpStackChainClient = createTestClient({
  chain: optimismAnvil,
  mode: "anvil",
  transport: http(),
})
  .extend(forkMethods)
  .extend(publicActionsL1())
  .extend(publicActionsL2());

export const chainClientBase: OpStackChainClient = createTestClient({
  chain: baseAnvil,
  mode: "anvil",
  transport: http(),
})
  .extend(forkMethods)
  .extend(publicActionsL1())
  .extend(publicActionsL2());

// PUBLIC CLIENTS
export const publicClientOptimism = createPublicClient({
  chain: optimismAnvil,
  transport: http(),
});

export const publicClientBase = createPublicClient({
  chain: baseAnvil,
  transport: http(),
});

// WALLET CLIENTS
export const testWalletOptimism = createWalletClient({
  account,
  chain: optimismAnvil,
  transport: http(),
});

const testWalletBase = createWalletClient({
  account,
  chain: baseAnvil,
  transport: http(),
});

export type OpStackChainClient = Client<
  Transport,
  AnvilChain,
  undefined,
  TestRpcSchema<"anvil">,
  TestActions & ForkMethods & PublicActionsL1 & PublicActionsL2
>;

export type ChainClient = Client<
  Transport,
  AnvilChain,
  undefined,
  TestRpcSchema<"anvil">,
  TestActions & ForkMethods & PublicActions
>;

type ForkMethods = ReturnType<typeof forkMethods>;

function forkMethods(
  client: Client<
    Transport,
    AnvilChain,
    undefined,
    TestRpcSchema<"anvil">,
    TestActions
  >,
) {
  return {
    async restart() {
      return await fetch(`${client.chain.rpcUrls.default.http[0]}/restart`);
    },
    async stop() {
      return await fetch(`${client.chain.rpcUrls.default.http[0]}/stop`);
    },
    async healthcheck() {
      return await fetch(`${client.chain.rpcUrls.default.http[0]}/healthcheck`);
    },
    async start() {
      const server = createServer({
        instance: anvil({
          chainId: client.chain.id,
          forkUrl: client.chain.fork.url,
          forkBlockNumber: client.chain.fork.blockNumber,
          blockTime: 2,
          optimism: client.chain.fork?.opStack ? true : false,
        }),
        port: client.chain.port,
      });

      await server.start();

      const res = await this.healthcheck();
      console.log(res);
      return server;
    },
    /** Resets fork attached to chain at starting block number. */
    resetFork() {
      return client.reset({
        jsonRpcUrl: client.chain.fork.url,
        blockNumber: client.chain.fork.blockNumber,
      });
    },
  };
}

export const chains = {
  arbitrumAnvil,
  mainnetAnvil,
};

export const opStackChainClients: Record<string, OpStackChainClient> = {
  chainClientOptimism,
  chainClientBase,
};

export const chainClients: Record<string, ChainClient> = {
  chainClientMainnet,
  chainClientArbitrum,
};

export const publicClients = {
  publicClientOptimism,
  publicClientBase,
} as Record<string, PublicClient>;

export const walletClients: Record<string, ConfiguredWalletClient> = {
  testWalletOptimism,
  testWalletBase,
};
