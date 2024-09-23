import { useMutation } from "@tanstack/react-query";
import { useAcross } from "../across";
import { buildQueryKey } from "../utils";
import { AcrossClient, ExecutionProgress } from "@across-toolkit/sdk";
import { useChainId, useSwitchChain, useWalletClient } from "wagmi";
import { useState } from "react";

export type useExecuteQuoteParams =
  | Omit<Parameters<AcrossClient["actions"]["executeQuote"]>[0], "walletClient">
  | undefined;

export function useExecuteQuote(params: useExecuteQuoteParams) {
  const sdk = useAcross();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();
  const mutationKey = buildQueryKey("executeQuote", params);

  const [progress, setProgress] = useState<ExecutionProgress>({
    status: "idle",
  });

  function resetProgress() {
    setProgress({
      status: "idle",
    });
  }

  const { mutate: executeQuote, ...rest } = useMutation({
    mutationKey,
    mutationFn: async () => {
      if (!params || !walletClient) {
        return;
      }
      if (chainId !== params.deposit.originChainId) {
        await switchChainAsync({ chainId: params.deposit.originChainId });
      }
      resetProgress();
      await sdk.actions.executeQuote({
        ...params,
        walletClient,
        infiniteApproval: true,
        onProgress: (progress) => setProgress(progress),
      });
    },
  });

  return {
    progress,
    executeQuote,
    ...rest,
  };
}
