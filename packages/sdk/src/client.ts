import { Chain } from "viem";
import {
  getAvailableRoutes,
  getSuggestedFees,
  getLimits,
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
  GetQuoteParams,
  GetDepositLogsParams,
} from "./actions";
import {
  MAINNET_API_URL,
  MAINNET_INDEXER_API,
  TESTNET_API_URL,
  TESTNET_INDEXER_API,
} from "./constants";
import {
  LogLevel,
  DefaultLogger,
  LoggerT,
  configurePublicClients,
} from "./utils";
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
  // tenderlyApiKey?: string
};

export class AcrossClient {
  private static instance: AcrossClient | null = null;

  integratorId: string;
  publicClients: ConfiguredPublicClientMap;
  apiUrl: string;
  indexerUrl: string;
  logger: LoggerT;

  public actions: {
    getAvailableRoutes: AcrossClient["getAvailableRoutes"];
    waitForDepositTx: AcrossClient["waitForDepositTx"];
    getFillByDepositTx: AcrossClient["getFillByDepositTx"];
    getSuggestedFees: AcrossClient["getSuggestedFees"];
    getLimits: AcrossClient["getLimits"];
    waitForFillTx: AcrossClient["waitForFillTx"];
    getQuote: AcrossClient["getQuote"];
    getDepositLogs: AcrossClient["getDepositLogs"];
    simulateDepositTx: AcrossClient["simulateDepositTx"];
    // ... actions go here
  };

  public utils: {
    // ... utils go here
  };

  private constructor(args: AcrossClientOptions) {
    this.integratorId = args.integratorId;
    this.publicClients = configurePublicClients(
      args.chains,
      args.pollingIntervalSec ?? CLIENT_DEFAULTS.pollingIntervalSec,
      args?.rpcUrls,
    );
    this.indexerUrl =
      args?.useTestnet === true ? TESTNET_INDEXER_API : MAINNET_INDEXER_API;
    this.apiUrl = args?.useTestnet === true ? TESTNET_API_URL : MAINNET_API_URL;
    this.logger =
      args?.logger ??
      new DefaultLogger(args?.logLevel ?? CLIENT_DEFAULTS.logLevel);
    // bind methods
    this.actions = {
      getSuggestedFees: this.getSuggestedFees.bind(this),
      getAvailableRoutes: this.getAvailableRoutes.bind(this),
      waitForDepositTx: this.waitForDepositTx.bind(this),
      getFillByDepositTx: this.getFillByDepositTx.bind(this),
      waitForFillTx: this.waitForFillTx.bind(this),
      getQuote: this.getQuote.bind(this),
      getLimits: this.getLimits.bind(this),
      getDepositLogs: this.getDepositLogs.bind(this),
      simulateDepositTx: this.simulateDepositTx.bind(this),
    };
    // bind utils
    this.utils = {};

    this.logger.debug("Client created with args: \n", args);
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

  getPublicClient(chainId: number): ConfiguredPublicClient {
    const client = this.publicClients.get(chainId);
    if (!client) {
      throw new ConfigError(`SDK not configured for chain with id ${chainId}.`);
    }
    this.logger.debug(`Using configured public client for chain ${chainId}.`);
    return client;
  }

  async getAvailableRoutes(
    params: Omit<GetAvailableRoutesParams, "apiUrl" | "logger">,
  ) {
    return getAvailableRoutes({
      ...params,
      apiUrl: this.apiUrl,
      logger: this.logger,
    });
  }

  async getSuggestedFees(
    params: Omit<GetSuggestedFeesParams, "apiUrl" | "logger">,
  ) {
    return getSuggestedFees({
      ...params,
      apiUrl: this.apiUrl,
      logger: this.logger,
    });
  }

  async getLimits(params: Omit<GetLimitsParams, "apiUrl" | "logger">) {
    return getLimits({ ...params, apiUrl: this.apiUrl, logger: this.logger });
  }

  async getQuote(params: Omit<GetQuoteParams, "logger">) {
    return getQuote({ ...params, logger: this.logger });
  }
  async getDepositLogs(params: GetDepositLogsParams) {
    return getDepositLogs(params);
  }

  async simulateDepositTx(
    params: Omit<
      SimulateDepositTxParams,
      "integratorId" | "publicClient" | "logger"
    >,
  ) {
    return simulateDepositTx({
      ...params,
      integratorId: this.integratorId,
      publicClient: this.getPublicClient(params.deposit.originChainId),
      logger: this.logger,
    });
  }

  async waitForDepositTx({
    chainId,
    ...params
  }: Omit<WaitForDepositTxParams, "publicClient"> & {
    chainId: number;
  }) {
    return waitForDepositTx({
      ...params,
      publicClient: this.getPublicClient(chainId),
    });
  }

  async getFillByDepositTx({
    destinationChainId,
    ...params
  }: Omit<GetFillByDepositTxParams, "destinationChainClient" | "indexerUrl"> & {
    destinationChainId: number;
  }) {
    return getFillByDepositTx({
      ...params,
      destinationChainClient: this.getPublicClient(destinationChainId),
      indexerUrl: this.indexerUrl,
    });
  }

  async waitForFillTx(
    params: Omit<WaitForFillTxParams, "destinationPublicClient">,
  ) {
    return waitForFillTx({
      ...params,
      destinationPublicClient: this.getPublicClient(
        params.deposit.destinationChainId,
      ),
    });
  }
}

export function getClient() {
  return AcrossClient.getInstance();
}
