import { Address } from "viem";
import { LoggerT, fetchAcrossApi } from "../utils/index.js";
import { Amount } from "../types/index.js";
import { MAINNET_API_URL } from "../constants/index.js";

export type SuggestedFeesQueryParams = {
  originChainId: number;
  destinationChainId: number;
  /**
   * The input token address on origin chain.
   */
  inputToken: Address;
  /**
   * The output token address on destination chain.
   */
  outputToken: Address;
  /**
   * The amount of input tokens to deposit.
   */
  amount: Amount;
  /**
   * [Optional] Whether the input token is a native token on the origin chain.
   * Defaults to `false`. Should be set to `true` for ETH only if origin chain is not
   * Polygon.
   */
  isNative?: boolean;
  /**
   * [Optional] The cross-chain message of the deposit when using Across+ that should
   * be executed on the destination chain. Note that `amount` is required when using
   * Across+.
   */
  message?: string;
  /**
   * [Optional] The recipient address. Should in most cases be omitted but is required
   * when using Across+, i.e. when a cross-chain message is attached to the deposit.
   * This needs to be the address of the handler contract on the destination chain.
   */
  recipient?: Address;
  /**
   * [Optional] The relayer address to simulate fill with. Defaults to the Across relayer.
   */
  relayer?: Address;
  /**
   * [Optional] Whether to skip the amount limit check. Defaults to `false`.
   */
  skipAmountLimit?: boolean;
};

/**
 * Params for {@link getSuggestedFees}.
 */
export type GetSuggestedFeesParams = SuggestedFeesQueryParams & {
  /**
   * [Optional] The Across API URL to use. Defaults to the mainnet API URL.
   */
  apiUrl?: string;
  /**
   * [Optional] The logger to use.
   */
  logger?: LoggerT;
};

export type GetSuggestedFeesReturnType = {
  /**
   * The estimated fill time in seconds.
   */
  estimatedFillTimeSec: number;
  /**
   * The timestamp of the quote.
   */
  timestamp: number;
  /**
   * The timestamp of deadline to fill the quote.
   */
  fillDeadline: number;
  /**
   * Whether the deposit amount is too low.
   */
  isAmountTooLow: boolean;
  /**
   * The quote block.
   */
  quoteBlock: number;
  /**
   * The exclusive relayer address. Will be the zero address if no exclusivity is
   * determined.
   */
  exclusiveRelayer: string;
  /**
   * The exclusivity deadline. Will be 0 if no exclusivity is determined.
   */
  exclusivityDeadline: number;
  /**
   * The spoke pool address on the origin chain.
   */
  spokePoolAddress: Address;
  /**
   * The spoke pool address on the destination chain.
   */
  destinationSpokePoolAddress: Address;
  /**
   * The output amount that will be received after deducting the fees.
   */
  outputAmount: bigint;
  /**
   * The total relay fee, i.e. the sum of the relayer capital fee, the relayer gas fee,
   * and the lp fee.
   */
  totalRelayFee: {
    pct: bigint;
    total: bigint;
  };
  /**
   * The relayer capital fee.
   */
  relayerCapitalFee: {
    pct: bigint;
    total: bigint;
  };
  /**
   * The relayer gas fee.
   */
  relayerGasFee: {
    pct: bigint;
    total: bigint;
  };
  /**
   * The lp fee.
   */
  lpFee: {
    pct: bigint;
    total: bigint;
  };
  /**
   * The deposit limits.
   */
  limits: {
    minDeposit: bigint;
    maxDeposit: bigint;
    maxDepositInstant: bigint;
  };
};

/**
 * Returns the suggested fees for a given deposit route.
 * @param params - See {@link GetSuggestedFeesParams}.
 * @returns See {@link GetSuggestedFeesReturnType}.
 * @public
 */
export async function getSuggestedFees({
  apiUrl = MAINNET_API_URL,
  logger,
  ...params
}: GetSuggestedFeesParams) {
  const data = await fetchAcrossApi<SuggestedFeesResponse>(
    `${apiUrl}/suggested-fees`,
    params,
    logger,
  );

  return {
    estimatedFillTimeSec: data.estimatedFillTimeSec,
    outputAmount: BigInt(params.amount) - BigInt(data.totalRelayFee.total),
    timestamp: Number(data.timestamp),
    fillDeadline: Number(data.fillDeadline),
    isAmountTooLow: data.isAmountTooLow,
    quoteBlock: Number(data.quoteBlock),
    exclusiveRelayer: data.exclusiveRelayer as Address,
    exclusivityDeadline: data.exclusivityDeadline,
    spokePoolAddress: data.spokePoolAddress as Address,
    destinationSpokePoolAddress: data.destinationSpokePoolAddress as Address,
    totalRelayFee: {
      pct: BigInt(data.totalRelayFee.pct),
      total: BigInt(data.totalRelayFee.total),
    },
    relayerCapitalFee: {
      pct: BigInt(data.relayerCapitalFee.pct),
      total: BigInt(data.relayerCapitalFee.total),
    },
    relayerGasFee: {
      pct: BigInt(data.relayerGasFee.pct),
      total: BigInt(data.relayerGasFee.total),
    },
    lpFee: {
      pct: BigInt(data.lpFee.pct),
      total: BigInt(data.lpFee.total),
    },
    limits: {
      minDeposit: BigInt(data.limits.minDeposit),
      maxDeposit: BigInt(data.limits.maxDeposit),
      maxDepositInstant: BigInt(data.limits.maxDepositInstant),
    },
  };
}

export type SuggestedFeesResponse = {
  estimatedFillTimeSec: number;
  fillDeadline: string;
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
