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
}[];

export async function getAvailableRoutes(params?: AvailableRoutesParams) {
  const client = getClient();
  try {
    const searchParams = params ? buildSearchParams(params) : "";

    const res = await fetchAcross(
      `${client.apiUrl}/available-routes?${searchParams}`
    );
    return (await res.json()) as AvailableRoutesResponse;
  } catch (error) {
    client.log.error(error);
  }
}
