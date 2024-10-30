import {
  afterAll,
  assert,
  assertType,
  beforeAll,
  describe,
  expect,
  test,
} from "vitest";
import { testClient } from "../common/sdk";
import {
  type FilledV3RelayEvent,
  type Quote,
  type Route,
} from "../../src/index";
import { parseEther, parseEventLogs, parseUnits, type Hash } from "viem";
import {
  chainClientArbitrum,
  chainClientMainnet,
  publicClientArbitrum,
  publicClientMainnet,
  testWalletMainnet,
} from "../common/anvil";
import {
  BLOCK_NUMBER_ARBITRUM,
  BLOCK_NUMBER_MAINNET,
} from "../common/constants";
import { fundUsdc } from "../common/utils";
import { waitForDepositAndFill } from "../common/relayer";
import { spokePoolAbi } from "../../src/abis/SpokePool";

const inputToken = {
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6,
  logoUrl:
    "https://raw.githubusercontent.com/across-protocol/frontend/master/src/assets/token-logos/usdc.svg",
} as const;

const inputAmount = 100;
const inputAmountBN = parseUnits(inputAmount.toString(), inputToken.decimals);

// MAINNET => ARBITRUM
const testRoute = {
  originChainId: 1,
  destinationChainId: 42161,
  originToken: inputToken.address,
} as const;

let route: Route;
let quote: Quote;

let approvalSimulationSuccess = false;
let approvalTxSuccess = false;
let depositSimulationSuccess = false;
let depositTxSuccess = false;
let fillTxSuccess = false;
let fillHash: Hash | undefined;
let fillLog: FilledV3RelayEvent | undefined;

describe("executeQuote", async () => {
  test("Gets available routes for intent", async () => {
    const [_route] = await testClient.getAvailableRoutes(testRoute);
    assert(_route !== undefined, "route is not defined");
    assertType<Route>(_route);
    route = _route;
  });

  test("Gets a quote for a route", async () => {
    const _quote = await testClient.getQuote({
      route,
      inputAmount: inputAmountBN,
    });

    assert(_quote, "No quote for route");
    assertType<Quote>(_quote);
    quote = _quote;
  });

  describe("Executes a quote", async () => {
    afterAll(async () => {
      await Promise.all([
        chainClientArbitrum.resetFork(),
        chainClientMainnet.resetFork(),
      ]);
    });
    beforeAll(async () => {
      // sanity check that we have fresh anvil instances running in this case
      const blockNumberArbitrum = await chainClientArbitrum.getBlockNumber();
      expect(blockNumberArbitrum).toBe(BLOCK_NUMBER_ARBITRUM);
      const blockNumberMainnet = await chainClientMainnet.getBlockNumber();
      expect(blockNumberMainnet).toBe(BLOCK_NUMBER_MAINNET);

      // fund test client and wallet clients with 1 ETH
      await Promise.all([
        chainClientMainnet.setBalance({
          address: chainClientMainnet.account.address,
          value: parseEther("1"),
        }),
        chainClientArbitrum.setBalance({
          address: chainClientArbitrum.account.address,
          value: parseEther("1"),
        }),
        chainClientMainnet.setBalance({
          address: testWalletMainnet.account.address,
          value: parseEther("1"),
        }),
      ]);

      // fund test wallet clients with 1000 USDC
      await fundUsdc(chainClientMainnet, testWalletMainnet.account.address);

      const latestBlock = await chainClientMainnet.getBlock({
        blockTag: "latest",
      });

      // override quote timestamp
      const deposit = {
        ...quote.deposit,
        quoteTimestamp: Number(latestBlock.timestamp),
      };

      await new Promise((res, rej) => {
        testClient.executeQuote({
          deposit: deposit,
          walletClient: testWalletMainnet,
          // override publicClients because for some reason the configurePublicClients is not respecting the rpcUrls defined for each chain in anvil.ts
          originClient: publicClientMainnet,
          destinationClient: publicClientArbitrum,
          infiniteApproval: true,
          onProgress: async (progress) => {
            console.log(progress);

            if (progress.step === "approve") {
              if (progress.status === "simulationSuccess") {
                approvalSimulationSuccess = true;
              }
              if (progress.status === "txSuccess") {
                approvalTxSuccess = true;
              }
            }

            if (progress.step === "deposit") {
              if (progress.status === "simulationSuccess") {
                depositSimulationSuccess = true;
              }
              if (progress.status === "txSuccess") {
                depositTxSuccess = true;
                const { txReceipt } = progress;
                const _fillHash = await waitForDepositAndFill({
                  depositReceipt: txReceipt,
                  acrossClient: testClient,
                  originPublicClient: publicClientMainnet,
                  destinationPublicClient: publicClientArbitrum,
                  chainClient: chainClientArbitrum,
                });

                fillHash = _fillHash;
              }
            }

            if (progress.step === "fill") {
              if (progress.status === "txSuccess") {
                fillTxSuccess = true;
                res(true);
              }
            }

            if (progress.status === "error") {
              rej(false);
            }
          },
        });
      });

      const fillReceipt = fillHash
        ? await publicClientArbitrum.waitForTransactionReceipt({
            hash: fillHash,
          })
        : undefined;

      const _fillLog = parseEventLogs({
        abi: spokePoolAbi,
        eventName: "FilledV3Relay",
        logs: fillReceipt?.logs!,
      });
      fillLog = _fillLog[0]?.args;
    });

    test("Deposit approval simulation succeeds", async () => {
      expect(approvalSimulationSuccess).toBe(true);
    });
    test("Deposit approval tx succeeds", async () => {
      expect(approvalTxSuccess).toBe(true);
    });
    test("Deposit simulation succeeds", async () => {
      expect(depositSimulationSuccess).toBe(true);
    });
    test("Deposit tx succeeds", async () => {
      expect(depositTxSuccess).toBe(true);
    });

    test("Fill tx succeeds", async () => {
      expect(fillTxSuccess).toBe(true);
    });
    describe("Fill Logs", async () => {
      test("Fill Log defined", async () => {
        expect(fillLog).toBeDefined();
      });
      test("Depositor address correct", async () => {
        expect(fillLog?.depositor).toBe(testWalletMainnet.account.address);
      });
      test("Output amount correct", async () => {
        expect(fillLog?.outputAmount).toBe(quote.deposit.outputAmount);
      });
      test("Output token correct", async () => {
        expect(fillLog?.outputToken).toBe(quote.deposit.outputToken);
      });
    });
  });
});
