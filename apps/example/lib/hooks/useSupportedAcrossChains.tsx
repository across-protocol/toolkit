import { useQuery } from "@tanstack/react-query";
import { useAcross } from "../across";
import { AcrossClient } from "@across-toolkit/sdk";
import { buildQueryKey } from "../utils";

export type useAcrossChainsParams = Parameters<
  AcrossClient["utils"]["getSupportedChains"]
>[0];

export function useSupportedAcrossChains(params: useAcrossChainsParams) {
  const sdk = useAcross();
  const queryKey = buildQueryKey("supportedChains", params);

  const { data: supportedChains, ...rest } = useQuery({
    queryKey,
    queryFn: () => {
      return sdk.utils.getSupportedChains(params);
    },
    enabled: true,
    refetchInterval: Infinity,
    retry: (_, error) => {
      console.log(error);
      return true;
    },
  });

  return { supportedChains, ...rest };
}
