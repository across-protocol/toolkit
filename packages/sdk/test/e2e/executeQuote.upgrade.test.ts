import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { testnetTestClient } from "../common/sdk.js";
import {
  FillEventLog,
  getCurrentTimeSeconds,
  parseFillLogs,
  type Quote,
  type Route,
} from "../../src/index.js";
import {
  getAddress,
  parseEther,
  parseUnits,
  zeroAddress,
  type Hash,
} from "viem";

import { BLOCK_NUMBER_SEPOLIA } from "../common/constants.js";

import { waitForDepositAndFillV3_5 } from "../common/relayer.js";
import {
  testWalletSepolia,
  chainClientSepolia,
  publicClientSepolia,
} from "../common/anvil.js";
import { UpgradeTestEnvironment } from "../common/upgrade.2025.js";
import { fundWeth1, fundWeth2 } from "../common/utils.js";

const { spokePool1, spokePool2 } = UpgradeTestEnvironment;

// WETH Sepolia
const inputToken = {
  address: spokePool1.WETH.address,
  symbol: "WETH",
  name: "Wrapped Ethereum",
  decimals: spokePool1.WETH.decimals,
  logoUrl:
    "https://raw.githubusercontent.com/across-protocol/frontend/master/src/assets/token-logos/weth.svg",
} as const;

const inputAmount = 0.001;
const inputAmountBN = parseUnits(inputAmount.toString(), inputToken.decimals);

const route: Route = {
  originChainId: spokePool1.chainId,
  inputToken: spokePool1.WETH.address,
  destinationChainId: spokePool2.chainId,
  outputToken: spokePool2.WETH.address,
  inputTokenSymbol: "WETH",
  outputTokenSymbol: "WETH",
  isNative: false,
} as const;

// NON-Exclusive relayer test
const _deposit: Quote["deposit"] = {
  inputAmount: inputAmountBN,
  outputAmount: inputAmountBN,
  recipient: getAddress(testWalletSepolia.account.address),
  message: "0x",
  quoteTimestamp: getCurrentTimeSeconds(),
  exclusiveRelayer: zeroAddress,
  exclusivityDeadline: 0,
  spokePoolAddress: spokePool1.address,
  destinationSpokePoolAddress: spokePool2.address,
  originChainId: spokePool1.chainId,
  destinationChainId: spokePool2.chainId,
  inputToken: getAddress(route.inputToken),
  outputToken: getAddress(route.outputToken),
  isNative: route.isNative,
};

let approvalSimulationSuccess = false;
let approvalTxSuccess = false;
let depositSimulationSuccess = false;
let depositTxSuccess = false;
let fillTxSuccess = false;
let fillHash: Hash | undefined;
let fillLog: FillEventLog;

describe("executeQuote", async () => {
  describe("Executes a quote", async () => {
    afterAll(async () => {
      await chainClientSepolia.resetFork();
    });
    beforeAll(async () => {
      // sanity check that we have fresh anvil instances running in this case
      const blockNumberSepolia = await chainClientSepolia.getBlockNumber();
      expect(blockNumberSepolia).toBe(BLOCK_NUMBER_SEPOLIA);

      // fund depositor with WETH1 (input token)
      await fundWeth1({
        chainClient: chainClientSepolia,
        walletClient: testWalletSepolia,
        amount: parseEther("1"),
      });
      // fund relayer with WETH2 (outputToken)
      await fundWeth2({
        chainClient: chainClientSepolia,
        walletClient: chainClientSepolia,
        amount: parseEther("1"),
      });

      const latestBlock = await chainClientSepolia.getBlock({
        blockTag: "latest",
      });

      console.log("Latest block: ", latestBlock);

      // override quote timestamp
      const deposit = {
        ..._deposit,
        quoteTimestamp: Number(latestBlock.timestamp),
      };

      await new Promise((res, rej) => {
        testnetTestClient.executeQuote({
          deposit,
          walletClient: testWalletSepolia,
          // override publicClients because for some reason the configurePublicClients is not respecting the rpcUrls defined for each chain in anvil.ts
          originClient: publicClientSepolia,
          destinationClient: publicClientSepolia,
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
                const { txReceipt } = progress;
                const _fillHash = await waitForDepositAndFillV3_5({
                  depositReceipt: txReceipt,
                  acrossClient: testnetTestClient,
                  originPublicClient: publicClientSepolia,
                  destinationPublicClient: publicClientSepolia,
                  chainClient: chainClientSepolia,
                  spokePoolAddress: spokePool2.address,
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
        ? await publicClientSepolia.waitForTransactionReceipt({
            hash: fillHash,
          })
        : undefined;

      const _fillLog = fillReceipt && parseFillLogs(fillReceipt?.logs);
      fillLog = _fillLog;
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
        expect(getAddress(fillLog?.depositor!)).toBe(
          testWalletSepolia.account.address,
        );
      });
      test("Output amount correct", async () => {
        expect(fillLog?.outputAmount).toBe(_deposit.outputAmount);
      });
      test("Output token correct", async () => {
        expect(getAddress(fillLog?.outputToken!)).toBe(_deposit.outputToken);
      });
    });
  });
});
