import {
  Chain,
  ContractFunctionExecutionError,
  encodeFunctionData,
  WalletClient,
} from "viem";
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
  ExecuteQuoteParams,
  executeQuote,
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
  GetSupportedChainsParams,
  getSupportedChains,
  simulateTxOnTenderly,
  TenderlySimulateTxParams,
} from "./utils";
import {
  AcrossApiSimulationError,
  ConfigError,
  SimulationError,
} from "./errors";
import { ConfiguredPublicClient, ConfiguredPublicClientMap } from "./types";

const CLIENT_DEFAULTS = {
  pollingInterval: 3_000,
  logLevel: "ERROR",
} as const;

export type AcrossClientOptions = {
  integratorId: string;
  chains: Chain[];
  walletClient?: WalletClient;
  rpcUrls?: {
    [key: number]: string;
  };
  logLevel?: LogLevel; // for default logger
  useTestnet?: boolean;
  logger?: LoggerT;
  pollingInterval?: number; // milliseconds seconds
  tenderly?: {
    simOnError?: boolean;
    accessKey: string;
    accountSlug: string;
    projectSlug: string;
  };
};

export class AcrossClient {
  private static instance: AcrossClient | null = null;

  integratorId: string;
  publicClients: ConfiguredPublicClientMap;
  walletClient?: WalletClient;
  apiUrl: string;
  indexerUrl: string;
  logger: LoggerT;

  // Tenderly related options
  tenderly?: {
    simOnError?: boolean;
    accessKey: string;
    accountSlug: string;
    projectSlug: string;
  };

  get isTenderlyEnabled() {
    return Boolean(
      this.tenderly?.accessKey &&
        this.tenderly?.accountSlug &&
        this.tenderly?.projectSlug,
    );
  }

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
    executeQuote: AcrossClient["executeQuote"];
  };

  public utils: {
    getSupportedChains: AcrossClient["getSupportedChains"];
    simulateTxOnTenderly: AcrossClient["simulateTxOnTenderly"];
  };

  private constructor(args: AcrossClientOptions) {
    this.integratorId = args.integratorId;
    this.walletClient = args.walletClient;
    this.publicClients = configurePublicClients(
      args.chains,
      args.pollingInterval ?? CLIENT_DEFAULTS.pollingInterval,
      args?.rpcUrls,
    );
    this.indexerUrl =
      args?.useTestnet === true ? TESTNET_INDEXER_API : MAINNET_INDEXER_API;
    this.apiUrl = args?.useTestnet === true ? TESTNET_API_URL : MAINNET_API_URL;
    this.logger =
      args?.logger ??
      new DefaultLogger(args?.logLevel ?? CLIENT_DEFAULTS.logLevel);
    this.tenderly = args.tenderly;
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
      executeQuote: this.executeQuote.bind(this),
    };
    // bind utils
    this.utils = {
      getSupportedChains: this.getSupportedChains.bind(this),
      simulateTxOnTenderly: this.simulateTxOnTenderly.bind(this),
    };

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

  update(params: Pick<AcrossClientOptions, "walletClient">) {
    this.walletClient = params.walletClient;
  }

  getPublicClient(chainId: number): ConfiguredPublicClient {
    const client = this.publicClients.get(chainId);
    if (!client) {
      throw new ConfigError(`SDK not configured for chain with id ${chainId}.`);
    }
    this.logger.debug(`Using configured public client for chain ${chainId}.`);
    return client;
  }

  async executeQuote(
    params: Omit<
      ExecuteQuoteParams,
      | "logger"
      | "walletClient"
      | "originClient"
      | "destinationClient"
      | "integratorId"
    >,
  ) {
    if (!this.walletClient) {
      throw new ConfigError(
        "WalletClient needs to be set to call 'executeQuote'",
      );
    }

    try {
      await executeQuote({
        ...params,
        integratorId: this.integratorId,
        logger: this.logger,
        walletClient: this.walletClient,
        originClient: this.getPublicClient(params.deposit.originChainId),
        destinationClient: this.getPublicClient(
          params.deposit.destinationChainId,
        ),
      });
    } catch (e) {
      if (
        !this.isTenderlyEnabled ||
        !this.tenderly?.simOnError ||
        !(
          e instanceof AcrossApiSimulationError ||
          e instanceof ContractFunctionExecutionError
        )
      ) {
        throw e;
      }

      // The Across API only throws an `AcrossApiSimulationError` when simulating fills
      // on the destination chain.
      const isFillSimulationError = e instanceof AcrossApiSimulationError;
      const simParams = isFillSimulationError
        ? {
            networkId: params.deposit.destinationChainId.toString(),
            from: e.transaction.from,
            to: e.transaction.to,
            data: e.transaction.data,
          }
        : {
            networkId: params.deposit.originChainId.toString(),
            from: e.sender!,
            to: e.contractAddress!,
            data: encodeFunctionData({
              abi: e.abi,
              functionName: e.functionName,
              args: e.args,
            }),
          };
      const { simulationId, simulationUrl } = await this.simulateTxOnTenderly({
        value: params.deposit.isNative
          ? String(params.deposit.inputAmount)
          : "0",
        ...simParams,
      });
      const reason = isFillSimulationError ? e.message : e.shortMessage;
      throw new SimulationError({
        simulationId,
        simulationUrl,
        message: `simulation failed while executing quote: ${reason}`,
      });
    }
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
    try {
      const fees = await getSuggestedFees({
        ...params,
        apiUrl: this.apiUrl,
        logger: this.logger,
      });
      return fees;
    } catch (e) {
      if (
        !this.isTenderlyEnabled ||
        !this.tenderly?.simOnError ||
        !(e instanceof AcrossApiSimulationError)
      ) {
        throw e;
      }

      const { simulationId, simulationUrl } = await this.simulateTxOnTenderly({
        networkId: params.destinationChainId.toString(),
        to: e.transaction.to,
        data: e.transaction.data,
        from: e.transaction.from,
        value: e.transaction.value ?? "0",
      });
      throw new SimulationError({
        simulationId,
        simulationUrl,
        message: `simulation failed while fetching suggested fees: ${e.message}`,
      });
    }
  }

  async getLimits(params: Omit<GetLimitsParams, "apiUrl" | "logger">) {
    try {
      const limits = await getLimits({
        ...params,
        apiUrl: this.apiUrl,
        logger: this.logger,
      });
      return limits;
    } catch (e) {
      if (
        !this.tenderly?.simOnError ||
        !(e instanceof AcrossApiSimulationError)
      ) {
        throw e;
      }

      const { simulationId, simulationUrl } = await this.simulateTxOnTenderly({
        networkId: params.destinationChainId.toString(),
        to: e.transaction.to,
        data: e.transaction.data,
        from: e.transaction.from,
        value: e.transaction.value ?? "0",
      });
      throw new SimulationError({
        simulationId,
        simulationUrl,
        message: `simulation failed while fetching limits: ${e.message}`,
      });
    }
  }

  async getQuote(params: Omit<GetQuoteParams, "logger" | "apiUrl">) {
    try {
      const quote = await getQuote({
        ...params,
        logger: this.logger,
        apiUrl: this.apiUrl,
      });
      return quote;
    } catch (e) {
      if (
        !this.tenderly?.simOnError ||
        !(e instanceof AcrossApiSimulationError)
      ) {
        throw e;
      }

      const { simulationId, simulationUrl } = await this.simulateTxOnTenderly({
        networkId: params.route.originChainId.toString(),
        to: e.transaction.to,
        data: e.transaction.data,
        from: e.transaction.from,
        value: e.transaction.value ?? "0",
      });
      throw new SimulationError({
        simulationId,
        simulationUrl,
        message: `simulation failed while fetching quote: ${e.message}`,
      });
    }
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
    try {
      const result = await simulateDepositTx({
        ...params,
        integratorId: this.integratorId,
        publicClient: this.getPublicClient(params.deposit.originChainId),
        logger: this.logger,
      });
      return result;
    } catch (e) {
      if (
        !this.tenderly?.simOnError ||
        !this.isTenderlyEnabled ||
        !(e instanceof ContractFunctionExecutionError)
      ) {
        throw e;
      }

      const { simulationId, simulationUrl } = await this.simulateTxOnTenderly({
        networkId: params.deposit.originChainId.toString(),
        from: e.sender!,
        to: e.contractAddress!,
        data: encodeFunctionData({
          abi: e.abi,
          functionName: e.functionName,
          args: e.args,
        }),
        value: params.deposit.isNative
          ? String(params.deposit.inputAmount)
          : "0",
      });
      throw new SimulationError({
        simulationId,
        simulationUrl,
        message: `deposit simulation failed: ${e.shortMessage}`,
      });
    }
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

  /* -------------------------------- Utilities ------------------------------- */

  async getSupportedChains(
    params: Omit<GetSupportedChainsParams, "apiUrl" | "logger">,
  ) {
    return getSupportedChains({
      ...params,
      logger: this.logger,
      apiUrl: this.apiUrl,
    });
  }

  async simulateTxOnTenderly(
    params: Omit<
      TenderlySimulateTxParams,
      "enableShare" | "accessKey" | "accountSlug" | "projectSlug"
    >,
  ) {
    if (
      !this.tenderly?.accessKey ||
      !this.tenderly?.accountSlug ||
      !this.tenderly?.projectSlug
    ) {
      throw new ConfigError(
        "Tenderly credentials not set. Client needs to be configured with " +
          "'tenderly.accessKey', 'tenderly.accountSlug', and 'tenderly.projectSlug'.",
      );
    }

    return simulateTxOnTenderly({
      ...params,
      accessKey: this.tenderly?.accessKey,
      accountSlug: this.tenderly?.accountSlug,
      projectSlug: this.tenderly?.projectSlug,
      enableShare: true,
    });
  }
}

export function getClient() {
  return AcrossClient.getInstance();
}
