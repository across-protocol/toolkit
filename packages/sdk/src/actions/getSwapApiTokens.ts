import { Address } from "viem";
import { LoggerT, fetchAcrossApi } from "../utils/index.js";
import { MAINNET_API_URL } from "../constants/index.js";

export type SwapApiToken = {
  chainId: number;
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl: string;
  priceUsd: string | null;
};

type SwapApiTokensResponse = SwapApiToken[];

/**
 * Params for {@link getSwapApiTokens}.
 */
export type GetSwapApiTokensParams = Partial<{
  /**
   * [Optional] Filter tokens by chain ID. If provided, only tokens from this chain will be returned.
   */
  chainId: number;
  /**
   * [Optional] The Across API URL to use. Defaults to the mainnet API URL.
   */
  apiUrl: string;
  /**
   * [Optional] The logger to use.
   */
  logger: LoggerT;
}>;

export type GetSwapApiTokensReturnType = SwapApiToken[];

/**
 * Get available tokens across all supported chains or filtered by chain ID.
 * @param params - See {@link GetSwapApiTokensParams}.
 * @returns See {@link GetSwapApiTokensReturnType}.
 * @public
 */
export async function getSwapApiTokens({
  chainId,
  apiUrl = MAINNET_API_URL,
  logger,
}: GetSwapApiTokensParams = {}): Promise<GetSwapApiTokensReturnType> {
  const tokens = await fetchAcrossApi<SwapApiTokensResponse>(
    `${apiUrl}/swap/tokens`,
    {},
    logger,
  );

  // Apply client-side chainId filtering if specified
  if (chainId) {
    return tokens.filter((token) => token.chainId === chainId);
  }

  return tokens;
}