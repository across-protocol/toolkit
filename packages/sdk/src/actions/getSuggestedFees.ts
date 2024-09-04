import { getClient } from "../client";
import { buildSearchParams, fetchAcross } from "../utils";

export type SuggestedFeesParams = {
  token: string;
  originChainId: number;
  destinationChainId: number;
  amount: string; // bignumber string
};

export async function getSuggestedFees(params: SuggestedFeesParams) {
  const client = getClient();
  try {
    const searchParams = buildSearchParams(params);
    const res = await fetchAcross(
      `${client.apiUrl}/suggested-fees?${searchParams}`
    );
    return (await res.json()) as SuggestedFeesResponse;
  } catch (error) {
    client.log.error(error);
  }
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
  spokePoolAddress: string;
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
