import { MAINNET_API_URL } from "../constants";
import { HttpError } from "../errors";
import { TokenInfo } from "../types";
import { buildSearchParams, isOk, LoggerT } from ".";

export type ChainsQueryParams = Partial<{
  inputTokenSymbol: string;
  outputTokenSymbol: string;
  chainId: number; // origin chainId
  omitTokens: boolean;
}>;

export type GetSupportedChainsParams = ChainsQueryParams & {
  logger?: LoggerT;
  apiUrl?: string;
};

export async function getSupportedChains({
  logger,
  apiUrl = MAINNET_API_URL,
  ...params
}: GetSupportedChainsParams) {
  const url = `${apiUrl}/chains?${buildSearchParams<ChainsQueryParams>(params)}`;

  logger?.debug(`Fetching supported chains with endpoint ${url}`);

  const res = await fetch(url);

  if (!isOk(res)) {
    throw new HttpError(res.status, url, await res.text());
  }

  const data = (await res.json()) as ChainsQueryResponse;

  logger?.debug("SUPPORTED CHAINS", data);

  return data;
}

export type ChainsQueryResponse = {
  chainId: number;
  name: string;
  publicRpcUrl: string;
  explorerUrl: string;
  logoUrl: string;
  spokePool: string;
  inputTokens: TokenInfo[];
  outputTokens: TokenInfo[];
}[];
