import { getQuote } from "./actions";
import { MAINNET_API_URL, TESTNET_API_URL } from "./constants";
import { LogLevel, Logger } from "./utils";

export type AcrossClientOptions = {
  integratorId: string;
  logLevel?: LogLevel;
  useTestnet?: boolean;

  // @todo: add params as needed

  // pollingInterval?: number
  // tenderlyApiKey?: string
};

export class AcrossClient {
  private static instance: AcrossClient | null = null;

  apiUrl: string;
  integratorId: string;
  log: Logger;

  public actions: {
    getQuote: typeof getQuote;
    // ... actions go here
  };

  private constructor(args: AcrossClientOptions) {
    this.apiUrl = args?.useTestnet === true ? TESTNET_API_URL : MAINNET_API_URL;
    this.integratorId = args.integratorId;
    this.log = new Logger(args?.logLevel ?? "INFO");

    // bind methods
    this.actions = {
      getQuote: getQuote.bind(this),
    };

    this.log.debug(
      "Client created with args: \n",
      JSON.stringify(args, null, 2)
    );
  }

  static create(options: AcrossClientOptions): AcrossClient {
    if (AcrossClient.instance === null) {
      AcrossClient.instance = new AcrossClient(options);
    }
    return AcrossClient.instance;
  }

  static getInstance(): AcrossClient {
    if (AcrossClient.instance === null) {
      throw new Error(
        "AcrossClient has not been initialized. Call create() first."
      );
    }
    return AcrossClient.instance;
  }
}

export function getClient() {
  return AcrossClient.getInstance();
}
