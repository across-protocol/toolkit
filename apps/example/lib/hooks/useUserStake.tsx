import { useAccount, useReadContract } from "wagmi";
import { STAKE_CONTRACT } from "../stake";
import { formatUnits } from "viem";

export function useUserStake() {
  const { address } = useAccount();

  const {
    data: userStake,
    queryKey,
    ...rest
  } = useReadContract({
    abi: STAKE_CONTRACT.abi,
    address: STAKE_CONTRACT.address,
    functionName: "getStake",
    chainId: STAKE_CONTRACT.chain.id,
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  return {
    userStakeQueryKey: queryKey,
    userStake: userStake ?? 0n,
    userStakeFormatted: userStake
      ? formatUnits(userStake, STAKE_CONTRACT.token.decimals)
      : "0.00",
    ...rest,
  };
}
