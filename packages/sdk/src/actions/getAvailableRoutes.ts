import { Address } from "viem";
import { buildSearchParams, LoggerT } from "../utils";
import { Route } from "../types";
import { MAINNET_API_URL } from "../constants";

export type GetAvailableRoutesParams = Partial<{
  originToken: Address;
  destinationToken: Address;
  destinationChainId: number;
  originChainId: number;
  apiUrl: string;
  logger: LoggerT;
}>;

export type AvailableRoutesResponse = Route[];

export async function getAvailableRoutes({
  apiUrl = MAINNET_API_URL,
  logger,
  ...params
}: GetAvailableRoutesParams): Promise<AvailableRoutesResponse> {
  const searchParams = params ? buildSearchParams(params) : "";

  const url = `${apiUrl}/available-routes?${searchParams}`;

  logger?.debug("Fetching available routes for params:", params, `URL: ${url}`);

  const res = await fetch(url);

  const data = (await res.json()) as AvailableRoutesApiResponse;

  logger?.debug("Routes data: ", data);

  // Transform to internal type consistency
  return data.map((route) => ({
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
