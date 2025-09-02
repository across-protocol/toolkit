import { useQuery } from "@tanstack/react-query";
import { useAcross } from "../across";

export function useSwapTokens(chainId: number | undefined) {
  const sdk = useAcross();
  const queryKey = ["swapTokens", chainId];

  const { data: tokens, ...rest } = useQuery({
    queryKey,
    queryFn: () => {
      return sdk.getSwapTokens({ chainId: chainId });
    },
    enabled: Boolean(chainId),
    refetchInterval: Infinity,
    retry: (_, error) => {
      console.log(error);
      return true;
    },
  });

  return {
    tokens: tokens?.map((token) => ({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      logoUrl: token.logoUrl,
    })),
    ...rest,
  };
}
