import { useAccount } from "wagmi";
import { useAcross } from "../across";
import { AcrossClient, Amount } from "@across-toolkit/sdk";
import { generateUnwrapCallData, WETH_OPTIMISM } from "../weth";
import { generateStakeCallData, STAKE_CONTRACT } from "../stake";
import { useQuery } from "@tanstack/react-query";
import { buildQueryKey } from "../utils";

type StakeQuoteParams = Partial<
  Parameters<AcrossClient["actions"]["getQuote"]>[0]
>;

export function useStakeQuote(
  params: StakeQuoteParams,
  queryOptions?: Parameters<typeof useQuery>,
) {
  const { address } = useAccount();
  const sdk = useAcross();

  function buildCrossChainMessage(
    inputAmount: Amount,
  ): StakeQuoteParams["crossChainMessage"] {
    if (!address) {
      throw new Error("No account connected");
    }

    // TODO: Remove stub, for dynamic output value
    const finalAmount = (BigInt(inputAmount) * BigInt(9)) / BigInt(10); // 90%

    return {
      actions: [
        {
          target: WETH_OPTIMISM.address,
          callData: generateUnwrapCallData(inputAmount),
          value: 0n,
          updateCallData(outputAmount) {
            return generateUnwrapCallData(outputAmount);
          },
        },
        {
          target: STAKE_CONTRACT.address,
          callData: generateStakeCallData(address),
          value: finalAmount, //! cannot update value!
        },
      ],
      fallbackRecipient: address,
    };
  }

  const queryKey = buildQueryKey("getStakeQuote", params);

  const { data: stakeQuote, ...rest } = useQuery({
    queryKey,
    queryFn: () =>
      sdk.actions.getQuote({
        route: params.route!,
        inputAmount: params.inputAmount!,
        recipient: STAKE_CONTRACT.multicallHandler,
        crossChainMessage: buildCrossChainMessage(params.inputAmount!),
      }),
    enabled: Boolean(params.route && params.inputAmount),
    ...queryOptions,
  });

  return {
    stakeQuote,
    ...rest,
  };
}
