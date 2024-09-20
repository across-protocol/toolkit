"use client";

import { ChainSelect } from "@/components/ChainSelect";
import { Divider } from "@/components/Divider";
import { TokenSelect } from "@/components/TokenSelect";
import { Button, Input, Label, Skeleton } from "@/components/ui";
import { useAvailableRoutes } from "@/lib/hooks/useAvailableRoutes";
import { useInputTokens } from "@/lib/hooks/useInputTokens";
import { useOutputTokens } from "@/lib/hooks/useOutputTokens";
import { useQuote } from "@/lib/hooks/useQuote";
import { useSupportedAcrossChains } from "@/lib/hooks/useSupportedAcrossChains";
import { cn, reduceAcrossChains } from "@/lib/utils";
import { TokenInfo } from "@across-toolkit/sdk";
import { useEffect, useState } from "react";
import { Address, formatUnits, parseUnits } from "viem";
import { useAccount, useChains } from "wagmi";
import { useDebounce } from "@uidotdev/usehooks";

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
  const [fromTokenAddress, setFromTokenAddress] = useState<Address | undefined>(
    inputTokens?.[2]?.address,
  );
  const inputToken = inputTokens?.find(
    (token) => token.address.toLowerCase() === fromTokenAddress?.toLowerCase(),
  );

  const [destinationChainId, setDestinationChainId] = useState<
    number | undefined
  >(chains.find((chain) => chain.id !== originChainId)?.id);

  const { availableRoutes } = useAvailableRoutes({
    originChainId,
    destinationChainId,
    originToken: fromTokenAddress,
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

  const [toTokenAddress, setToTokenAddress] = useState<Address | undefined>(
    outputTokens?.[0]?.address,
  );
  const toToken = outputTokens?.find(
    (token) => token.address.toLowerCase() === toTokenAddress?.toLowerCase(),
  );

  useEffect(() => {
    if (outputTokens) {
      setToTokenAddress(outputTokens?.[0]?.address);
    }
  }, [outputTokens]);

  const [inputAmount, setInputAmount] = useState<string>();
  const debouncedInputAmount = useDebounce(inputAmount, 300);
  const route = availableRoutes?.find(
    (route) =>
      route.outputToken.toLocaleLowerCase() === toTokenAddress?.toLowerCase(),
  );

  const quoteConfig =
    route && address && debouncedInputAmount && inputToken
      ? {
          route,
          recipient: address,
          inputAmount: parseUnits(debouncedInputAmount, inputToken?.decimals),
        }
      : undefined;

  const { quote, isLoading: quoteLoading } = useQuote(quoteConfig);

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
              onTokenChange={setFromTokenAddress}
              token={fromTokenAddress}
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
              className={cn("flex-[3]")}
              disabled={outputTokens ? !(outputTokens?.length > 1) : true}
              tokens={outputTokens}
              onTokenChange={setToTokenAddress}
              token={toTokenAddress}
            />
          </div>

          <Divider className="my-4" />

          <Label htmlFor="input-amount">Send</Label>
          <Input
            className="flex-[5]"
            id="input-amount"
            placeholder="Enter amount"
            type="number"
            value={inputAmount}
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
          disabled={!(quote && toToken)}
          className="mt-2"
          variant="accent"
        >
          Confirm Transaction
        </Button>
      </div>
    </>
  );
}
