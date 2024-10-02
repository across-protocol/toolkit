import { useReadContract } from "wagmi";
import { STAKE_CONTRACT } from "../stake";
import { formatUnits } from "viem";

export function useMinStake() {
  const { data, ...rest } = useReadContract({
    abi: STAKE_CONTRACT.abi,
    chainId: STAKE_CONTRACT.chain.id,
    functionName: "minStake",
  });

  return {
    minStake: data,
    minStakeFormatted: data
      ? formatUnits(data, STAKE_CONTRACT.token.decimals)
      : undefined,
    ...rest,
  };
}
