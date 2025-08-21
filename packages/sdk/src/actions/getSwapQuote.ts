import { LoggerT, fetchAcrossApi } from "../utils/index.js";
import { MAINNET_API_URL } from "../constants/index.js";
import { 
  BaseSwapQueryParams, 
  SwapApprovalApiResponse,
  swapApprovalResponseSchema 
} from "../api/swap-approval.js";

/**
 * Params for {@link getSwapQuote}.
 */
export type GetSwapQuoteParams = BaseSwapQueryParams & {
  /**
   * [Optional] The logger to use.
   */
  logger?: LoggerT;
  /**
   * [Optional] The Across API URL to use. Defaults to the mainnet API URL.
   */
  apiUrl?: string;
};

/**
 * Get a swap quote for a given set of parameters.
 * @param params - See {@link GetSwapQuoteParams}.
 * @returns See {@link SwapApprovalApiResponse}.
 * @public
 */
export async function getSwapQuote(params: GetSwapQuoteParams): Promise<SwapApprovalApiResponse> {
  const { logger, apiUrl = MAINNET_API_URL, ...queryParams } = params;

  logger?.debug("Getting swap quote with params:", queryParams);

  const data = await fetchAcrossApi<SwapApprovalApiResponse>(
    `${apiUrl}/swap/approval`,
    queryParams,
    logger,
  );

  // Validate the response against our schema
  const validated = swapApprovalResponseSchema.safeParse(data);
  if (!validated.success) {
    logger?.error(`Invalid swap approval response: ${JSON.stringify(data)}. Error: ${validated.error.message}.`);
    throw new Error(`Invalid swap approval response. Error: ${validated.error.message}. Please contact support for assistance.`);
  }

  return validated.data;
}
