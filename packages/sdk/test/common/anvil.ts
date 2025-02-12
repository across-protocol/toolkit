import { arbitrum, type Chain, mainnet } from "viem/chains";
import {
  BLOCK_NUMBER_ARBITRUM,
  BLOCK_NUMBER_MAINNET,
  FORK_URL_ARBITRUM,
  FORK_URL_MAINNET,
  pool,
  PRIVATE_KEY,
} from "./constants.js";
import {
  type Account,
  type Client,
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
  publicActions,
  type PublicActions,
  type TestActions,
  type TestRpcSchema,
  type Transport,
  type WalletActions,
  walletActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { type Compute } from "./utils.js";
import { createServer } from "prool";
import { anvil } from "prool/instances";

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

export type Fork = { blockNumber: bigint; url: string; opStack?: boolean };

export type AnvilChain = Compute<
  Chain & {
    fork: Fork;
    port: number;
  }
>;

const mainnetFork = {
  blockNumber: BLOCK_NUMBER_MAINNET,
  url: FORK_URL_MAINNET,
} as const satisfies Fork;

const arbitrumFork = {
  blockNumber: BLOCK_NUMBER_ARBITRUM,
  url: FORK_URL_ARBITRUM,
} as const satisfies Fork;

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

export const testAccount = privateKeyToAccount(PRIVATE_KEY);

// TEST (CHAIN) CLIENTS
export const chainClientMainnet: ChainClient = createTestClient({
  account: testAccount,
  chain: mainnetAnvil,
  mode: "anvil",
  transport: http(),
})
  .extend(forkMethods)
  .extend(publicActions)
  .extend(walletActions);

export const chainClientArbitrum: ChainClient = createTestClient({
  account: testAccount,
  chain: arbitrumAnvil,
  mode: "anvil",
  transport: http(),
})
  .extend(forkMethods)
  .extend(publicActions)
  .extend(walletActions);

// PUBLIC CLIENTS
export const publicClientMainnet = createPublicClient({
  chain: mainnetAnvil,
  transport: http(),
});

export const publicClientArbitrum = createPublicClient({
  chain: arbitrumAnvil,
  transport: http(),
});

// WALLET CLIENTS
export const testWalletMainnet = createWalletClient({
  account: testAccount,
  chain: mainnetAnvil,
  transport: http(),
});

export const testWalletArbitrum = createWalletClient({
  account: testAccount,
  chain: arbitrumAnvil,
  transport: http(),
});

export type ChainClient = Client<
  Transport,
  AnvilChain,
  Account,
  TestRpcSchema<"anvil">,
  TestActions & ForkMethods & PublicActions & WalletActions
>;

type ForkMethods = ReturnType<typeof forkMethods>;

export function forkMethods(
  client: Client<
    Transport,
    AnvilChain,
    Account,
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
          blockTime: 1,
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

export const chainClients: Record<string, ChainClient> = {
  chainClientMainnet,
  chainClientArbitrum,
};
