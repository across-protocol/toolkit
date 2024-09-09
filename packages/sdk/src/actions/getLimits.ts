import { Address } from "viem";
import { buildSearchParams, fetchAcross } from "../utils";
import assert from "assert";

export type GetLimitsParams = {
  destinationChainId: number;
  inputToken: Address;
  outputToken: Address;
  originChainId: number;
  apiUrl: string;
};

//  might not be necessary if this is part of suggested fees response???
export async function getLimits(params: GetLimitsParams) {
  const searchParams = buildSearchParams(params);
  const limits = await fetchAcross(`${params.apiUrl}/limits?${searchParams}`);
  assert(limits, `limits failed with params: \n${JSON.stringify(params)}"`);
  return (await limits.json()) as LimitsResponse;
}

export type LimitsResponse = {
  minDeposit: string;
  maxDeposit: string;
  maxDepositInstant: string;
  maxDepositShortDelay: string;
  recommendedDepositInstant: string;
};
