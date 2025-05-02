import { Address } from "viem";
import { LoggerT, fetchAcrossApi } from "../utils/index.js";
import { Amount, BoolString } from "../types/index.js";
import { MAINNET_API_URL } from "../constants/index.js";
import { SuggestedFeesApiResponse } from "../api/suggested-fees.js";

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
  /**
   * [Optional] Caller specifies whether to includes routes where input token
   * and output token do not have the same decimals
   */
  allowUnmatchedDecimals?: BoolString;
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
  capitalFeePct: number;
  capitalFeeTotal: bigint;
  relayGasFeePct: number;
  relayGasFeeTotal: bigint;
  relayFeePct: number;
  relayFeeTotal: bigint;
  lpFeePct?: string;
  fillDeadline: number;
  /**
   * The estimated fill time in seconds.
   */
  estimatedFillTimeSec: number;
  /**
   * The timestamp of the quote.
   */
  timestamp: number;
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
    maxDepositShortDelay: bigint;
    recommendedDepositInstant: bigint;
  };
  inputToken: {
    address: Address;
    symbol: string;
    decimals: number;
    chainId: number;
  };
  outputToken: {
    address: Address;
    symbol: string;
    decimals: number;
    chainId: number;
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
  const data = await fetchAcrossApi<SuggestedFeesApiResponse>(
    `${apiUrl}/suggested-fees`,
    params,
    logger,
  );

  return parseSuggestedFees(data);
}

export function parseSuggestedFees(
  raw: SuggestedFeesApiResponse,
): GetSuggestedFeesReturnType {
  return {
    // ensure even unformatted values get passed through
    ...raw,
    outputAmount: BigInt(raw.outputAmount),
    estimatedFillTimeSec: raw.estimatedFillTimeSec,
    capitalFeePct: Number(raw.capitalFeePct),
    capitalFeeTotal: BigInt(raw.capitalFeeTotal),
    relayGasFeePct: Number(raw.relayGasFeePct),
    relayGasFeeTotal: BigInt(raw.relayGasFeeTotal),
    relayFeePct: Number(raw.relayFeePct),
    relayFeeTotal: BigInt(raw.relayFeeTotal),
    lpFeePct: raw.lpFeePct, // deprecated
    timestamp: Number(raw.timestamp),
    isAmountTooLow: raw.isAmountTooLow,
    quoteBlock: Number(raw.quoteBlock),
    exclusiveRelayer: raw.exclusiveRelayer as Address,
    exclusivityDeadline: raw.exclusivityDeadline,
    spokePoolAddress: raw.spokePoolAddress as Address,
    destinationSpokePoolAddress: raw.destinationSpokePoolAddress as Address,
    fillDeadline: Number(raw.fillDeadline),
    totalRelayFee: {
      pct: BigInt(raw.totalRelayFee.pct),
      total: BigInt(raw.totalRelayFee.total),
    },
    relayerCapitalFee: {
      pct: BigInt(raw.relayerCapitalFee.pct),
      total: BigInt(raw.relayerCapitalFee.total),
    },
    relayerGasFee: {
      pct: BigInt(raw.relayerGasFee.pct),
      total: BigInt(raw.relayerGasFee.total),
    },
    lpFee: {
      pct: BigInt(raw.lpFee.pct),
      total: BigInt(raw.lpFee.total),
    },
    limits: {
      minDeposit: BigInt(raw.limits.minDeposit),
      maxDeposit: BigInt(raw.limits.maxDeposit),
      maxDepositInstant: BigInt(raw.limits.maxDepositInstant),
      maxDepositShortDelay: BigInt(raw.limits.maxDepositShortDelay),
      recommendedDepositInstant: BigInt(raw.limits.recommendedDepositInstant),
    },
    inputToken: {
      address: raw.inputToken.address as Address,
      symbol: raw.inputToken.symbol,
      decimals: raw.inputToken.decimals,
      chainId: raw.inputToken.chainId,
    },
    outputToken: {
      address: raw.outputToken.address as Address,
      symbol: raw.outputToken.symbol,
      decimals: raw.outputToken.decimals,
      chainId: raw.outputToken.chainId,
    },
  };
}
