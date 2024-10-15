import {
  Address,
  Chain,
  ContractFunctionExecutionError,
  encodeFunctionData,
  Hex,
} from "viem";
import {
  getAvailableRoutes,
  getSuggestedFees,
  getLimits,
  getQuote,
  waitForDepositTx,
  getDeposit,
  getFillByDepositTx,
  WaitForDepositTxParams,
  GetAvailableRoutesParams,
  GetAvailableRoutesReturnType,
  GetSuggestedFeesParams,
  GetSuggestedFeesReturnType,
  GetLimitsParams,
  GetLimitsReturnType,
  simulateDepositTx,
  SimulateDepositTxParams,
  waitForFillTx,
  WaitForFillTxParams,
  GetQuoteParams,
  ExecuteQuoteParams,
  executeQuote,
  GetDepositParams,
  GetFillByDepositTxParams,
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
  assertValidIntegratorId,
  AcrossChain,
} from "./utils";
import {
  AcrossApiSimulationError,
  ConfigError,
  SimulationError,
} from "./errors";
import {
  ChainInfoMap,
  ConfiguredPublicClient,
  ConfiguredPublicClientMap,
  ConfiguredWalletClient,
} from "./types";
import { MakeOptional } from "./utils/typeUtils";

const CLIENT_DEFAULTS = {
  pollingInterval: 3_000,
  integratorId: "0xdead",
  logLevel: "ERROR",
} as const;

/** Options for {@link AcrossClient.create} */
export type AcrossClientOptions = {
  /**
   * An identifier representing the integrator.
   */
  integratorId?: Hex;
  /**
   * The chains to use for the Across API. Should be imported from `viem/chains`.
   */
  chains: Chain[];
  /**
   * A wallet client to use for the Across API.
   */
  walletClient?: ConfiguredWalletClient;
  /**
   * The RPC URLs to use for the Across API. Will fall back to the default public RPC URL
   * for the chain if not specified.
   */
  rpcUrls?: {
    [chainId: number]: string;
  };
  /**
   * The log level to use. Defaults to `"ERROR"`.
   */
  logLevel?: LogLevel;
  /**
   * Whether to use the testnet API. Defaults to `false`.
   */
  useTestnet?: boolean;
  /**
   * A custom logger to use for the Across API. Defaults to a console logger.
   */
  logger?: LoggerT;
  /**
   * The polling interval in milliseconds to use for the Across API.
   * Defaults to `3_000` milliseconds.
   */
  pollingInterval?: number;
  /**
   * Tenderly related options. Can be used for additional debugging support on Tenderly.
   * @see https://tenderly.co/transaction-simulator
   */
  tenderly?: {
    /**
     * Whether to automatically simulate transactions on Tenderly when an error occurs.
     * Defaults to `true` if credentials `tenderly.accessKey`, `tenderly.accountSlug`,
     * and `tenderly.projectSlug` are provided.
     */
    simOnError?: boolean;
    /**
     * The Tenderly API access key.
     * @see https://docs.tenderly.co/account/projects/how-to-generate-api-access-token
     */
    accessKey: string;
    /**
     * The Tenderly account slug.
     * @see https://docs.tenderly.co/account/projects/account-project-slug
     */
    accountSlug: string;
    /**
     * The Tenderly project slug.
     * @see https://docs.tenderly.co/account/projects/account-project-slug
     */
    projectSlug: string;
  };
};

/**
 * Entrypoint for the Across Integrator SDK
 */
export class AcrossClient {
  private static instance: AcrossClient | null = null;

  private integratorId: Hex;
  private publicClients: ConfiguredPublicClientMap;
  private chainInfo?: ChainInfoMap;
  private walletClient?: ConfiguredWalletClient;
  private apiUrl: string;
  private indexerUrl: string;

  logger: LoggerT;

  // Tenderly related options
  private tenderly?: {
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

  private constructor(args: AcrossClientOptions) {
    const integratorId = args?.integratorId ?? CLIENT_DEFAULTS.integratorId;
    assertValidIntegratorId(integratorId);

    this.integratorId = integratorId;
    this.walletClient = args?.walletClient;
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

    if (this.tenderly) {
      this.tenderly.simOnError = args.tenderly?.simOnError ?? true;
    }

    this.logger.debug("Client created with args: \n", args);
  }

  /**
   * Create a new `AcrossClient` instance as a singleton.
   * @param options - See {@link AcrossClientOptions}.
   * @returns A new `AcrossClient` instance if it doesn't exist, otherwise the existing
   * instance.
   */
  public static create(options: AcrossClientOptions): AcrossClient {
    if (this.instance === null) {
      this.instance = new AcrossClient(options);
    }
    return this.instance;
  }

  /**
   * Get the existing `AcrossClient` singleton instance.
   * @returns The existing `AcrossClient` instance.
   * @throws If the instance is not initialized.
   */
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

  /**
   * @internal
   */
  getPublicClient(chainId: number): ConfiguredPublicClient {
    const client = this.publicClients.get(chainId);
    if (!client) {
      throw new ConfigError(`SDK not configured for chain with id ${chainId}.`);
    }
    this.logger.debug(`Using configured public client for chain ${chainId}.`);
    return client;
  }

  async getSpokePoolAddress(chainId: number): Promise<Address> {
    const chainInfo = await this.getChainInfo(chainId);
    return chainInfo.spokePool;
  }

  /**
   * @param chainId - number
   * @returns See {@link AcrossChain}.
   */
  async getChainInfo(chainId: number): Promise<AcrossChain> {
    if (!this.chainInfo) {
      const acrossChains = await this.getSupportedChains({
        chainId: Array.from(this.publicClients.keys()),
      });
      // cache across chain info in memory
      this.chainInfo = new Map(
        acrossChains.map((acrossChain) => [acrossChain.chainId, acrossChain]),
      );
    }
    if (!this.chainInfo.has(chainId)) {
      throw new Error(`Could not find chainInfo for chain with id ${chainId}`);
    }

    return this.chainInfo.get(chainId)!;
  }

  /**
   * Execute a quote by:
   * 1. Approving the SpokePool contract if necessary
   * 2. Depositing the input token on the origin chain
   * 3. Waiting for the deposit to be filled on the destination chain
   *
   * See {@link executeQuote} for more details.
   *
   * @example
   * ```ts
   * const quote = await client.getQuote({ route, inputAmount });
   * const { depositId } = await client.executeQuote({ deposit: quote.deposit });
   * ```
   *
   * @param params - See {@link ExecuteQuoteParams}.
   * @returns The deposit ID and receipts for the deposit and fill transactions.
   */
  async executeQuote(
    params: MakeOptional<
      ExecuteQuoteParams,
      "logger" | "originClient" | "destinationClient" | "integratorId"
    >,
  ) {
    const logger = params?.logger ?? this.logger;
    const originClient =
      params?.originClient ??
      this.getPublicClient(params.deposit.originChainId);
    const destinationClient =
      params?.destinationClient ??
      this.getPublicClient(params.deposit.destinationChainId);
    const integratorId = params?.integratorId ?? this.integratorId;
    const walletClient = params?.walletClient ?? this?.walletClient;

    if (!walletClient) {
      throw new ConfigError(
        "WalletClient needs to be set to call 'executeQuote'",
      );
    }

    try {
      await executeQuote({
        ...params,
        integratorId,
        logger,
        walletClient,
        originClient,
        destinationClient,
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

  /**
   * Get the available routes for a given set of parameters. See {@link getAvailableRoutes}.
   * @param params - See {@link GetAvailableRoutesParams}.
   * @returns See {@link GetAvailableRoutesReturnType}.
   */
  async getAvailableRoutes(
    params: MakeOptional<GetAvailableRoutesParams, "apiUrl" | "logger">,
  ): Promise<GetAvailableRoutesReturnType> {
    return getAvailableRoutes({
      ...params,
      apiUrl: params?.apiUrl || this.apiUrl,
      logger: params?.logger ?? this.logger,
    });
  }

  /**
   * Get the suggested fees for a given route. See {@link getSuggestedFees}.
   * @param params - See {@link GetSuggestedFeesParams}.
   * @returns See {@link GetSuggestedFeesReturnType}.
   */
  async getSuggestedFees(
    params: MakeOptional<GetSuggestedFeesParams, "apiUrl" | "logger">,
  ): Promise<GetSuggestedFeesReturnType> {
    try {
      const fees = await getSuggestedFees({
        ...params,
        apiUrl: params?.apiUrl ?? this.apiUrl,
        logger: params?.logger ?? this.logger,
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

  /**
   * Get the deposit limits for a given route. See {@link getLimits}.
   * @param params - See {@link GetLimitsParams}.
   * @returns See {@link GetLimitsReturnType}.
   */
  async getLimits(
    params: MakeOptional<GetLimitsParams, "apiUrl" | "logger">,
  ): Promise<GetLimitsReturnType> {
    try {
      const limits = await getLimits({
        ...params,
        apiUrl: params?.apiUrl ?? this.apiUrl,
        logger: params?.logger ?? this.logger,
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

  /**
   * Get a quote for a given set of parameters. See {@link getQuote}.
   * @param params - See {@link GetQuoteParams}.
   * @returns See {@link Quote}.
   */
  async getQuote(params: MakeOptional<GetQuoteParams, "logger" | "apiUrl">) {
    try {
      const quote = await getQuote({
        ...params,
        logger: params?.logger ?? this.logger,
        apiUrl: params?.apiUrl ?? this.apiUrl,
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

  async simulateDepositTx(
    params: MakeOptional<
      SimulateDepositTxParams,
      "integratorId" | "publicClient" | "logger"
    >,
  ) {
    try {
      const result = await simulateDepositTx({
        ...params,
        integratorId: params?.integratorId ?? this.integratorId,
        publicClient:
          params?.publicClient ??
          this.getPublicClient(params.deposit.originChainId),
        logger: params?.logger ?? this.logger,
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

  async waitForDepositTx(
    params: MakeOptional<WaitForDepositTxParams, "publicClient">,
  ) {
    return waitForDepositTx({
      ...params,
      publicClient:
        params?.publicClient ?? this.getPublicClient(params.originChainId),
    });
  }

  /**
   * Get a fill after a deposit has been made. See {@link getFillByDepositTx}.
   * @param params - See {@link GetFillByDepositTxParams}.
   * @returns See {@link FillStatus}.
   */
  async getFillByDepositTx(
    params: MakeOptional<
      GetFillByDepositTxParams,
      "destinationChainClient" | "indexerUrl" | "logger"
    >,
  ) {
    return getFillByDepositTx({
      ...params,
      destinationChainClient:
        params?.destinationChainClient ??
        this.getPublicClient(params.deposit.destinationChainId),
      indexerUrl: params?.indexerUrl ?? this.indexerUrl,
      logger: params?.logger ?? this.logger,
    });
  }

  async waitForFillTx(
    params: MakeOptional<WaitForFillTxParams, "destinationChainClient">,
  ) {
    return waitForFillTx({
      ...params,
      destinationChainClient:
        params?.destinationChainClient ??
        this.getPublicClient(params.deposit.destinationChainId),
      logger: params?.logger ?? this.logger,
    });
  }

  /**
   * Get a deposit by its deposit tx hash or deposit id + spoke pool address. See {@link getDeposit}.
   * @param params - See {@link GetDepositParams}.
   * @returns See {@link Deposit}.
   */
  async getDeposit(
    params: MakeOptional<
      Omit<GetDepositParams, "findBy">,
      "originChainClient" | "destinationChainClient" | "indexerUrl"
    > & {
      findBy: {
        originSpokePoolAddress?: Address;
        destinationSpokePoolAddress?: Address;
        originChainId: number;
        destinationChainId: number;
        depositId?: number;
        depositTxHash?: Hex;
      };
    },
  ) {
    const originSpokePoolAddress =
      params.findBy.originSpokePoolAddress ??
      (await this.getSpokePoolAddress(params.findBy.originChainId));
    const destinationSpokePoolAddress =
      params.findBy.destinationSpokePoolAddress ??
      (await this.getSpokePoolAddress(params.findBy.destinationChainId));

    return getDeposit({
      ...params,
      findBy: {
        ...params.findBy,
        originSpokePoolAddress,
        destinationSpokePoolAddress,
      },
      indexerUrl: params?.indexerUrl ?? this.indexerUrl,
      originChainClient:
        params?.originChainClient ??
        this.getPublicClient(params.findBy.originChainId),
      destinationChainClient:
        params?.destinationChainClient ??
        this.getPublicClient(params.findBy.destinationChainId),
    });
  }

  /* -------------------------------- Utilities ------------------------------- */

  async getSupportedChains(
    params: MakeOptional<GetSupportedChainsParams, "apiUrl" | "logger">,
  ) {
    return getSupportedChains({
      ...params,
      logger: params?.logger ?? this.logger,
      apiUrl: params?.apiUrl ?? this.apiUrl,
    });
  }

  async simulateTxOnTenderly(
    params: MakeOptional<
      TenderlySimulateTxParams,
      "enableShare" | "accessKey" | "accountSlug" | "projectSlug"
    >,
  ) {
    const accessKey = params?.accessKey ?? this.tenderly?.accessKey;
    const accountSlug = params?.accountSlug ?? this.tenderly?.accountSlug;
    const projectSlug = params?.projectSlug ?? this.tenderly?.projectSlug;
    const enableShare = params?.enableShare ?? true;

    if (!accessKey || !accountSlug || !projectSlug) {
      throw new ConfigError(
        "Tenderly credentials not set. Client needs to be configured with " +
          "'tenderly.accessKey', 'tenderly.accountSlug', and 'tenderly.projectSlug'.",
      );
    }

    return simulateTxOnTenderly({
      ...params,
      accessKey,
      accountSlug,
      projectSlug,
      enableShare,
    });
  }
}

/**
 * Get the existing `AcrossClient` singleton instance.
 * @returns The existing `AcrossClient` instance.
 * @throws If the instance is not initialized.
 * @public
 */
export function getAcrossClient() {
  return AcrossClient.getInstance();
}

/**
 * Create a singleton `AcrossClient` instance.
 * @param options - See {@link AcrossClientOptions}.
 * @returns A new `AcrossClient` instance.
 * @public
 */
export function createAcrossClient(options: AcrossClientOptions) {
  return AcrossClient.create(options);
}
