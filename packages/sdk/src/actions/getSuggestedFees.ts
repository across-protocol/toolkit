import { Address } from "viem";
import { LoggerT, fetchAcrossApi } from "../utils";
import { Amount, Route } from "../types";
import { MAINNET_API_URL } from "../constants";

type SuggestedFeesQueryParams = Partial<
  Omit<Route, "inputTokenSymbol" | "outputTokenSymbol" | "isNative">
> &
  Pick<
    Route,
    | "originChainId"
    | "destinationChainId"
    | "inputTokenSymbol"
    | "outputTokenSymbol"
  > & {
    amount: Amount;
    recipient?: Address;
    message?: string;
    relayer?: Address;
    skipAmountLimit?: boolean;
    timestamp?: number;
    depositMethod?: "depositV3" | "depositExclusive";
  };

export type GetSuggestedFeesParams = SuggestedFeesQueryParams & {
  apiUrl?: string;
  logger?: LoggerT;
};

export async function getSuggestedFees({
  apiUrl = MAINNET_API_URL,
  logger,
  ...params
}: GetSuggestedFeesParams) {
  const data = await fetchAcrossApi<SuggestedFeesResponse>(
    `${apiUrl}/suggested-fees`,
    {
      depositMethod: "depositExclusive",
      ...params,
    },
    logger,
  );

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
  destinationSpokePoolAddress: Address;
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
