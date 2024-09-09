import { Address } from "viem";
import { buildSearchParams, fetchAcross } from "../utils";
import { getClient } from "../client";

export type AvailableRoutesParams = Partial<{
  originToken: Address;
  destinationToken: Address;
  destinationChainId: number;
  originChainId: number;
}>;

export type AvailableRoutesResponse = {
  originChainId: number;
  originToken: string;
  destinationChainId: number;
  destinationToken: string;
  originTokenSymbol: string;
  destinationTokenSymbol: string;
  isNative: boolean;
}[];

export async function getAvailableRoutes(params?: AvailableRoutesParams) {
  const client = getClient();

  const searchParams = params ? buildSearchParams(params) : "";

  const res = await fetchAcross(
    `${client.apiUrl}/available-routes?${searchParams}`,
  );
  const data = (await res.json()) as AvailableRoutesResponse;

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
