import z from "zod";
import {
  percentageString,
  bigNumberString,
  numericString,
  ethereumAddress,
  positiveInteger,
} from "./validators.js";

export const suggestedFeesResponseJsonSchema = z.object({
  estimatedFillTimeSec: positiveInteger,
  capitalFeePct: percentageString,
  capitalFeeTotal: bigNumberString,
  relayGasFeePct: percentageString,
  relayGasFeeTotal: bigNumberString,
  relayFeePct: percentageString,
  relayFeeTotal: bigNumberString,
  lpFeePct: percentageString,
  timestamp: numericString,
  isAmountTooLow: z.boolean(),
  quoteBlock: numericString,
  exclusiveRelayer: ethereumAddress,
  exclusivityDeadline: z.number(),
  spokePoolAddress: ethereumAddress,
  destinationSpokePoolAddress: ethereumAddress,
  totalRelayFee: z.object({
    pct: percentageString,
    total: bigNumberString,
  }),
  relayerCapitalFee: z.object({
    pct: percentageString,
    total: bigNumberString,
  }),
  relayerGasFee: z.object({
    pct: percentageString,
    total: bigNumberString,
  }),
  lpFee: z.object({
    pct: percentageString,
    total: bigNumberString,
  }),
  limits: z.object({
    minDeposit: bigNumberString,
    maxDeposit: bigNumberString,
    maxDepositInstant: bigNumberString,
    maxDepositShortDelay: bigNumberString,
    recommendedDepositInstant: bigNumberString,
  }),
  fillDeadline: numericString,
});

export type SuggestedFeesApiResponse = z.infer<
  typeof suggestedFeesResponseJsonSchema
>;
