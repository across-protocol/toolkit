"use client";
import { Button } from "@/components/ui/button";
import {
  AcrossClient,
  DepositStatus,
  FillStatus,
  Quote,
} from "@across-protocol/integrator-sdk";
import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { Address, createWalletClient, custom, Hash, parseEther } from "viem";
import { toAccount } from "viem/accounts";
import { arbitrum, mainnet } from "viem/chains";

const chains = [mainnet, arbitrum];

const sdk = AcrossClient.create({
  chains,
  useTestnet: false,
  integratorId: "TEST",
  logLevel: "DEBUG",
});

async function getQuote(account: Address) {
  const routes = await sdk.actions.getAvailableRoutes({
    originChainId: mainnet.id,
    destinationChainId: arbitrum.id,
  })!;

  const route = routes.find((r) => r.inputTokenSymbol === "ETH")!;

  // 1. get quote
  const bridgeQuoteRes = await sdk.actions.getQuote({
    route,
    inputAmount: parseEther("0.01"),
    recipient: account,
  });

  return bridgeQuoteRes;
}

async function bridge(
  quote: Awaited<ReturnType<typeof getQuote>>,
  library: any,
  account: string | undefined,
) {
  if (!account) return;

  const walletClient = createWalletClient({
    account: toAccount(account as Address),
    chain: mainnet,
    transport: custom(library.provider),
  });

  const { request } = await sdk.actions.simulateDepositTx({
    walletClient,
    deposit: quote.deposit,
  });

  const transactionHash = await walletClient.writeContract(request);

  return transactionHash;
}

export function Bridge() {
  const { account, library } = useEthers();
  const [quote, setQuote] = useState<Quote>();
  const [txHash, setTxHash] = useState<Hash>();
  const [destinationBlock, setDestinationBlock] = useState<bigint>();
  const [depositData, setDepositData] = useState<DepositStatus>();
  const [fillData, setFillData] = useState<FillStatus>();

  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingFill, setLoadingFill] = useState(false);

  async function handleQuote() {
    if (!account) return;
    const quote = await getQuote(account as Address);
    setQuote(quote);
  }

  async function handleBridge() {
    if (!quote || !account) return;
    const destinationBlock = await sdk
      .getPublicClient(quote.deposit.destinationChainId)
      .getBlockNumber();

    const hash = await bridge(quote, library as any, account);
    setTxHash(hash);

    setDestinationBlock(destinationBlock);
  }

  const waitForDeposit = async (txHash: Hash, quote: Quote) => {
    setLoadingDeposit(true);
    //  wait for tx to be mined
    const data = await sdk.waitForDepositTx({
      transactionHash: txHash,
      chainId: quote.deposit.originChainId,
    });
    setLoadingDeposit(false);
    setDepositData(data);
  };

  useEffect(() => {
    if (txHash && quote) {
      waitForDeposit(txHash, quote);
    }
  }, [txHash, quote]);

  const waitForFill = async (
    deposit: DepositStatus,
    quote: Quote,
    destinationBlock: bigint,
  ) => {
    setLoadingFill(true);
    //  wait for tx to be filled
    const data = await sdk.actions.waitForFillTx({
      depositId: deposit.depositId,
      deposit: quote.deposit,
      fromBlock: destinationBlock,
    });
    setLoadingFill(false);
    setFillData(data);
  };

  useEffect(() => {
    if (depositData && quote && destinationBlock) {
      waitForFill(depositData, quote, destinationBlock);
    }
  }, [depositData, quote, destinationBlock]);

  return (
    <>
      <Button variant="filled" onClick={handleQuote}>
        get Quote
      </Button>
      {quote && (
        <details>
          <summary>Quote</summary>
          <pre>
            {JSON.stringify(
              quote,
              (_, v) => (typeof v === "bigint" ? v.toString() : v),
              2,
            )}
          </pre>
        </details>
      )}
      <Button variant="filled" onClick={handleBridge}>
        Bridge
      </Button>
      {!depositData && loadingDeposit && <h3>Waiting for deposit...</h3>}
      {depositData && (
        <details className="break-words max-w-full">
          <summary>Deposit Data</summary>
          <pre>
            {JSON.stringify(
              depositData,
              (_, v) => (typeof v === "bigint" ? v.toString() : v),
              2,
            )}
          </pre>
        </details>
      )}
      {!fillData && loadingFill && <h3>Waiting for fill...</h3>}
      {fillData && (
        <details>
          <summary>Fill Data</summary>
          <pre>
            {JSON.stringify(
              fillData,
              (_, v) => (typeof v === "bigint" ? v.toString() : v),
              2,
            )}
          </pre>
        </details>
      )}
    </>
  );
}
