import { Address } from "viem";
import { getClient } from "../client";
import { buildSearchParams, fetchAcross } from "../utils";

export type LimitsParams = {
  destinationChainId: number;
  inputToken: Address;
  outputToken: Address;
  originChainId: number;
};

//  might not be necessary if this is part of suggested fees response???
export async function getLimits(params: LimitsParams) {
  const client = getClient();
  try {
    const searchParams = buildSearchParams(params);
    const limits = await fetchAcross(`${client.apiUrl}/limits?${searchParams}`);
    if (!limits) {
      client.log.error("limits failed with params: \n", params);
    }
    return (await limits.json()) as LimitsResponse;
  } catch (error) {
    client.log.error(error);
  }
}

export type LimitsResponse = {
  minDeposit: string;
  maxDeposit: string;
  maxDepositInstant: string;
  maxDepositShortDelay: string;
  recommendedDepositInstant: string;
};
