import { Chain } from "viem";
import {
  getAvailableRoutes,
  getSuggestedFees,
  getLimits,
  getOriginChains,
  getQuote,
  waitForDepositTx,
  getFillByDepositTx,
  getDepositLogs,
  WaitForDepositTxParams,
  GetFillByDepositTxParams,
  GetAvailableRoutesParams,
  GetSuggestedFeesParams,
  GetLimitsParams,
  simulateDepositTx,
  SimulateDepositTxParams,
  waitForFillTx,
  WaitForFillTxParams,
} from "./actions";
import {
  MAINNET_API_URL,
  MAINNET_INDEXER_API,
  TESTNET_API_URL,
  TESTNET_INDEXER_API,
} from "./constants";
import { LogLevel, DefaultLogger, LoggerT } from "./utils";
import { createPublicClients } from "./utils/chains";
import { ConfigError } from "./errors";
import { ConfiguredPublicClient, ConfiguredPublicClientMap } from "./types";

const CLIENT_DEFAULTS = {
  pollingIntervalSec: 2,
  logLevel: "ERROR",
} as const;

export type AcrossClientOptions = {
  integratorId: string;
  chains: Chain[];
  rpcUrls?: {
    [key: number]: string;
  };
  logLevel?: LogLevel; // for default logger
  useTestnet?: boolean;
  logger?: LoggerT;
  pollingIntervalSec?: number; // seconds

  // @todo: add params as needed

  // pollingInterval?: number
  // tenderlyApiKey?: string
};

export class AcrossClient {
  private static instance: AcrossClient | null = null;

  integratorId: string;
  publicClients: ConfiguredPublicClientMap;
  apiUrl: string;
  indexerUrl: string;
  log: LoggerT;

  public actions: {
    getAvailableRoutes: AcrossClient["getAvailableRoutes"];
    waitForDepositTx: AcrossClient["waitForDepositTx"];
    getFillByDepositTx: AcrossClient["getFillByDepositTx"];
    getSuggestedFees: AcrossClient["getSuggestedFees"];
    getLimits: AcrossClient["getLimits"];
    waitForFillTx: AcrossClient["waitForFillTx"];
    getOriginChains: typeof getOriginChains;
    getQuote: typeof getQuote;

    getDepositLogs: typeof getDepositLogs;
    simulateDepositTx: AcrossClient["simulateDepositTx"];
    // ... actions go here
  };

  public utils: {
    // ... utils go here
  };

  private constructor(args: AcrossClientOptions) {
    this.integratorId = args.integratorId;
    this.publicClients = createPublicClients(
      args.chains,
      args.pollingIntervalSec ?? CLIENT_DEFAULTS.pollingIntervalSec,
      args?.rpcUrls,
    );
    this.indexerUrl =
      args?.useTestnet === true ? TESTNET_INDEXER_API : MAINNET_INDEXER_API;
    this.apiUrl = args?.useTestnet === true ? TESTNET_API_URL : MAINNET_API_URL;
    this.log =
      args?.logger ??
      new DefaultLogger(args?.logLevel ?? CLIENT_DEFAULTS.logLevel);
    // bind methods
    this.actions = {
      getSuggestedFees: this.getSuggestedFees,
      getAvailableRoutes: this.getAvailableRoutes,
      waitForDepositTx: this.waitForDepositTx,
      getFillByDepositTx: this.getFillByDepositTx,
      waitForFillTx: this.waitForFillTx,
      getLimits: this.getLimits.bind(this),
      getDepositLogs: getDepositLogs.bind(this),
      getOriginChains: getOriginChains.bind(this),
      getQuote: getQuote.bind(this),
      simulateDepositTx: this.simulateDepositTx.bind(this),
    };
    // bind utils
    this.utils = {};

    this.log.debug(
      "Client created with args: \n",
      JSON.stringify(args, null, 2),
    );
  }

  public static create(options: AcrossClientOptions): AcrossClient {
    if (this.instance === null) {
      this.instance = new AcrossClient(options);
    }
    return this.instance;
  }

  public static getInstance(): AcrossClient {
    if (this.instance === null) {
      throw new Error(
        "AcrossClient has not been initialized. Call create() first.",
      );
    }
    return this.instance;
  }

  getPublicClient = (chainId: number): ConfiguredPublicClient => {
    const client = this.publicClients[chainId];
    if (!client) {
      throw new ConfigError(`SDK not configured for chain with id ${chainId}.`);
    }
    return client;
  };

  waitForDepositTx = async ({
    chainId,
    ...params
  }: Omit<WaitForDepositTxParams, "publicClient"> & {
    chainId: number;
  }) => {
    return waitForDepositTx({
      ...params,
      publicClient: this.getPublicClient(chainId),
    });
  };

  getFillByDepositTx = async ({
    destinationChainId,
    ...params
  }: Omit<GetFillByDepositTxParams, "destinationChainClient" | "indexerUrl"> & {
    destinationChainId: number;
  }) => {
    return getFillByDepositTx({
      ...params,
      destinationChainClient: this.getPublicClient(destinationChainId),
      indexerUrl: this.indexerUrl,
    });
  };

  getAvailableRoutes = async (
    params: Omit<GetAvailableRoutesParams, "apiUrl">,
  ) => {
    return getAvailableRoutes({ ...params, apiUrl: this.apiUrl });
  };

  getSuggestedFees = async (params: Omit<GetSuggestedFeesParams, "apiUrl">) => {
    return getSuggestedFees({ ...params, apiUrl: this.apiUrl });
  };

  getLimits = async (params: Omit<GetLimitsParams, "apiUrl">) => {
    return getLimits({ ...params, apiUrl: this.apiUrl });
  };

  simulateDepositTx = async (
    params: Omit<SimulateDepositTxParams, "integratorId" | "publicClient">,
  ) => {
    return simulateDepositTx({
      ...params,
      integratorId: this.integratorId,
      publicClient: this.getPublicClient(params.deposit.originChainId),
    });
  };

  waitForFillTx = async (
    params: Omit<WaitForFillTxParams, "destinationPublicClient">,
  ) => {
    return waitForFillTx({
      ...params,
      destinationPublicClient: this.getPublicClient(
        params.deposit.destinationChainId,
      ),
    });
  };
}

export function getClient() {
  return AcrossClient.getInstance();
}
