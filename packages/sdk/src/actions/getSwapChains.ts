import { MAINNET_API_URL } from "../constants/index.js";
import { LoggerT, fetchAcrossApi } from "../utils/index.js";

export type SwapChainsQueryParams = Partial<{
  // Add any future query parameters here
}>;

export type GetSwapChainsParams = SwapChainsQueryParams & {
  logger?: LoggerT;
  apiUrl?: string;
};

export async function getSwapChains({
  logger,
  apiUrl = MAINNET_API_URL,
  ...params
}: GetSwapChainsParams) {
  const data = await fetchAcrossApi<GetSwapChainsReturnType>(
    `${apiUrl}/swap/chains`,
    params,
    logger,
  );
  return data;
}

export type SwapChain = {
  chainId: number;
  name: string;
  publicRpcUrl: string;
  explorerUrl: string;
  logoUrl: string;
};

export type GetSwapChainsReturnType = SwapChain[];