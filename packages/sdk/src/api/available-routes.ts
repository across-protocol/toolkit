import { boolean, string, z } from "zod";
import { ethereumAddress, positiveInteger } from "./validators.js";

export const routeSchema = z.array(
  z.object({
    originChainId: positiveInteger,
    originToken: ethereumAddress,
    destinationChainId: positiveInteger,
    destinationToken: ethereumAddress,
    originTokenSymbol: string(),
    destinationTokenSymbol: string(),
    isNative: boolean(),
  }),
);

export type AvailableRoutesApiResponse = z.infer<typeof routeSchema>;
