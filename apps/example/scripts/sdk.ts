import { AcrossClient } from "@across-toolkit/sdk";
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
    integratorId: "TEST",
    logLevel: "DEBUG",
    walletClient,
    tenderly: {
      accessKey: process.env.TENDERLY_ACCESS_KEY!,
      accountSlug: process.env.TENDERLY_ACCOUNT_SLUG!,
      projectSlug: process.env.TENDERLY_PROJECT_SLUG!,
      simOnError: true,
    },
  });

  // do call to find info for displaying input/output tokens and destination chains
  // 1. populate UI
  const chainDetails = await client.utils.getSupportedChains({});

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
  const routeInfo = await client.actions.getAvailableRoutes({
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
  const bridgeQuoteRes = await client.actions.getQuote({
    route,
    inputAmount: parseUnits("1", usdc.decimals),
    recipient: account.address,
  });

  // 2. simulate/prep deposit tx
  const { request } = await client.actions.simulateDepositTx({
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
      chainId: bridgeQuoteRes.deposit.originChainId,
    });

    console.log("Deposit receipt: ", depositTxReceipt);
    console.log(`Deposit id #${depositId}`);

    console.log("Waiting for fill tx with args: ", {
      depositId,
      deposit: bridgeQuoteRes.deposit,
      fromBlock: destinationBlock,
    });

    // 5. OPTION 1 - watch events on destination chain

    const result = await client.actions.waitForFillTx({
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
          const result = await client.actions.getFillByDepositTx({
            depositId,
            depositTransactionHash: depositTxReceipt.transactionHash,
            deposit: bridgeQuoteRes.deposit,
            destinationChainId: bridgeQuoteRes.deposit.destinationChainId,
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
    const result = await client.actions.executeQuote({
      deposit: bridgeQuoteRes.deposit,
      onProgress: (progress) => {
        console.log("Progress: ", progress);
      },
      infiniteApproval: true,
    });
    console.log("Execute quote result: ", result);
  }

  /* ------------------------ test cross-chain message ------------------------ */
  console.log("\nTesting cross-chain message...");

  const arbitrumInfo = chainDetails.find(
    (chain) => chain.chainId === arbitrum.id,
  )!;

  const inputTokenDetails = arbitrumInfo.inputTokens.find(
    (token) => token.symbol === "DAI",
  )!;
  const routes = await client.actions.getAvailableRoutes({
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

  const quoteRes = await client.actions.getQuote({
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
          updateCallData: (outputAmount: bigint) =>
            generateApproveCallData({
              aaveAddress,
              depositAmount: outputAmount,
            }),
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
          updateCallData: (outputAmount: bigint) =>
            generateDepositCallDataForAave({
              userAddress,
              depositAmount: outputAmount,
              depositCurrency,
              aaveReferralCode,
            }),
        },
      ],
      fallbackRecipient: "0x924a9f036260DdD5808007E1AA95f08eD08aA569",
    },
  });
  console.log(quoteRes);

  // simulate deposit tx - should fail
  const { request: simulateDepositTxRequest } =
    await client.actions.simulateDepositTx({
      walletClient,
      deposit: quoteRes.deposit,
    });
  console.log("Simulation result:", simulateDepositTxRequest);
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
