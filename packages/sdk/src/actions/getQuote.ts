import { Address, Hex } from "viem";
import { getClient } from "../client";
import { Amount, CrossChainAction } from "../types";
import {
  getMultiCallHandlerAddress,
  buildMulticallHandlerMessage,
} from "../utils";

export type QuoteParams = {
  inputToken: Address;
  outputToken: Address;
  originChainId: number;
  destinationChainId: number;
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
    inputToken,
    outputToken,
    originChainId,
    destinationChainId,
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
    recipient = getMultiCallHandlerAddress(destinationChainId);
  }

  const { outputAmount, ...fees } = await client.actions.getSuggestedFees({
    inputToken,
    outputToken,
    originChainId,
    destinationChainId,
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
      originChainId,
      destinationChainId,
      recipient,
      message,
      quoteTimestamp: timestamp,
      exclusiveRelayer,
      exclusivityDeadline,
      spokePoolAddress,
      inputToken,
      outputToken,
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

export type QuoteResponse = {};
