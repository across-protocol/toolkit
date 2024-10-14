import { Address, Hex } from "viem";
import { Amount, CrossChainAction } from "../types";
import {
  getMultiCallHandlerAddress,
  buildMulticallHandlerMessage,
  LoggerT,
} from "../utils";
import { getSuggestedFees } from "./getSuggestedFees";

/**
 * Params for {@link getQuote}.
 */
export type GetQuoteParams = {
  route: {
    /**
     * The origin chain id for deposit route.
     */
    originChainId: number;
    /**
     * The destination chain id for deposit route.
     */
    destinationChainId: number;
    /**
     * The input token for deposit route.
     */
    inputToken: Address;
    /**
     * The output token for deposit route.
     */
    outputToken: Address;
    /**
     * Whether the input token is a native token on the origin chain.
     * Defaults to `false`. Should be set to `true` for ETH only if origin chain is not
     * Polygon.
     */
    isNative?: boolean;
  };
  /**
   * The input amount for deposit route.
   */
  inputAmount: Amount;
  /**
   * [Optional] The logger to use.
   */
  logger?: LoggerT;
  /**
   * [Optional] The Across API URL to use. Defaults to the mainnet API URL.
   */
  apiUrl?: string;
  /**
   * [Optional] The recipient address. Should in most cases be omitted but is required
   * when using Across+, i.e. when a cross-chain message is attached to the deposit.
   * This needs to be the address of the handler contract on the destination chain.
   */
  recipient?: Address;
  /**
   * A cross-chain message to be executed on the destination chain. Can either
   * be a pre-constructed hex string or an object containing the actions to be
   * executed and the fallback recipient.
   */
  crossChainMessage?:
    | {
        actions: CrossChainAction[];
        fallbackRecipient: Address;
      }
    | Hex;
};

export type Quote = {
  deposit: {
    inputAmount: bigint;
    outputAmount: bigint;
    recipient: Address;
    message: Hex;
    quoteTimestamp: number;
    exclusiveRelayer: Address;
    exclusivityDeadline: number;
    spokePoolAddress: Address;
    destinationSpokePoolAddress: Address;
    originChainId: number;
    destinationChainId: number;
    inputToken: Address;
    outputToken: Address;
    isNative?: boolean;
  };
  limits: {
    minDeposit: bigint;
    maxDeposit: bigint;
    maxDepositInstant: bigint;
  };
  fees: {
    lpFee: {
      pct: bigint;
      total: bigint;
    };
    relayerGasFee: {
      pct: bigint;
      total: bigint;
    };
    relayerCapitalFee: {
      pct: bigint;
      total: bigint;
    };
    totalRelayFee: {
      pct: bigint;
      total: bigint;
    };
  };
  isAmountTooLow: boolean;
  estimatedFillTimeSec: number;
};

/**
 * Get a quote for a given set of parameters.
 * @param params - See {@link GetQuoteParams}.
 * @returns See {@link Quote}.
 * @public
 */
export async function getQuote(params: GetQuoteParams): Promise<Quote> {
  const {
    route,
    recipient: _recipient,
    inputAmount,
    crossChainMessage,
    logger,
    apiUrl,
  } = params;

  let message: Hex = "0x";
  let recipient = _recipient;

  if (crossChainMessage && typeof crossChainMessage === "object") {
    if (crossChainMessage.actions.length === 0) {
      throw new Error("No 'crossChainMessage.actions' provided");
    }
    logger?.debug(
      "Building cross chain message for actions:",
      crossChainMessage.actions,
    );
    message = buildMulticallHandlerMessage({
      actions: crossChainMessage.actions,
      fallbackRecipient: crossChainMessage.fallbackRecipient,
    });
    logger?.debug("Original message:", message);
    recipient = getMultiCallHandlerAddress(route.destinationChainId);
    logger?.debug(`Recipient ${recipient}`);
  }

  const { outputAmount, ...fees } = await getSuggestedFees({
    ...route,
    amount: inputAmount,
    recipient,
    message,
    logger,
    apiUrl,
  });

  logger?.debug("fees", fees);

  // If a given cross-chain message is dependent on the outputAmount, update it
  if (crossChainMessage && typeof crossChainMessage === "object") {
    for (const action of crossChainMessage.actions) {
      let _callData: Hex = action.callData;
      let _value: bigint = BigInt(action.value);

      if (action?.update) {
        const updated = action.update(outputAmount);
        _callData = updated.callData;
        _value = updated.value;
      }
      if (action?.updateCallData) {
        _callData = action.updateCallData(outputAmount);
      }
      if (action?.updateValue) {
        _value = action.updateValue(outputAmount);
      }
      if (action?.updateAsync) {
        const updated = await action.updateAsync(outputAmount);
        _callData = updated.callData;
        _value = updated.value;
      }
      if (action?.updateCallDataAsync) {
        _callData = await action.updateCallDataAsync(outputAmount);
      }

      if (action?.updateValueAsync) {
        _value = await action.updateValueAsync(outputAmount);
      }
      action.callData = _callData;
      action.value = _value;

      logger?.debug("Updated calldata:", action.callData);
      logger?.debug("Updated value:", action.value);
    }

    message = buildMulticallHandlerMessage({
      actions: crossChainMessage.actions,
      fallbackRecipient: crossChainMessage.fallbackRecipient,
    });
    logger?.debug(
      `Updated message with output amount ${outputAmount}`,
      message,
    );
  }

  const {
    // partial deposit args
    timestamp,
    exclusiveRelayer,
    exclusivityDeadline,
    spokePoolAddress,
    destinationSpokePoolAddress,
    // limits
    isAmountTooLow,
    limits,
    // fees
    lpFee,
    relayerGasFee,
    relayerCapitalFee,
    totalRelayFee,
    // misc
    estimatedFillTimeSec,
  } = fees;

  return {
    deposit: {
      inputAmount: BigInt(inputAmount),
      outputAmount,
      recipient: recipient as Address,
      message,
      quoteTimestamp: Number(timestamp),
      exclusiveRelayer: exclusiveRelayer as Address,
      exclusivityDeadline,
      spokePoolAddress: spokePoolAddress as Address,
      destinationSpokePoolAddress: destinationSpokePoolAddress as Address,
      ...route,
    },
    limits,
    fees: {
      lpFee,
      relayerGasFee,
      relayerCapitalFee,
      totalRelayFee,
    },
    isAmountTooLow,
    estimatedFillTimeSec,
  };
}
