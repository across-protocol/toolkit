import { Address, Hex } from "viem";
import { Amount, CrossChainAction, Route } from "../types";
import {
  getMultiCallHandlerAddress,
  buildMulticallHandlerMessage,
  LoggerT,
} from "../utils";
import { getSuggestedFees } from "./getSuggestedFees";

export type GetQuoteParams = {
  route: Route;
  inputAmount: Amount;
  logger: LoggerT;
  outputAmount?: Amount; // @todo add support for outputAmount
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

export type Quote = Awaited<ReturnType<typeof getQuote>>;

export async function getQuote(params: GetQuoteParams) {
  const {
    route,
    recipient: _recipient,
    inputAmount,
    crossChainMessage,
  } = params;

  let message: Hex = "0x";
  let recipient = _recipient;

  if (crossChainMessage && typeof crossChainMessage === "object") {
    if (crossChainMessage.actions.length === 0) {
      throw new Error("No 'crossChainMessage.actions' provided");
    }

    message = buildMulticallHandlerMessage({
      actions: crossChainMessage.actions,
      fallbackRecipient: crossChainMessage.fallbackRecipient,
    });
    recipient = getMultiCallHandlerAddress(route.destinationChainId);
  }

  const { outputAmount, ...fees } = await getSuggestedFees({
    ...route,
    amount: inputAmount,
    recipient,
    message,
  });

  // If a given cross-chain message is dependent on the outputAmount, update it
  if (crossChainMessage && typeof crossChainMessage === "object") {
    for (const action of crossChainMessage.actions) {
      if (action.updateCallData) {
        action.callData = action.updateCallData(outputAmount);
      }
    }
    message = buildMulticallHandlerMessage({
      actions: crossChainMessage.actions,
      fallbackRecipient: crossChainMessage.fallbackRecipient,
    });
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
      inputAmount,
      outputAmount,
      recipient,
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

export type QuoteResponse = Awaited<ReturnType<typeof getQuote>>;
