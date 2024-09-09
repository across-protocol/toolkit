import { Chain, PublicClient } from "viem";
import {
  getAvailableRoutes,
  getSuggestedFees,
  getLimits,
  getOriginChains,
  getQuote,
  getDepositStatus,
  getFillStatus,
  getDepositLogs,
  GetDepositStatusParams,
  GetFillStatusParams,
  GetAvailableRoutesParams,
  GetSuggestedFeesParams,
  GetLimitsParams,
  simulateDepositTx,
  SimulateDepositTxParams,
} from "./actions";
import {
  MAINNET_API_URL,
  MAINNET_INDEXER_API,
  TESTNET_API_URL,
  TESTNET_INDEXER_API,
} from "./constants";
import { LogLevel, DefaultLogger, LoggerT } from "./utils";
import { createPublicClients } from "./utils/chains";
import assert from "assert";

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
  private static instance: AcrossClient | null;

  integratorId: string;
  publicClients: Record<string, PublicClient>;
  apiUrl: string;
  indexerUrl: string;
  log: LoggerT;

  public actions: {
    getAvailableRoutes: AcrossClient["getAvailableRoutes"];
    getDepositStatus: AcrossClient["getDepositStatus"];
    getFillStatus: AcrossClient["getFillStatus"];
    getSuggestedFees: AcrossClient["getSuggestedFees"];
    getLimits: AcrossClient["getLimits"];
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
      getDepositStatus: this.getDepositStatus,
      getFillStatus: this.getFillStatus,
      getLimits: this.getLimits,
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

  public getPublicClient(chainId: number): PublicClient {
    const client = this.publicClients[chainId];
    assert(client, `SDK not configured for chain with id ${chainId}.`);
    return client;
  }

  public async getDepositStatus(
    params: Omit<GetDepositStatusParams, "publicClient">,
    chainId: number,
  ) {
    return getDepositStatus({
      ...params,
      publicClient: this.getPublicClient(chainId),
    });
  }

  public async getFillStatus({
    chainId,
    ...params
  }: Omit<GetFillStatusParams, "destinationChainClient" | "indexerUrl"> & {
    chainId: number;
  }) {
    return getFillStatus({
      ...params,
      destinationChainClient: this.getPublicClient(chainId),
      indexerUrl: this.indexerUrl,
    });
  }

  public async getAvailableRoutes(
    params: Omit<GetAvailableRoutesParams, "apiUrl">,
  ) {
    return getAvailableRoutes({ ...params, apiUrl: this.apiUrl });
  }

  public async getSuggestedFees(
    params: Omit<GetSuggestedFeesParams, "apiUrl">,
  ) {
    return getSuggestedFees({ ...params, apiUrl: this.apiUrl });
  }

  public async getLimits(params: Omit<GetLimitsParams, "apiUrl">) {
    return getLimits({ ...params, apiUrl: this.apiUrl });
  }

  async simulateDepositTx(
    params: Omit<SimulateDepositTxParams, "integratorId">,
  ) {
    return simulateDepositTx({ ...params, integratorId: this.integratorId });
  }
}

export function getClient() {
  return AcrossClient.getInstance();
}
