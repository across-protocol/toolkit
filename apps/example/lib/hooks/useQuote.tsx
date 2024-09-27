import { useQuery } from "@tanstack/react-query";
import { useAcross } from "../across";
import { AcrossClient } from "@across-protocol/integrator-sdk";
import { buildQueryKey } from "../utils";

export type useQuoteParams =
  | Pick<
      Parameters<AcrossClient["actions"]["getQuote"]>[0],
      "inputAmount" | "route"
    >
  | undefined;

export function useQuote(params: useQuoteParams) {
  const sdk = useAcross();
  const queryKey = buildQueryKey("getQuote", params);

  const { data: quote, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!params) return;
      return await sdk.actions.getQuote(params);
    },
    enabled: Boolean(params),
    refetchInterval: 10_000,
    retryDelay(failureCount, error) {
      return 10_000;
    },
    retry: (_, error) => {
      console.log(error);
      return true;
    },
  });

  return { quote, ...rest };
}
