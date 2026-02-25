import { LoggerT, fetchAcrossApi, fetchAcrossApiPost } from "../utils/index.js";
import { MAINNET_API_URL } from "../constants/index.js";
import {
  BaseSwapQueryParams,
  SwapApprovalApiResponse,
  swapApprovalResponseSchema,
} from "../api/swap-approval.js";
import { Amount, Action } from "../types/index.js";
import { Address } from "viem";

/**
 * Params for {@link getSwapQuote}.
 */
export type GetSwapQuoteParams = Omit<
  BaseSwapQueryParams,
  | "amount"
  | "inputToken"
  | "outputToken"
  | "originChainId"
  | "destinationChainId"
  | "skipOriginTxEstimation"
  | "slippage"
  | "appFee"
> & {
  amount: Amount;
  route: {
    originChainId: number;
    inputToken: Address;
    destinationChainId: number;
    outputToken: Address;
  };
  skipOriginTxEstimation?: boolean;
  slippage?: number;
  appFee?: number;
  actions?: Action[];
  /**
   * [Optional] Integrator identifier to be forwarded to the swap API so it can
   * append the integrator tag to the final deposit calldata when applicable.
   */
  integratorId?: string;
  /**
   * [Optional] The logger to use.
   */
  logger?: LoggerT;
  /**
   * [Optional] The Across API URL to use. Defaults to the mainnet API URL.
   */
  apiUrl?: string;
  /**
   * [Optional] An API key for accessing authenticated features. Will be sent
   * as a Bearer token in the Authorization header.
   */
  apiKey?: string;
};

/**
 * Get a swap quote for a given set of parameters.
 * @param params - See {@link GetSwapQuoteParams}.
 * @returns See {@link SwapApprovalApiResponse}.
 * @public
 */
export async function getSwapQuote(
  params: GetSwapQuoteParams,
): Promise<SwapApprovalApiResponse> {
  const { logger, apiUrl = MAINNET_API_URL, apiKey, ...otherParams } = params;

  logger?.debug("Getting swap quote with params:", otherParams);

  const { route, actions, ...rest } = otherParams;
  const routeAsQueryParams = {
    originChainId: route.originChainId,
    inputToken: route.inputToken,
    destinationChainId: route.destinationChainId,
    outputToken: route.outputToken,
  };
  const queryParams = { ...rest, ...routeAsQueryParams };

  let data: SwapApprovalApiResponse;
  const url = `${apiUrl}/swap/approval`;
  if (actions && actions.length > 0) {
    data = await fetchAcrossApiPost<SwapApprovalApiResponse>(
      url,
      queryParams,
      logger,
      {
        actions: actions.map((action) => ({
          ...action,
          value: action.value?.toString() ?? "0",
        })),
      },
      apiKey,
    );
  } else {
    data = await fetchAcrossApi<SwapApprovalApiResponse>(
      url,
      queryParams,
      logger,
      undefined,
      apiKey,
    );
  }

  // Validate the response against our schema
  const validated = swapApprovalResponseSchema.safeParse(data);
  if (!validated.success) {
    logger?.error(
      `Invalid swap approval response: ${JSON.stringify(data)}. Error: ${validated.error.message}.`,
    );
    throw new Error(
      `Invalid swap approval response. Error: ${validated.error.message}. Please contact support for assistance.`,
    );
  }

  return validated.data;
}
