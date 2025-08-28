import { useMutation } from "@tanstack/react-query";
import { useAcross } from "../across";
import { buildQueryKey, getExplorerLink } from "../utils";
import { AcrossClient, SwapExecutionProgress } from "@across-protocol/app-sdk";
import { useChainId, useChains, useConfig, useSwitchChain } from "wagmi";
import { useState } from "react";
import { TransactionReceipt } from "viem";
import { getWalletClient } from "wagmi/actions";

export type useExecuteSwapQuoteParams =
  | Omit<Parameters<AcrossClient["executeSwapQuote"]>[0], "walletClient">
  | undefined;

export function useExecuteSwapQuote(params: useExecuteSwapQuoteParams) {
  const sdk = useAcross();
  const config = useConfig();
  const chains = useChains();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();
  const mutationKey = buildQueryKey("executeSwapQuote", params);

  const [progress, setProgress] = useState<SwapExecutionProgress>({
    status: "idle",
    step: "approve",
  });
  const [depositReceipt, setDepositReceipt] = useState<TransactionReceipt>();
  const [fillReceipt, setFillReceipt] = useState<TransactionReceipt>();

  function resetProgress() {
    setProgress({
      status: "idle",
      step: "approve",
    });
  }

  const { mutate: executeSwapQuote, ...rest } = useMutation({
    mutationKey,
    mutationFn: async () => {
      resetProgress();

      if (!params) {
        return;
      }

      const inputChainId = params.swapQuote.inputToken.chainId;

      if (chainId !== inputChainId) {
        await switchChainAsync({ chainId: inputChainId });
      }

      const walletClient = await getWalletClient(config);
      if (!walletClient) {
        return;
      }

      return sdk.executeSwapQuote({
        ...params,
        walletClient,
        onProgress: (progress) => {
          console.log(progress);
          if (progress.status === "txSuccess" && progress.step === "swap") {
            setDepositReceipt(progress.txReceipt);
          }
          if (progress.status === "txSuccess" && progress.step === "fill") {
            setFillReceipt(progress.txReceipt);
          }
          setProgress(progress);
        },
      });
    },
    onError: (error) => {
      console.log("ERROR", error);
    },
  });

  const originChain = chains.find(
    (chain) => chain.id === params?.swapQuote.inputToken.chainId,
  );

  const destinationChain = chains.find(
    (chain) => chain.id === params?.swapQuote.outputToken.chainId,
  );

  const depositTxLink =
    depositReceipt &&
    originChain &&
    getExplorerLink({
      chain: originChain,
      type: "transaction",
      txHash: depositReceipt.transactionHash,
    });

  const fillTxLink =
    fillReceipt &&
    destinationChain &&
    getExplorerLink({
      chain: destinationChain,
      type: "transaction",
      txHash: fillReceipt.transactionHash,
    });

  return {
    progress,
    executeSwapQuote,
    depositReceipt,
    fillReceipt,
    depositTxLink,
    fillTxLink,
    ...rest,
  };
}
