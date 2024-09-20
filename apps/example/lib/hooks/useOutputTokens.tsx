import { useQuery } from "@tanstack/react-query";
import { useAcross } from "../across";

export function useOutputTokens(destinationChainId: number | undefined) {
  const sdk = useAcross();
  const queryKey = ["outputTokens", destinationChainId];

  const { data: chains, ...rest } = useQuery({
    queryKey,
    queryFn: () => {
      return sdk.utils.getSupportedChains({ chainId: destinationChainId });
    },
    enabled: Boolean(destinationChainId),
    refetchInterval: Infinity,
    retry: (_, error) => {
      console.log(error);
      return true;
    },
  });

  return {
    outputTokens: chains?.[0] ? chains[0].outputTokens : undefined,
    ...rest,
  };
}
