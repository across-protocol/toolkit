import { Address } from "viem";
import { LoggerT, fetchAcrossApi } from "../utils";
import { Route } from "../types";
import { MAINNET_API_URL } from "../constants";

export type RoutesQueryParams = Partial<{
  /**
   * The origin token address. If set only routes with this token as origin are returned.
   */
  originToken: Address;
  /**
   * The destination token address. If set only routes with this token as destination
   * are returned.
   */
  destinationToken: Address;
  /**
   * The destination chain id. If set only routes with this chain id as destination
   * are returned.
   */
  destinationChainId: number;
  /**
   * The origin chain id. If set only routes with this chain id as origin are returned.
   */
  originChainId: number;

  originTokenSymbol: string;
  destinationTokenSymbol: string;
}>;

/**
 * Params for {@link getAvailableRoutes}.
 */
export type GetAvailableRoutesParams = RoutesQueryParams &
  Partial<{
    apiUrl: string;
    logger: LoggerT;
  }>;

export type GetAvailableRoutesReturnType = Route[];

/**
 * Get the available routes for a given set of parameters.
 * @param params - See {@link GetAvailableRoutesParams}.
 * @returns See {@link GetAvailableRoutesReturnType}.
 * @public
 */
export async function getAvailableRoutes({
  apiUrl = MAINNET_API_URL,
  logger,
  ...params
}: GetAvailableRoutesParams): Promise<GetAvailableRoutesReturnType> {
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
