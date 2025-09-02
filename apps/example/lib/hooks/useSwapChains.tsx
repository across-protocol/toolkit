import { useQuery } from "@tanstack/react-query";
import { useAcross } from "../across";
import { AcrossClient } from "@across-protocol/app-sdk";
import { buildQueryKey } from "../utils";

export type useAcrossChainsParams = Parameters<
  AcrossClient["getSwapChains"]
>[0];

export function useSwapChains(params: useAcrossChainsParams) {
  const sdk = useAcross();
  const queryKey = buildQueryKey("swapChains", params);

  const { data: swapChains, ...rest } = useQuery({
    queryKey,
    queryFn: () => {
      return sdk.getSwapChains(params);
    },
    enabled: true,
    refetchInterval: Infinity,
    retry: (_, error) => {
      console.log(error);
      return true;
    },
  });

  return { swapChains, ...rest };
}
