import {
  afterAll,
  assert,
  assertType,
  beforeAll,
  describe,
  expect,
  test,
} from "vitest";
import { mainnetTestClient as testClient } from "../common/sdk.js";
import {
  getMaxFillDeadline,
  parseDepositLogs,
  parseFillLogs,
  type Quote,
  type Route,
} from "../../src/index.js";
import { getAddress, parseEther, parseUnits } from "viem";
import {
  chainClientArbitrum,
  chainClientMainnet,
  publicClientArbitrum,
  publicClientMainnet,
  testWalletMainnet,
} from "../common/anvil.js";
import {
  BLOCK_NUMBER_ARBITRUM,
  BLOCK_NUMBER_MAINNET,
} from "../common/constants.js";
import { fundUsdc } from "../common/utils.js";
import { waitForDepositAndFillV3_5 } from "../common/relayer.js";

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
let depositLog: ReturnType<typeof parseDepositLogs> | undefined;
let fillLog: ReturnType<typeof parseFillLogs> | undefined;

describe("executeQuote", async () => {
  test("Gets available routes for intent", async () => {
    const [_route] = await testClient.getAvailableRoutes(testRoute);
    assert(_route !== undefined, "route is not defined");
    assertType<Route>(_route);
    console.log(_route);
    route = _route;
  });

  test("Gets a quote for a route", async () => {
    const _quote = await testClient.getQuote({
      route,
      inputAmount: inputAmountBN,
    });

    assert(_quote, "No quote for route");
    assertType<Quote>(_quote);
    console.log(_quote);
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
      await fundUsdc(
        chainClientMainnet,
        testWalletMainnet.account.address,
        route.originChainId,
      );

      const latestBlock = await chainClientMainnet.getBlock({
        blockTag: "latest",
      });

      // override the API's fill deadline to compensate for fork
      const maxFillDeadline = await getMaxFillDeadline(
        publicClientMainnet,
        quote.deposit.spokePoolAddress,
      );

      // override quote timestamp
      const deposit = {
        ...quote.deposit,
        fillDeadline: maxFillDeadline - 3600,
        quoteTimestamp: Number(latestBlock.timestamp),
      };

      await new Promise((res, rej) => {
        testClient.executeQuote({
          deposit,
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
              if (progress.status === "simulationError") {
                rej(false);
              }
              if (progress.status === "txSuccess") {
                depositTxSuccess = true;

                const { txReceipt, depositLog: _depositLog } = progress;
                depositLog = _depositLog;

                await waitForDepositAndFillV3_5({
                  depositReceipt: txReceipt,
                  acrossClient: testClient,
                  originPublicClient: publicClientMainnet,
                  destinationPublicClient: publicClientArbitrum,
                  chainClient: chainClientArbitrum,
                  exclusiveRelayer: deposit.exclusiveRelayer,
                }).catch((e) => rej(e));
              }
            }

            if (progress.step === "fill") {
              if (progress.status === "txSuccess") {
                const { fillLog: _fillLog } = progress;
                fillLog = _fillLog;
                fillTxSuccess = true;
                res(true);
              }

              if (progress.status === "simulationError") {
                console.log(progress.error);
                rej(false);
              }
            }

            if (progress.status === "error") {
              rej(false);
            }
          },
        });
      });
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

    describe("Deposit Logs", async () => {
      test("Deposit Log values", () => {
        expect(depositLog).toBeDefined();
      });
      test("Depositor address correct", () => {
        expect(getAddress(depositLog?.depositor ?? "")).toBe(
          testWalletMainnet.account.address,
        );
      });
      test("Output amount correct", () => {
        expect(depositLog?.outputAmount).toBe(quote.deposit.outputAmount);
      });
      test("Output token correct", () => {
        expect(getAddress(depositLog?.outputToken ?? "")).toBe(
          quote.deposit.outputToken,
        );
      });
    });

    test("Fill tx succeeds", async () => {
      expect(fillTxSuccess).toBe(true);
    });
    describe("Fill Logs", async () => {
      test("Fill Log defined", async () => {
        expect(fillLog).toBeDefined();
      });
      test("Depositor address correct", async () => {
        expect(getAddress(fillLog?.depositor ?? "")).toBe(
          testWalletMainnet.account.address,
        );
      });
      test("Output amount correct", async () => {
        expect(fillLog?.outputAmount).toBe(quote.deposit.outputAmount);
      });
      test("Output token correct", async () => {
        expect(getAddress(fillLog?.outputToken ?? "")).toBe(
          quote.deposit.outputToken,
        );
      });
    });
  });
});
