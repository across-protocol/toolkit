import { useAccount } from "wagmi";
import { useAcross } from "../across";
import { AcrossClient, Amount } from "@across-toolkit/sdk";
import { generateUnwrapCallData, WETH_OPTIMISM } from "../weth";
import { generateStakeCallData, STAKE_CONTRACT } from "../stake";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { buildQueryKey } from "../utils";

type StakeQuoteParams = Partial<
  Parameters<AcrossClient["actions"]["getQuote"]>[0]
>;

export function useStakeQuote(
  params: StakeQuoteParams,
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  const { address } = useAccount();
  const sdk = useAcross();

  function buildCrossChainMessage(
    inputAmount: Amount,
  ): StakeQuoteParams["crossChainMessage"] {
    if (!address) {
      throw new Error("No account connected");
    }

    return {
      actions: [
        {
          target: WETH_OPTIMISM.address,
          callData: generateUnwrapCallData(inputAmount),
          value: 0n,
          update: (updatedOutputAmount) => {
            return {
              callData: generateUnwrapCallData(updatedOutputAmount),
              value: 0n,
            };
          },
        },
        {
          target: STAKE_CONTRACT.address,
          callData: generateStakeCallData(address),
          value: inputAmount,
          update: (updatedOutputAmount) => {
            return {
              callData: generateStakeCallData(address),
              value: updatedOutputAmount,
            };
          },
        },
      ],
      fallbackRecipient: address,
    };
  }

  const queryKey = buildQueryKey("getStakeQuote", params);

  const enabled = Boolean(
    params.route && params.inputAmount && (queryOptions?.enabled ?? true),
  );

  const { data: stakeQuote, ...rest } = useQuery({
    queryKey,
    queryFn: () =>
      sdk.actions.getQuote({
        route: params.route!,
        inputAmount: params.inputAmount!,
        recipient: STAKE_CONTRACT.multicallHandler,
        crossChainMessage: buildCrossChainMessage(params.inputAmount!),
      }),
    enabled,
  });

  return {
    stakeQuote,
    ...rest,
  };
}
