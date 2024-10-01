import { useQuery } from "@tanstack/react-query";
import { useAcross } from "../across";
import { AcrossClient } from "@across-toolkit/sdk";
import { buildQueryKey } from "../utils";

export type useAvailableRoutesParams = Parameters<
  AcrossClient["actions"]["getAvailableRoutes"]
>[0];

export function useAvailableRoutes(
  params: useAvailableRoutesParams,
  enabled = true,
) {
  const sdk = useAcross();

  const queryKey = buildQueryKey("availableRoutes", params);

  const { data: availableRoutes, ...rest } = useQuery({
    queryKey,
    queryFn: () => {
      return sdk.actions.getAvailableRoutes(params);
    },
    enabled,
    refetchInterval: Infinity,
  });

  return { availableRoutes, ...rest };
}
