import { Address } from "viem";
import { buildSearchParams, isOk, LoggerT } from "../utils";
import { MAINNET_API_URL } from "../constants";
import { HttpError } from "../errors";

export type GetLimitsParams = {
  destinationChainId: number;
  inputToken: Address;
  outputToken: Address;
  originChainId: number;
  apiUrl?: string;
  logger?: LoggerT;
};

//  might not be necessary if this is part of suggested fees response???
export async function getLimits({
  apiUrl = MAINNET_API_URL,
  logger,
  ...params
}: GetLimitsParams) {
  const searchParams = buildSearchParams(params);
  const url = `${apiUrl}/limits?${searchParams}`;

  logger?.debug("Fetching Limits for params:", params, `URL: ${url}`);

  const res = await fetch(url);

  if (!isOk(res)) {
    logger?.error("Unable to fetch limits:", `URL: ${url}`);
    throw new HttpError(res.status, url, await res.text());
  }

  return (await res.json()) as LimitsResponse;
}

export type LimitsResponse = {
  minDeposit: string;
  maxDeposit: string;
  maxDepositInstant: string;
  maxDepositShortDelay: string;
  recommendedDepositInstant: string;
};
