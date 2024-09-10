import { Address } from "viem";
import { buildSearchParams, fetchAcross } from "../utils";
import { Route } from "../types";
import { MAINNET_API_URL } from "../constants";

export type GetAvailableRoutesParams = Partial<{
  originToken: Address;
  destinationToken: Address;
  destinationChainId: number;
  originChainId: number;
  apiUrl: string;
}>;

export type AvailableRoutesResponse = Route[];

export async function getAvailableRoutes({
  apiUrl = MAINNET_API_URL,
  ...params
}: GetAvailableRoutesParams): Promise<AvailableRoutesResponse> {
  const searchParams = params ? buildSearchParams(params) : "";

  const res = await fetchAcross(`${apiUrl}/available-routes?${searchParams}`);

  const data = (await res.json()) as AvailableRoutesApiResponse;

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
