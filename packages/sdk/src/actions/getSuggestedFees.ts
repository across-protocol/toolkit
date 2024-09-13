import { Address } from "viem";
import { buildSearchParams, isOk, LoggerT } from "../utils";
import { Amount, Route } from "../types";
import { MAINNET_API_URL } from "../constants";

type SuggestedFeesQueryParams = Partial<Omit<Route, "originChainId">> &
  Pick<Route, "originChainId"> & {
    amount: Amount;
    recipient?: Address;
    message?: string;
    relayer?: Address;
    skipAmountLimit?: boolean;
    timestamp?: number;
    depositMethod?: string; // "depositV3" | "depositExclusive"
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
  const searchParams = buildSearchParams<SuggestedFeesQueryParams>({
    ...params,
    depositMethod: "depositExclusive",
  });

  const url = `${apiUrl}/suggested-fees?${searchParams}`;

  logger?.debug(
    "Fetching suggested fees for params:",
    {
      ...params,
      depositMethod: "depositExclusive",
    },
    `URL: ${url}`,
  );

  const res = await fetch(url);

  if (!isOk(res)) {
    logger?.error(`Failed to fetch suggested fees`);
    throw new Error(
      `Failed to fetch suggested fees: ${res.status}, ${await res.text()}`,
    );
  }

  const data = (await res.json()) as SuggestedFeesResponse;

  logger?.debug("Suggested Fees Data", data);

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
