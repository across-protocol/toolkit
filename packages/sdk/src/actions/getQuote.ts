import { getClient } from "../client";

export type QuoteParams = {
  token: string;
  originChainId: number;
  destinationChainId: number;
  amount: string; // bignumber string
};

// @todo add support for "message" for Across+ integrations
export async function getQuote(params: QuoteParams) {
  const client = getClient();
  try {
    const suggestedFees = await client.actions.getSuggestedFees(params);
    if (!suggestedFees) {
      client.log.error("suggested fees failed with params: \n", params);
    }
    return suggestedFees;
  } catch (error) {
    client.log.error(error);
  }
}

export type QuoteResponse = {};
