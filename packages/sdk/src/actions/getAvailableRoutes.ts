import { Address } from "viem";
import { LoggerT, fetchAcrossApi } from "../utils";
import { Route } from "../types";
import { MAINNET_API_URL } from "../constants";

export type RoutesQueryParams = Partial<{
  originToken: Address;
  destinationToken: Address;
  destinationChainId: number;
  originChainId: number;
}>;

export type GetAvailableRoutesParams = RoutesQueryParams &
  Partial<{
    apiUrl: string;
    logger: LoggerT;
  }>;

export type AvailableRoutesResponse = Route[];

export async function getAvailableRoutes({
  apiUrl = MAINNET_API_URL,
  logger,
  ...params
}: GetAvailableRoutesParams): Promise<AvailableRoutesResponse> {
  const routes = await fetchAcrossApi<AvailableRoutesApiResponse>(
    `${apiUrl}/available-routes`,
    params,
    logger,
  );

  // Transform to internal type consistency
  return routes.map((route) => ({
    isNative: route.isNative,
    originChainId: route.originChainId,
    inputToken: route.originToken as Address,
    destinationChainId: route.destinationChainId,
    outputToken: route.destinationToken as Address,
    inputTokenSymbol: route.originTokenSymbol,
    outputTokenSymbol: route.destinationTokenSymbol,
  }));
}

type AvailableRoutesApiResponse = {
  originChainId: number;
  originToken: string;
  destinationChainId: number;
  destinationToken: string;
  originTokenSymbol: string;
  destinationTokenSymbol: string;
  isNative: boolean;
}[];
