import {
  getAvailableRoutes,
  getSuggestedFees,
  getLimits,
  getOriginChains,
  getQuote,
  simulateDepositTx,
  SimulateDepositTxParams,
} from "./actions";
import { MAINNET_API_URL, TESTNET_API_URL } from "./constants";
import { LogLevel, DefaultLogger, LoggerT } from "./utils";

export type AcrossClientOptions = {
  integratorId: string;
  logLevel?: LogLevel; // for default logger
  useTestnet?: boolean;
  logger?: LoggerT;

  // @todo: add params as needed

  // pollingInterval?: number
  // tenderlyApiKey?: string
};

export class AcrossClient {
  private static instance: AcrossClient | null = null;

  apiUrl: string;
  integratorId: string;
  log: LoggerT;

  public actions: {
    getSuggestedFees: typeof getSuggestedFees;
    getAvailableRoutes: typeof getAvailableRoutes;
    getLimits: typeof getLimits;
    getOriginChains: typeof getOriginChains;
    getQuote: typeof getQuote;
    simulateDepositTx: (
      params: Omit<SimulateDepositTxParams, "integratorId">,
    ) => ReturnType<typeof simulateDepositTx>;
    // ... actions go here
  };

  private constructor(args: AcrossClientOptions) {
    this.apiUrl = args?.useTestnet === true ? TESTNET_API_URL : MAINNET_API_URL;
    this.integratorId = args.integratorId;
    this.log = args?.logger ?? new DefaultLogger(args?.logLevel ?? "ERROR");

    // bind methods
    this.actions = {
      getSuggestedFees: getSuggestedFees.bind(this),
      getAvailableRoutes: getAvailableRoutes.bind(this),
      getLimits: getLimits.bind(this),
      getOriginChains: getOriginChains.bind(this),
      getQuote: getQuote.bind(this),
      simulateDepositTx: (
        params: Omit<SimulateDepositTxParams, "integratorId">,
      ) => simulateDepositTx({ ...params, integratorId: this.integratorId }),
    };

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
}

export function getClient() {
  return AcrossClient.getInstance();
}
