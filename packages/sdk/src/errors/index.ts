import { Address, Hash, Hex } from "viem";
import { AcrossErrorCodeType } from "./acrossApi.js";

export type { AcrossErrorCodeType };

export class DepositRevert extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "Deposit Reverted";
  }
}

export class HttpError extends Error {
  public readonly url: string;
  public readonly status: number;
  constructor(
    params: {
      status: number;
      url: string;
      name?: string;
      message?: string;
    },
    opts?: ErrorOptions,
  ) {
    super(params.message, opts);
    this.name = params.name ?? "HttpError";
    this.url = params.url;
    this.status = params.status;
  }
}

export class AcrossApiError extends HttpError {
  constructor(
    params: {
      name?: string;
      status: number;
      url: string;
      message?: string;
      code: AcrossErrorCodeType;
    },
    opts?: ErrorOptions,
  ) {
    super(
      {
        ...params,
        name: params.name ?? "AcrossApiError",
      },
      opts,
    );
  }
}

export class AcrossApiSimulationError extends AcrossApiError {
  public readonly transaction: {
    from: Address;
    to: Address;
    data: Hex;
    value?: string;
  };

  constructor(
    params: {
      url: string;
      message?: string;
      transaction: {
        from: Address;
        to: Address;
        data: Hex;
        value?: string;
      };
    },
    opts?: ErrorOptions,
  ) {
    super(
      {
        ...params,
        name: "AcrossApiSimulationError",
        status: 400,
        code: "SIMULATION_ERROR",
      },
      opts,
    );
    this.transaction = params.transaction;
  }
}

export class SimulationError extends Error {
  public readonly simulationId: string;
  public readonly simulationUrl: string;

  constructor(
    params: {
      message?: string;
      simulationId: string;
      simulationUrl: string;
    },
    opts?: ErrorOptions,
  ) {
    super(params.message, opts);
    this.name = "SimulationError";
    this.simulationId = params.simulationId;
    this.simulationUrl = params.simulationUrl;
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
  constructor(depositId: number, chainId: number, depositTxHash?: Hash) {
    super(
      `Unable to find fill log on chain ${chainId} for deposit id #${depositId} ${depositTxHash ? `with depositTxHash ${depositTxHash}` : "."}`,
    );
    this.name = "Fill Log Not Found";
  }
}
