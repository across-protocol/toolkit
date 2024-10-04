import { AcrossClient } from "@across-protocol/app-sdk";
import {
  encodeFunctionData,
  parseAbiItem,
  Address,
  Hex,
  http,
  createWalletClient,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum, mainnet, optimism } from "viem/chains";
import { loadEnvConfig } from "@next/env";
import { sleep } from "@/lib/utils";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

//  test using client with node
async function main() {
  const chains = [mainnet, arbitrum, optimism];

  const PRIVATE_KEY = process.env.DEV_PK
    ? (process.env.DEV_PK as Hex)
    : undefined;

  if (!PRIVATE_KEY) {
    throw new Error("No Private key in ENV");
  }

  // if in Node environment, running a script, we can just create a viem wallet client using the private key
  const account = privateKeyToAccount(PRIVATE_KEY);

  // for non-local accounts (eg. JsonRpcProvider in the browser) we can use this example

  // const convertedEthersAccount = toAccount(
  //   "0xD25f7e77386F9f797b64E878A3D060956de99163",
  // );

  const walletClient = createWalletClient({
    account,
    chain: optimism,
    transport: http(),
  });

  const client = AcrossClient.create({
    chains,
    useTestnet: false,
    logLevel: "DEBUG",
    walletClient,
    tenderly: {
      accessKey: process.env.TENDERLY_ACCESS_KEY!,
      accountSlug: process.env.TENDERLY_ACCOUNT_SLUG!,
      projectSlug: process.env.TENDERLY_PROJECT_SLUG!,
    },
  });

  // do call to find info for displaying input/output tokens and destination chains
  // 1. populate UI
  const chainDetails = await client.getSupportedChains({});

  // 2. choose origin chain, optimism in this example
  const originChain = optimism.id;

  const originChainDetails = chainDetails.find(
    (chain) => chain.chainId === originChain,
  );

  // 3. choose destination chain, mainnet in this example
  const destinationChainDetails = chainDetails.find(
    (chain) => chain.chainId === arbitrum.id,
  );

  // 4. select input token from dropdown
  const inputTokens = originChainDetails?.inputTokens;

  if (!inputTokens) {
    throw new Error("No input tokens on this chain");
  }
  const usdc = inputTokens.find((token) => token.symbol === "USDC")!;

  // 5. get routes
  const routeInfo = await client.getAvailableRoutes({
    originChainId: originChain,
    destinationChainId: destinationChainDetails?.chainId,
    originToken: usdc?.address,
  });

  // 6. select route
  const route = routeInfo[0];

  if (!route) {
    throw new Error("No routes");
  }
  /* --------------------------- test normal bridge --------------------------- */

  // 1. get quote
  const bridgeQuoteRes = await client.getQuote({
    route,
    inputAmount: parseUnits("1", usdc.decimals),
  });

  // 2. simulate/prep deposit tx
  const { request } = await client.simulateDepositTx({
    walletClient,
    deposit: bridgeQuoteRes.deposit,
  });
  console.log("Simulation result:", request);

  if (process.env.SEND_DEPOSIT_TX === "true") {
    // 3. sign and send tx
    const transactionHash = await walletClient.writeContract(request);

    console.log("Tx hash:", transactionHash);

    // get current block on destination chain
    const destinationBlock = await client
      .getPublicClient(bridgeQuoteRes.deposit.destinationChainId)
      .getBlockNumber();

    // 4. wait for tx to be mined
    const { depositTxReceipt, depositId } = await client.waitForDepositTx({
      transactionHash,
      originChainId: bridgeQuoteRes.deposit.originChainId,
    });

    console.log("Deposit receipt: ", depositTxReceipt);
    console.log(`Deposit id #${depositId}`);

    console.log("Waiting for fill tx with args: ", {
      depositId,
      deposit: bridgeQuoteRes.deposit,
      fromBlock: destinationBlock,
    });

    // 5. OPTION 1 - watch events on destination chain

    const result = await client.waitForFillTx({
      depositId,
      deposit: bridgeQuoteRes.deposit,
      fromBlock: destinationBlock,
    });

    if (result) {
      console.log("Fill tx timestamp", result.fillTxTimestamp);
      console.log("Fill Tx receipt", result.fillTxReceipt);
    }

    // 5. OPTION 2 - poll indexer and rpc, this method is better for historical lookups
    // ? This works as expected, usually rpc wins
    const pollIndexerAndRpc = async () => {
      let res = undefined;
      while (!res) {
        try {
          const result = await client.getFillByDepositTx({
            deposit: {
              ...bridgeQuoteRes.deposit,
              depositId,
              depositTxHash: depositTxReceipt.transactionHash,
            },
            fromBlock: destinationBlock,
          });
          if (!result.fillTxReceipt) {
            continue;
          }
          console.log("Fill tx timestamp", result.fillTxTimestamp);
          console.log("Fill Tx receipt", result.fillTxReceipt);
          res = result;
          break;
        } catch (e) {
          console.log(e);
          await sleep(3000);
        }
      }
    };
    // getFillOnLoop()
  }

  /* -------------------- test with `executeQuote` function ------------------- */
  if (process.env.USE_EXECUTE_QUOTE === "true") {
    console.log("\nExecuting quote via `executeQuote` function...");
    const result = await client.executeQuote({
      walletClient,
      deposit: bridgeQuoteRes.deposit,
      onProgress: (progress) => {
        console.log("Progress: ", progress);
      },
      infiniteApproval: true,
    });
    console.log("Execute quote result: ", result);
  }

  /* ------------------------------ test getDeposit/getFillByDepositTx ----------------------------- */
  const depositFilter = {
    originChainId: 42161,
    destinationChainId: 10,
  } as const;
  const depositByTxHash = await client.getDeposit({
    findBy: {
      ...depositFilter,
      depositTxHash:
        "0x23829af133a4993c5d2975dede6f503b8182ab426b18d626a0711455bb8dcf28",
    },
  });
  console.log("Deposit by tx hash", depositByTxHash);
  const depositById = await client.getDeposit({
    findBy: {
      ...depositFilter,
      depositId: 2525494,
    },
  });
  console.log("Deposit by id", depositById);

  /* ------------------------ test cross-chain message ------------------------ */
  console.log("\nTesting cross-chain message...");

  const arbitrumInfo = chainDetails.find(
    (chain) => chain.chainId === arbitrum.id,
  )!;

  const inputTokenDetails = arbitrumInfo.inputTokens.find(
    (token) => token.symbol === "DAI",
  )!;
  const routes = await client.getAvailableRoutes({
    originChainId: optimism.id,
    destinationChainId: arbitrum.id,
  });

  const crossChainRoute = routes.find(
    (route) => route.inputTokenSymbol === "DAI",
  )!;

  // quote
  const inputAmount = parseUnits("200", inputTokenDetails.decimals);
  const userAddress = "0x924a9f036260DdD5808007E1AA95f08eD08aA569";
  // Aave v2 Lending Pool: https://etherscan.io/address/0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9
  const aaveAddress = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
  // DAI
  const depositCurrency = inputTokenDetails.address;
  const aaveReferralCode = 0;

  const quoteRes = await client.getQuote({
    route: crossChainRoute,
    inputAmount,
    recipient: "0x924a9f036260DdD5808007E1AA95f08eD08aA569",
    crossChainMessage: {
      actions: [
        {
          target: depositCurrency,
          callData: generateApproveCallData({
            aaveAddress,
            depositAmount: inputAmount,
          }),
          value: 0n,
          update: (outputAmount: bigint) => {
            return {
              callData: generateApproveCallData({
                aaveAddress,
                depositAmount: outputAmount,
              }),
              value: 0n,
            };
          },
        },
        {
          target: aaveAddress,
          callData: generateDepositCallDataForAave({
            userAddress,
            depositAmount: inputAmount,
            depositCurrency,
            aaveReferralCode,
          }),
          value: 0n,
          update: (outputAmount: bigint) => {
            return {
              callData: generateDepositCallDataForAave({
                userAddress,
                depositAmount: outputAmount,
                depositCurrency,
                aaveReferralCode,
              }),
              value: 0n,
            };
          },
        },
      ],
      fallbackRecipient: "0x924a9f036260DdD5808007E1AA95f08eD08aA569",
    },
  });
  console.log(quoteRes);

  try {
    await client.getLimits({
      inputToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      outputToken: "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
      originChainId: 1,
      destinationChainId: 59144,
      amount: "1000000000000000",
      message:
        "0xdbf42570000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000008800000000000000000000000000000000000000000000000000000000066e3f627000000000000000000000000d5e23607d5d73ff2293152f464c3cab005f8769600000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000004200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000e5d7c2a44ffddf6b295a15c148167daaaf5cf34f00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000002470a08231000000000000000000000000d5e23607d5d73ff2293152f464c3cab005f876960000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000007c825e560ae6d6643115096b4b61e8f8d6a1974900000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000024b6b55f2500000000000000000000000000000000000000000000000000038d7ea4c68000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000007c825e560ae6d6643115096b4b61e8f8d6a1974900000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000002470a08231000000000000000000000000d5e23607d5d73ff2293152f464c3cab005f876960000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000007c825e560ae6d6643115096b4b61e8f8d6a19749000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      recipient: "0xd5E23607D5d73ff2293152f464C3caB005f87696",
      relayer: "0x07aE8551Be970cB1cCa11Dd7a11F47Ae82e70E67",
    });
  } catch (e) {
    console.log("Fill simulation error", e);
  }

  try {
    // simulate deposit tx - should fail
    const { request: simulateDepositTxRequest } =
      await client.simulateDepositTx({
        walletClient,
        deposit: quoteRes.deposit,
      });
    console.log("Simulation result:", simulateDepositTxRequest);
  } catch (e) {
    console.log("Deposit simulation error", e);
  }
}
main();

function generateApproveCallData({
  aaveAddress,
  depositAmount,
}: {
  aaveAddress: Address;
  depositAmount: bigint;
}) {
  const approveCallData = encodeFunctionData({
    abi: [parseAbiItem("function approve(address spender, uint256 value)")],
    args: [aaveAddress, depositAmount],
  });

  return approveCallData;
}

function generateDepositCallDataForAave({
  userAddress,
  depositAmount,
  depositCurrency,
  aaveReferralCode,
}: {
  userAddress: Address;
  depositAmount: bigint;
  depositCurrency: Address;
  aaveReferralCode: number;
}) {
  return encodeFunctionData({
    abi: [
      parseAbiItem(
        "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
      ),
    ],
    args: [depositCurrency, depositAmount, userAddress, aaveReferralCode],
  });
}
