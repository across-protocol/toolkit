import { Address } from "viem";
import { fetchAcrossApi, LoggerT } from "../utils";
import { MAINNET_API_URL } from "../constants";

type LimitsQueryParams = {
  destinationChainId: number;
  inputToken: Address;
  outputToken: Address;
  originChainId: number;
};

export type GetLimitsParams = LimitsQueryParams & {
  apiUrl?: string;
  logger?: LoggerT;
};

//  might not be necessary if this is part of suggested fees response???
export async function getLimits({
  apiUrl = MAINNET_API_URL,
  logger,
  ...params
}: GetLimitsParams) {
  const limits = await fetchAcrossApi<LimitsResponse>(
    `${apiUrl}/limits`,
    params,
    logger,
  );
  return limits;
}

export type LimitsResponse = {
  minDeposit: string;
  maxDeposit: string;
  maxDepositInstant: string;
  maxDepositShortDelay: string;
  recommendedDepositInstant: string;
};
