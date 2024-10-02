import { useQuery } from "@tanstack/react-query";
import { useAcross } from "../across";

export function useInputTokens(originChainId: number | undefined) {
  const sdk = useAcross();
  const queryKey = ["inputTokens", originChainId];

  const { data: chains, ...rest } = useQuery({
    queryKey,
    queryFn: () => {
      return sdk.getSupportedChains({ chainId: originChainId });
    },
    enabled: Boolean(originChainId),
    refetchInterval: Infinity,
    retry: (_, error) => {
      console.log(error);
      return true;
    },
  });

  return {
    inputTokens: chains?.[0] ? chains[0].inputTokens : undefined,
    ...rest,
  };
}
