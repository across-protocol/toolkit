import { Address, Hex } from "viem";
import { fetchAcrossApi, LoggerT } from "../utils/index.js";
import { MAINNET_API_URL } from "../constants/index.js";
import { Amount } from "../types/index.js";

type LimitsQueryParams = {
  originChainId: number;
  destinationChainId: number;
  inputToken: Address;
  outputToken: Address;
  /**
   * [Optional] The input amount of the deposit. Defaults to a small simulation amount.
   * Should in most cases be omitted but is required when using Across+, i.e. when
   * a cross-chain message is attached to the deposit.
   */
  amount?: Amount;
  /**
   * [Optional] The cross-chain message of the deposit when using Across+ that should
   * be executed on the destination chain. Note that `amount` is required when using
   * Across+.
   */
  message?: Hex;
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
};

/**
 * Params for {@link getLimits}.
 */
export type GetLimitsParams = LimitsQueryParams & {
  /**
   * [Optional] The Across API URL to use. Defaults to the mainnet API URL.
   */
  apiUrl?: string;
  /**
   * [Optional] The logger to use.
   */
  logger?: LoggerT;
};

export type GetLimitsReturnType = {
  /**
   * The minimum deposit amount for the route.
   */
  minDeposit: bigint;
  /**
   * The maximum deposit amount for the route.
   */
  maxDeposit: bigint;
  /**
   * The maximum deposit amount for the route that can be executed instantly.
   */
  maxDepositInstant: bigint;
};

/**
 * Returns the deposit limits for a given route.
 * @param params - See {@link GetLimitsParams}.
 * @returns See {@link GetLimitsReturnType}.
 */
export async function getLimits({
  apiUrl = MAINNET_API_URL,
  logger,
  ...params
}: GetLimitsParams): Promise<GetLimitsReturnType> {
  const limits = await fetchAcrossApi<{
    minDeposit: string;
    maxDeposit: string;
    maxDepositInstant: string;
  }>(`${apiUrl}/limits`, params, logger);
  return {
    minDeposit: BigInt(limits.minDeposit),
    maxDeposit: BigInt(limits.maxDeposit),
    maxDepositInstant: BigInt(limits.maxDepositInstant),
  };
}
