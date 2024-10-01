"use client";

import { ChainSelect } from "@/components/ChainSelect";
import { Divider } from "@/components/Divider";
import { ExternalLink } from "@/components/ExternalLink";
import { Icon } from "@/components/Icon";
import { TokenInput } from "@/components/TokenInput";
import { TokenSelect } from "@/components/TokenSelect";
import { Button, Label } from "@/components/ui";
import { routeConfig, STAKE_CONTRACT, stakeToken } from "@/lib/stake";
import { useAcrossChains } from "@/lib/hooks/useAcrossChains";
import { useAvailableRoutes } from "@/lib/hooks/useAvailableRoutes";
import { useExecuteQuote } from "@/lib/hooks/useExecuteQuote";
import { useInputTokens } from "@/lib/hooks/useInputTokens";
import { useUserStake } from "@/lib/hooks/useUserStake";
import { useWithdraw } from "@/lib/hooks/useWithdraw";
import { getExplorerLink, isNativeToken } from "@/lib/utils";
import { TokenInfo } from "@across-toolkit/sdk";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { formatUnits, parseUnits } from "viem";
import { optimism } from "viem/chains";
import { useAccount, useBalance } from "wagmi";
import { useStakeQuote } from "@/lib/hooks/useStakeQuote";
import { useQueryClient } from "@tanstack/react-query";

export function Stake() {
  const queryClient = useQueryClient();
  const { availableRoutes } = useAvailableRoutes(routeConfig);
  const { address } = useAccount();

  // FROM CHAIN
  const acrossChains = useAcrossChains();

  const originChainIds = new Set(
    availableRoutes?.map((route) => route.originChainId),
  );

  const originChainInputTokenAddresses = new Set(
    availableRoutes?.map((route) => route.inputToken),
  );

  const originChains = acrossChains?.filter((c) =>
    originChainIds.has(c.chainId),
  );

  const toToken = stakeToken;

  const [originChainId, setOriginChainId] = useState<number | undefined>(
    originChains?.[0]?.chainId,
  );

  // FROM TOKEN
  const { inputTokens: chainInputTokens } = useInputTokens(originChainId);

  const inputTokens = chainInputTokens?.filter((token) =>
    originChainInputTokenAddresses.has(token.address),
  );

  const [fromToken, setFromToken] = useState<TokenInfo | undefined>(
    inputTokens?.[0],
  );

  useEffect(() => {
    if (inputTokens && !fromToken) {
      setFromToken(inputTokens[0]);
    }
  }, [inputTokens, originChainId]);

  const { data: fromTokenBalance } = useBalance({
    address,
    token: isNativeToken(fromToken, originChainId)
      ? undefined
      : fromToken?.address,
    chainId: originChainId,
  });

  const inputBalance = fromTokenBalance
    ? parseFloat(
        formatUnits(fromTokenBalance?.value, fromTokenBalance?.decimals),
      ).toFixed(4)
    : undefined;

  function onMax() {
    if (!fromTokenBalance?.value) return;
    setInputAmount(
      formatUnits(fromTokenBalance?.value, fromTokenBalance?.decimals),
    );
  }

  const destinationChain = acrossChains?.find(
    (c) => c.chainId === routeConfig.destinationChainId,
  );

  const [inputAmount, setInputAmount] = useState<string>("");
  const [debouncedInputAmount] = useDebounceValue(inputAmount, 300);
  const route = availableRoutes?.find((route) => {
    return (
      route.outputToken.toLowerCase() === toToken?.address?.toLowerCase() &&
      route.inputToken.toLowerCase() === fromToken?.address.toLowerCase() &&
      route.originChainId === originChainId &&
      route.outputTokenSymbol === toToken.symbol
    );
  });

  const { userStakeFormatted, userStakeQueryKey } = useUserStake();
  const {
    canWithdraw,
    withdrawAsync,
    withdrawPending,
    withdrawConfirming,
    withdrawTxLink,
  } = useWithdraw();

  const {
    stakeQuote,
    error: stakeQuoteError,
    isPending: stakeQuotePending,
    isRefetching: stakeQuoteRefetching,
  } = useStakeQuote({
    route,
    inputAmount: parseUnits(
      debouncedInputAmount,
      STAKE_CONTRACT.token.decimals,
    ),
  });

  const { executeQuote, progress, isPending, fillTxLink, depositTxLink } =
    useExecuteQuote(stakeQuote);

  useEffect(() => {
    if (withdrawConfirming) {
      queryClient.invalidateQueries({ queryKey: userStakeQueryKey });
    }
  }, [withdrawConfirming]);

  useEffect(() => {
    if (progress.step === "fill" && progress.status === "txSuccess") {
      queryClient.invalidateQueries({ queryKey: userStakeQueryKey });
    }
  }, [progress]);

  return (
    <>
      <div className="bg-foreground border border-border-secondary p-6 w-full rounded-[10px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-text text-xl mx-auto font-normal mb-2">
            Demo Staking Protocol
          </h2>
          <p className="text-text/75 text-center">
            Bridge from another chain and stake the bridged funds on this{" "}
            <a
              className="underline inline hover:text-text/75"
              target="_blank"
              href={getExplorerLink({
                chain: optimism,
                type: "address",
                address: STAKE_CONTRACT.address,
              })}
            >
              Staking Contract
            </a>{" "}
            on Optimism.
          </p>
          <Label className="text-lg" htmlFor="your-stake">
            Stake Balance
          </Label>

          <div className="font-normal text-2xl flex items-center gap-2 ">
            <Icon className="w-6 h-6" name="eth" />
            {userStakeFormatted}
          </div>
          <Button
            disabled={!canWithdraw || withdrawPending || withdrawConfirming}
            onClick={() => void withdrawAsync()}
            variant="accent"
          >
            {withdrawPending || withdrawConfirming
              ? "Withdrawing..."
              : "Withdraw"}
          </Button>

          {withdrawTxLink && (
            <ExternalLink icon href={withdrawTxLink}>
              Withdraw Tx
            </ExternalLink>
          )}

          <Divider className="my-4" />

          <Label htmlFor="origin-chain">From</Label>
          <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
            <ChainSelect
              disabled={false}
              className="flex-[5]"
              id="origin-chain"
              chains={originChains}
              chain={originChainId}
              onChainChange={(id) => {
                setFromToken(undefined);
                setOriginChainId(id);
              }}
            />

            <TokenSelect
              className="flex-[3]"
              tokens={inputTokens}
              onTokenChange={(token) => setFromToken(token)}
              token={fromToken}
            />
          </div>

          <Divider className="my-2" />

          <Label htmlFor="destination-chain">Stake</Label>
          <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-2">
            <ChainSelect
              disabled
              className="flex-[5]"
              id="origin-chain"
              chains={destinationChain && [destinationChain]}
              chain={destinationChain?.chainId}
              onChainChange={() => {}}
            />
            <TokenSelect
              className="flex-[3]"
              disabled
              tokens={[stakeToken]}
              onTokenChange={() => {}}
              token={stakeToken}
            />
          </div>
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
          <Button
            onClick={() => executeQuote()}
            disabled={!stakeQuote || stakeQuoteRefetching || isPending}
            className="mt-2"
            variant="accent"
          >
            {isPending
              ? "Executing..."
              : stakeQuoteRefetching
                ? "Updating quote..."
                : "Stake"}
          </Button>
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
