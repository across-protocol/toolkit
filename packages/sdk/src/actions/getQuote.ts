import { Address, Hex } from "viem";
import { getClient } from "../client";
import { Amount, CrossChainAction, Route } from "../types";
import {
  getMultiCallHandlerAddress,
  buildMulticallHandlerMessage,
} from "../utils";

export type QuoteParams = {
  route: Route;
  inputAmount: Amount;
  outputAmount?: Amount; // @todo add support for outputAmount
  recipient?: Address;
  crossChainMessage?:
    | {
        actions: CrossChainAction[];
        fallbackRecipient: Address;
      }
    | Hex;
};

export async function getQuote(params: QuoteParams) {
  const client = getClient();

  const {
    route,
    recipient: _recipient,
    inputAmount,
    crossChainMessage,
  } = params;

  let message = "0x";
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

  const { outputAmount, ...fees } = await client.actions.getSuggestedFees({
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
      quoteTimestamp: timestamp,
      exclusiveRelayer,
      exclusivityDeadline,
      spokePoolAddress,
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
