import { MAINNET_API_URL } from "../constants";
import { TokenInfo } from "../types";
import { LoggerT, fetchAcrossApi } from ".";
import { Address } from "viem";

export type ChainsQueryParams = Partial<{
  inputTokenSymbol: string;
  outputTokenSymbol: string;
  chainId: number | number[];
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
  const data = await fetchAcrossApi<ChainsQueryResponse>(
    `${apiUrl}/chains`,
    params,
    logger,
  );
  return data;
}

export type AcrossChain = {
  chainId: number;
  name: string;
  publicRpcUrl: string;
  explorerUrl: string;
  logoUrl: string;
  spokePool: Address;
  inputTokens: TokenInfo[];
  outputTokens: TokenInfo[];
};

export type ChainsQueryResponse = AcrossChain[];
