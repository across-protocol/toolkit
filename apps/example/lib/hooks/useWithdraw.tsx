import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useUserStake } from "./useUserStake";
import { STAKE_CONTRACT } from "../constants";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getExplorerLink } from "../utils";

export function useWithdraw() {
  const { address } = useAccount();
  const currentChainId = useChainId();
  const { userStake, userStakeQueryKey } = useUserStake();
  const queryClient = useQueryClient();

  const withdrawEnabled = Boolean(
    address && (userStake ? userStake > 0 : false),
  );
  const { switchChainAsync } = useSwitchChain();

  const writeConfig = {
    abi: STAKE_CONTRACT.abi,
    address: STAKE_CONTRACT.address,
    chainId: STAKE_CONTRACT.chain.id,
    functionName: "unstake",
    account: address,
  } as const;

  const {
    writeContract,
    writeContractAsync,
    isPending: withdrawPending,
    isError: withdrawError,
    isSuccess: withdrawSuccess,
    isIdle: withdrawIdle,
    data: hash,
    ...rest
  } = useWriteContract();

  const {
    isLoading: withdrawConfirming,
    isSuccess: withdrawConfirmed,
    data: withdrawReceipt,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: Boolean(hash),
    },
  });

  useEffect(() => {
    if (withdrawConfirmed) {
      queryClient.invalidateQueries({ queryKey: userStakeQueryKey });
    }
  }, [withdrawConfirmed]);

  async function checkChain() {
    if (currentChainId !== STAKE_CONTRACT.chain.id) {
      await switchChainAsync({ chainId: STAKE_CONTRACT.chain.id });
    }
  }

  const withdrawTxLink =
    withdrawReceipt &&
    getExplorerLink({
      chain: STAKE_CONTRACT.chain,
      type: "transaction",
      txHash: withdrawReceipt.transactionHash,
    });

  return {
    withdrawEnabled,
    hash,
    withdraw: () => writeContract(writeConfig),
    withdrawAsync: async () => {
      await checkChain();
      await writeContractAsync(writeConfig);
    },
    withdrawConfirmed,
    withdrawConfirming,
    withdrawPending,
    withdrawError,
    withdrawSuccess,
    withdrawIdle,
    withdrawTxLink,
    ...rest,
  };
}
