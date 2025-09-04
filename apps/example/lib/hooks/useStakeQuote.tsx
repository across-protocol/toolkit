import { useAccount } from "wagmi";
import { useAcross } from "../across";
import { AcrossClient, Amount } from "@across-protocol/app-sdk";
import { WETH_OPTIMISM } from "../weth";
import { STAKE_CONTRACT } from "../stake";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { buildQueryKey } from "../utils";

type StakeQuoteParams = Partial<Parameters<AcrossClient["getSwapQuote"]>[0]>;

export function useStakeQuote(
  params: StakeQuoteParams,
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  const { address } = useAccount();
  const sdk = useAcross();

  function buildCrossChainMessage(): StakeQuoteParams["actions"] {
    if (!address) {
      throw new Error("No account connected");
    }

    return [
      {
        target: STAKE_CONTRACT.address,
        functionSignature: "function stake(address recipient)",
        args: [{ value: address }],
        populateCallValueDynamically: true,
      },
    ];
  }

  const queryKey = buildQueryKey("getStakeQuote", params);

  const enabled = Boolean(
    params.route && params.amount && (queryOptions?.enabled ?? true),
  );

  const { data: stakeQuote, ...rest } = useQuery({
    queryKey,
    queryFn: () =>
      sdk.getSwapQuote({
        route: params.route!,
        amount: params.amount!,
        depositor: address!,
        actions: buildCrossChainMessage(),
      }),
    enabled,
  });

  return {
    stakeQuote,
    ...rest,
  };
}
