import { Address, Hex } from "viem";
import {
  HttpError,
  AcrossApiError,
  AcrossErrorCodeType,
  AcrossApiSimulationError,
  IndexerError,
} from "../errors";
import { LoggerT } from "./logger";

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

    if (!value) {
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

function makeFetcher(
  name: string,
  apiErrorHandler?: (response: Response, data: any, url: string) => void,
) {
  return async <ResBody, ReqParams = {}>(
    apiUrl: string,
    params: ReqParams,
    logger?: LoggerT,
  ): Promise<ResBody> => {
    const searchParams = buildSearchParams(
      params as Record<string, ParamBaseValue | Array<ParamBaseValue>>,
    );
    const url = `${apiUrl}?${searchParams}`;

    logger?.debug(`Fetching ${name}...`, url);

    const res = await fetch(url);

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

export const fetchAcrossApi = makeFetcher("Across API", (res, data, url) => {
  // Check for Across API errors
  if (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "AcrossApiError"
  ) {
    const acrossApiError = data as unknown as {
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
        message: acrossApiError.message,
        url,
        transaction: acrossApiError.transaction,
      });
    }

    throw new AcrossApiError({
      status: res.status,
      message: acrossApiError.message,
      url,
      code: acrossApiError.code,
    });
  }
});

export const fetchIndexerApi = makeFetcher("Indexer API", (res, data, url) => {
  if (typeof data === "object" && data !== null && "error" in data) {
    throw new IndexerError(url, data?.message, data?.error);
  }
});
