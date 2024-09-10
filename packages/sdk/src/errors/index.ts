import { Hash } from "viem";

export class DepositRevert extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "Deposit Reverted";
  }
}

export class HttpError extends Error {
  public readonly url: string;
  public readonly code: number;
  constructor(code: number, url: string, message?: string, cause?: Error) {
    super(message, { cause });
    this.name = "HTTP Error";
    this.code = code;
    this.url = url;
  }
}

export class IndexerError extends Error {
  public readonly url: string;
  constructor(url: string, message?: string, error?: string) {
    super(message);
    this.name = error ?? "Indexer Error";
    this.url = url;
  }
}

export class ConfigError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "Config Error";
  }
}

export class NoDepositLogError extends Error {
  constructor(txHash: Hash, chainId: number) {
    super(`Unable to parse depositV3 log for tx ${txHash} on chain ${chainId}`);
    this.name = "Deposit Log Not Found";
  }
}

export class NoFillLogError extends Error {
  constructor(depositId: number, depositTxHash: Hash, chainId: number) {
    super(
      `Unable to find fill log on chain ${chainId} for deposit id #${depositId} with depositTxHash ${depositTxHash}`,
    );
    this.name = "Fill Log Not Found";
  }
}
