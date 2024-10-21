import { Chain, base, optimism } from "viem/chains";
import {
  BLOCK_NUMBER_BASE,
  BLOCK_NUMBER_OPTIMISM,
  FORK_URL_BASE,
  FORK_URL_OPTIMISM,
  pool,
  PRIVATE_KEY,
} from "./constants.ts";
import {
  Client,
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
  PublicActions,
  publicActions,
  PublicClient,
  TestActions,
  TestRpcSchema,
  Transport,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Compute } from "./utils.ts";
import { ConfiguredWalletClient } from "../../src/index.ts";
import { createServer } from "prool";
import { anvil } from "prool/instances";

export function getRpcUrls({ port }: { port: number }) {
  return {
    port,
    rpcUrls: {
      default: {
        // append the test worker id to the rpc urls.
        http: [`http://127.0.0.1:${port}/${pool}`],
        webSocket: [`ws://127.0.0.1:${port}/${pool}`],
      },
      public: {
        http: [`http://127.0.0.1:${port}/${pool}`],
        webSocket: [`ws://127.0.0.1:${port}/${pool}`],
      },
    },
  } as const;
}

type Fork = { blockNumber: bigint; url: string };

export type AnvilChain = Compute<
  Chain & {
    fork: Fork;
    port: number;
  }
>;

const optimismFork = {
  blockNumber: BLOCK_NUMBER_OPTIMISM,
  url: FORK_URL_OPTIMISM,
} as const satisfies Fork;

const baseFork = {
  blockNumber: BLOCK_NUMBER_BASE,
  url: FORK_URL_BASE,
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

const account = privateKeyToAccount(PRIVATE_KEY);

// TEST (CHAIN) CLIENTS
// @ts-ignore
export const chainClientOptimism: ConfiguredChainClient = createTestClient({
  chain: optimismAnvil,
  mode: "anvil",
  transport: http(),
})
  .extend(forkMethods)
  .extend(publicActions);

// @ts-ignore
export const chainClientBase: ConfiguredChainClient = createTestClient({
  chain: baseAnvil,
  mode: "anvil",
  transport: http(),
})
  .extend(forkMethods)
  .extend(publicActions);

// PUBLIC CLIENTS
const publicClientOptimism = createPublicClient({
  chain: optimismAnvil,
  transport: http(),
});

const publicClientBase = createPublicClient({
  chain: baseAnvil,
  transport: http(),
});

// WALLET CLIENTS
const testWalletOptimism = createWalletClient({
  account,
  chain: optimismAnvil,
  transport: http(),
});

const testWalletBase = createWalletClient({
  account,
  chain: baseAnvil,
  transport: http(),
});

export type ConfiguredChainClient = Client<
  Transport,
  AnvilChain,
  undefined,
  TestRpcSchema<"anvil">,
  TestActions & ForkMethods & PublicActions
>;

type ConfiguredPublicClient = PublicClient<Transport, Chain, undefined>;

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
    async start() {
      const server = createServer({
        instance: anvil({
          chainId: client.chain.id,
          forkUrl: client.chain.fork.url,
          forkBlockNumber: client.chain.fork.blockNumber,
          noMining: true,
        }),
        port: client.chain.port,
        host: "127.0.0.1",
      });

      await server.start();
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
  optimismAnvil,
  baseAnvil,
};

export const chainClients: Record<string, ConfiguredChainClient> = {
  chainClientOptimism,
  chainClientBase,
};

export const publicClients = {
  publicClientOptimism,
  publicClientBase,
} as Record<string, PublicClient>;

export const walletClients: Record<string, ConfiguredWalletClient> = {
  testWalletOptimism,
  testWalletBase,
};
