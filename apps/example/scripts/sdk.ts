import { AcrossClient } from "@across-toolkit/sdk";
import {
  encodeFunctionData,
  parseAbiItem,
  Address,
  Hex,
  createPublicClient,
  http,
  createWalletClient,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum, mainnet } from "viem/chains";
import { loadEnvConfig } from "@next/env";
import { sleep } from "@/lib/utils";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

//  test using client with node
async function main() {
  const chains = [mainnet, arbitrum];

  const publicClient = createPublicClient({
    chain: arbitrum,
    transport: http(),
  });

  const account = privateKeyToAccount(process.env.DEV_PK as Hex);

  const walletClient = createWalletClient({
    account,
    chain: arbitrum,
    transport: http(),
  });

  const client = AcrossClient.create({
    chains,
    useTestnet: false,
    integratorId: "TEST",
  });

  // available routes
  const routes = await client.actions.getAvailableRoutes({
    originChainId: arbitrum.id,
    destinationChainId: mainnet.id,
  })!;

  /* --------------------------- test normal bridge --------------------------- */
  console.log("Testing normal bridge...");
  const route = routes.find((r) => r.inputTokenSymbol === "ETH")!;
  console.log("Using route:", route);

  // 1. get quote
  const bridgeQuoteRes = await client.actions.getQuote({
    route,
    inputAmount: parseEther("0.01"),
    recipient: account.address,
  });
  console.log("Got quote:", bridgeQuoteRes);

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

  /* ------------------------ test cross-chain message ------------------------ */
  console.log("\nTesting cross-chain message...");
  const crossChainRoute = routes.find((r) => r.inputTokenSymbol === "DAI")!;
  console.log(crossChainRoute);

  // quote
  const inputAmount = 1000000000000000000000n;
  const userAddress = "0x924a9f036260DdD5808007E1AA95f08eD08aA569";
  // Aave v2 Lending Pool: https://etherscan.io/address/0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9
  const aaveAddress = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
  // DAI
  const depositCurrency = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
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
