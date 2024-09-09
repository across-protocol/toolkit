import { Address } from "viem";
import { buildSearchParams, fetchAcross } from "../utils";
import { Amount, Route } from "../types";

export type GetSuggestedFeesParams = Route & {
  amount: Amount;
  apiUrl: string;
  recipient?: Address;
  message?: string;
};

export async function getSuggestedFees(params: GetSuggestedFeesParams) {
  const searchParams = buildSearchParams({
    ...params,
    depositMethod: "depositExclusive",
  });
  const res = await fetchAcross(
    `${params.apiUrl}/suggested-fees?${searchParams}`,
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch suggested fees: ${res.status}, ${await res.text()}`,
    );
  }

  const data = (await res.json()) as SuggestedFeesResponse;

  const outputAmount = BigInt(params.amount) - BigInt(data.totalRelayFee.total);
  return {
    // @todo: more data transformations for easier consumptions
    ...data,
    outputAmount,
  };
}

export type SuggestedFeesResponse = {
  estimatedFillTimeSec: number;
  capitalFeePct: string;
  capitalFeeTotal: string;
  relayGasFeePct: string;
  relayGasFeeTotal: string;
  relayFeePct: string;
  relayFeeTotal: string;
  lpFeePct: string;
  timestamp: string;
  isAmountTooLow: boolean;
  quoteBlock: string;
  exclusiveRelayer: string;
  exclusivityDeadline: number;
  spokePoolAddress: Address;
  totalRelayFee: {
    pct: string;
    total: string;
  };
  relayerCapitalFee: {
    pct: string;
    total: string;
  };
  relayerGasFee: {
    pct: string;
    total: string;
  };
  lpFee: {
    pct: string;
    total: string;
  };
  limits: {
    minDeposit: string;
    maxDeposit: string;
    maxDepositInstant: string;
    maxDepositShortDelay: string;
    recommendedDepositInstant: string;
  };
};
