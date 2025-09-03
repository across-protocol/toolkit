import { Address, Hex } from "viem";
import {
  HttpError,
  AcrossApiError,
  AcrossErrorCodeType,
  AcrossApiSimulationError,
  IndexerError,
} from "../errors/index.js";
import { LoggerT } from "./logger.js";

type ParamBaseValue = number | bigint | string | boolean;

/**
 * Builds a URL search string from an object of query parameters.
 *
 * @param params - An object where keys are query parameter names and values are either a string or an array of strings representing the parameter values.
 *
 * @returns queryString - A properly formatted query string for use in URLs, (without the leading '?').
 */
export function buildSearchParams<
  T extends Record<string, ParamBaseValue | Array<ParamBaseValue>>,
>(params: T): string {
  const searchParams = new URLSearchParams();
  for (const key in params) {
    const value = params[key];

    if (!isDefined(value)) {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((val) => searchParams.append(key, String(val)));
    } else {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
}

export function isOk(res: Response) {
  // accept cached responses
  if ((res.status >= 200 && res.status < 300) || res.status === 304) {
    return true;
  }
  return false;
}

export function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null ? true : false;
}

function makeFetcher(
  name: string,
  apiErrorHandler?: (
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    url: string,
  ) => void,
  method?: "GET" | "POST",
) {
  return async <ResBody>(
    apiUrl: string,
    params: Record<string, ParamBaseValue | Array<ParamBaseValue>>,
    logger?: LoggerT,
    body?: Record<string, unknown>,
  ): Promise<ResBody> => {
    const searchParams = buildSearchParams(params);
    const url = `${apiUrl}?${searchParams}`;

    logger?.debug(`Fetching ${name}...`, url);

    const res = await fetch(url, {
      method,
      body:
        method === "POST"
          ? JSON.stringify(body, (_, value) =>
              typeof value === "bigint" ? value.toString() : value,
            )
          : undefined,
      headers:
        method === "POST"
          ? {
              "Content-Type": "application/json",
            }
          : undefined,
    });

    // Try to parse the response as JSON. If it fails, parse it as text.
    let data: ResBody;
    try {
      data = (await res.json()) as ResBody;
    } catch (e) {
      data = (await res.text()) as ResBody;
    }

    // If the response is OK, return the data
    if (isOk(res)) {
      logger?.debug("OK response", data);
      return data;
    }

    logger?.debug("Error response", {
      status: res.status,
    });

    if (apiErrorHandler) {
      apiErrorHandler(res, data, url);
    }

    throw new HttpError({
      status: res.status,
      message: typeof data === "string" ? data : JSON.stringify(data),
      url,
    });
  };
}

export const fetchAcrossApi = makeFetcher("Across API", (res, data, url) =>
  handleAcrossApiError(res, data, url),
);

export const fetchAcrossApiPost = makeFetcher(
  "Across API",
  (res, data, url) => handleAcrossApiError(res, data, url),
  "POST",
);

function handleAcrossApiError(res: Response, data: unknown, url: string) {
  // Check for Across API errors
  if (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "AcrossApiError"
  ) {
    const acrossApiError = data as unknown as {
      requestId: string;
      message: string;
      code: AcrossErrorCodeType;
      transaction: {
        from: Address;
        to: Address;
        data: Hex;
      };
    };

    if (acrossApiError.code === "SIMULATION_ERROR") {
      throw new AcrossApiSimulationError({
        requestId: acrossApiError.requestId,
        message: acrossApiError.message,
        url,
        transaction: acrossApiError.transaction,
      });
    }

    throw new AcrossApiError({
      requestId: acrossApiError.requestId,
      status: res.status,
      message: acrossApiError.message,
      url,
      code: acrossApiError.code,
    });
  }
}

export const fetchIndexerApi = makeFetcher("Indexer API", (res, data, url) => {
  if (typeof data === "object" && data !== null && "error" in data) {
    throw new IndexerError(url, data?.message, data?.error);
  }
});
