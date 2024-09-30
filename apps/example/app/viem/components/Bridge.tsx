"use client";

import { ChainSelect } from "@/components/ChainSelect";
import { Divider } from "@/components/Divider";
import { TokenSelect } from "@/components/TokenSelect";
import { Button, Label, Skeleton } from "@/components/ui";
import { useAvailableRoutes } from "@/lib/hooks/useAvailableRoutes";
import { useInputTokens } from "@/lib/hooks/useInputTokens";
import { useOutputTokens } from "@/lib/hooks/useOutputTokens";
import { useQuote } from "@/lib/hooks/useQuote";
import { useSupportedAcrossChains } from "@/lib/hooks/useSupportedAcrossChains";
import { getExplorerLink, reduceAcrossChains } from "@/lib/utils";
import { TokenInfo } from "@across-protocol/integrator-sdk";
import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useBalance, useChains } from "wagmi";
import { useDebounceValue } from "usehooks-ts";
import { useExecuteQuote } from "@/lib/hooks/useExecuteQuote";
import { Progress } from "./Progress";
import { TokenInput } from "@/components/TokenInput";
import { ExternalLink } from "@/components/ExternalLink";

export function Bridge() {
  const { address } = useAccount();
  const chains = useChains();
  // CHAINS

  const { supportedChains } = useSupportedAcrossChains({});

  // use only token data for chains we support
  const acrossChains = reduceAcrossChains(supportedChains, [...chains]);

  // Optimism default input chain
  const defaultOriginChainId = chains.find((chain) => chain.id === 10)?.id;
  const [originChainId, setOriginChainId] = useState<number | undefined>(
    defaultOriginChainId,
  );

  // FROM TOKEN
  const { inputTokens } = useInputTokens(originChainId);
  const [fromToken, setFromToken] = useState<TokenInfo | undefined>(
    inputTokens?.[0],
  );
  const { data: balance } = useBalance({
    address,
    token: fromToken?.address,
    chainId: originChainId,
  });
  const inputToken = inputTokens?.find(
    (token) =>
      token.address.toLowerCase() === fromToken?.address?.toLowerCase(),
  );

  const [destinationChainId, setDestinationChainId] = useState<
    number | undefined
  >(chains.find((chain) => chain.id !== originChainId)?.id);

  const { availableRoutes } = useAvailableRoutes({
    originChainId,
    destinationChainId,
    originToken: fromToken?.address,
  });

  const outputTokensForRoute = availableRoutes?.map((route) =>
    route.outputToken.toLowerCase(),
  );

  const { outputTokens: outputTokensForChain } =
    useOutputTokens(destinationChainId);

  const [outputTokens, setOutputTokens] = useState<TokenInfo[] | undefined>();

  useEffect(() => {
    const _outputTokens = outputTokensForChain?.filter((token) =>
      outputTokensForRoute?.includes(token.address.toLowerCase()),
    );
    setOutputTokens(_outputTokens);
  }, [availableRoutes]);

  const [toToken, setToToken] = useState<TokenInfo | undefined>(
    outputTokens?.[0],
  );

  useEffect(() => {
    if (outputTokens) {
      setToToken(
        outputTokens.find((token) => token.symbol === fromToken?.symbol) ??
          outputTokens?.[0],
      );
    }
  }, [outputTokens]);

  const [inputAmount, setInputAmount] = useState<string>();
  const [debouncedInputAmount] = useDebounceValue(inputAmount, 300);
  const route = availableRoutes?.find((route) => {
    return (
      route.outputToken.toLocaleLowerCase() ===
        toToken?.address?.toLowerCase() &&
      route.outputTokenSymbol === toToken.symbol
    );
  });

  const quoteConfig =
    route && debouncedInputAmount && inputToken
      ? {
          route,
          recipient: address,
          inputAmount: parseUnits(debouncedInputAmount, inputToken?.decimals),
        }
      : undefined;

  const {
    quote,
    isLoading: quoteLoading,
    isRefetching,
  } = useQuote(quoteConfig);

  const {
    executeQuote,
    progress,
    error,
    isPending,
    depositReceipt,
    fillReceipt,
  } = useExecuteQuote(quote);
  const inputBalance = balance?.value
    ? parseFloat(formatUnits(balance?.value, balance?.decimals)).toFixed(4)
    : undefined;

  function onMax() {
    if (!balance?.value) return;
    setInputAmount(formatUnits(balance?.value, balance?.decimals));
  }
  const originChain = chains.find((chain) => chain.id === originChainId);
  const destinationChain = chains.find(
    (chain) => chain.id === destinationChainId,
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

  return (
    <>
      <div className="bg-foreground border border-border-secondary p-6 w-full max-w-[600px] rounded-[10px]">
        <div className="flex flex-col gap-4">
          <Label htmlFor="origin-chain">From</Label>
          <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
            <ChainSelect
              disabled={!supportedChains}
              className="flex-[5]"
              id="origin-chain"
              chains={acrossChains}
              chain={originChainId}
              onChainChange={(chainId) => {
                setDestinationChainId(undefined);
                setOriginChainId(chainId);
              }}
            />

            <TokenSelect
              className="flex-[3]"
              tokens={inputTokens}
              onTokenChange={setFromToken}
              token={fromToken}
            />
          </div>

          <Divider className="my-2" />

          <Label htmlFor="destination-chain">To</Label>
          <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
            <ChainSelect
              disabled={!supportedChains}
              className="flex-[5]"
              id="destination-chain"
              chains={acrossChains}
              chain={destinationChainId}
              onChainChange={setDestinationChainId}
            />

            <TokenSelect
              className="flex-[3]"
              disabled={outputTokens ? !(outputTokens?.length > 1) : true}
              tokens={outputTokens}
              onTokenChange={setToToken}
              token={toToken}
            />
          </div>

          <Divider className="my-4" />

          <Label htmlFor="input-amount">Send</Label>
          <TokenInput
            className="flex-[5]"
            balance={inputBalance}
            id="input-amount"
            placeholder="Enter amount"
            type="number"
            value={inputAmount}
            onMax={onMax}
            onChange={(e) => setInputAmount(e.currentTarget.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start gap-2 bg-foreground border border-border-secondary p-6 w-full max-w-[600px] rounded-[10px]">
        <Label>Receive</Label>
        {!quote && quoteLoading && (
          <Skeleton className="text-md font-normal text-text/80">
            fetching quote...
          </Skeleton>
        )}
        {quote && toToken && (
          <p className="text-md font-normal text-text">
            {parseFloat(
              formatUnits(quote.deposit.outputAmount, toToken.decimals),
            ).toFixed(3)}
          </p>
        )}
        <Button
          onClick={() => executeQuote()}
          disabled={!(quote && toToken) || isRefetching || isPending}
          className="mt-2"
          variant="accent"
        >
          {isPending
            ? "Executing..."
            : isRefetching
              ? "Updating quote..."
              : "Confirm Transaction"}
        </Button>

        {progress && (
          <Progress className="mt-8" error={error} progress={progress} />
        )}
        <div className="flex gap-2 mt-4">
          {depositTxLink && (
            <ExternalLink icon href={depositTxLink}>
              Deposit Tx
            </ExternalLink>
          )}
          {fillTxLink && (
            <ExternalLink icon href={fillTxLink}>
              Fill Tx
            </ExternalLink>
          )}
        </div>
      </div>
    </>
  );
}
