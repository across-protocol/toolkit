import { AcrossClient } from "@across-protocol/app-sdk";
import {
  Hex,
  http,
  createWalletClient,
  parseUnits,
  createPublicClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia, baseSepolia } from "viem/chains";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

//  test using client with node
async function main() {
  const chains = [sepolia, baseSepolia];

  const PRIVATE_KEY = process.env.DEV_PK
    ? (process.env.DEV_PK as Hex)
    : undefined;

  if (!PRIVATE_KEY) {
    throw new Error("No Private key in ENV");
  }

  // Read RPC URLs from environment variables
  const ORIGIN_RPC_URL = process.env.ORIGIN_RPC_URL ;
  const DESTINATION_RPC_URL = process.env.DESTINATION_RPC_URL;

  // Create a viem wallet client using the private key
  const account = privateKeyToAccount(PRIVATE_KEY);
  console.log("Account address: ", account.address);

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: ORIGIN_RPC_URL ? http(ORIGIN_RPC_URL) : http(),
  });

  const client = AcrossClient.create({
    chains,
    useTestnet: true,
    logLevel: "ERROR",
    walletClient,
  });

  const routeInfo = await client.getAvailableRoutes({
    originChainId: sepolia.id,
    destinationChainId: baseSepolia.id,
    originToken: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // ETH
  });

  // Select route
  console.log(routeInfo);
  const route = routeInfo[1]; // isNative route

  if (!route) {
    throw new Error("No routes");
  }

  const bridgeQuoteRes = await client.getQuote({
    route,
    inputAmount: parseUnits("0.00015", 18),
  });
  console.log(bridgeQuoteRes);

  const originClient = createPublicClient({
    chain: sepolia,
    transport: ORIGIN_RPC_URL ? http(ORIGIN_RPC_URL) : http(),
  });

  const destinationClient = createPublicClient({
    chain: baseSepolia,
    transport: DESTINATION_RPC_URL ? http(DESTINATION_RPC_URL) : http(),
  });

  const result = await client.executeQuote({
    walletClient,
    deposit: bridgeQuoteRes.deposit,
    originClient: originClient as any,
    destinationClient: destinationClient as any,
    onProgress: (progress) => {
      if (progress.step === "approve" && progress.status === "txSuccess") {
        // if approving an ERC20, you have access to the approval receipt
        const { txReceipt } = progress;
        console.log("Approve successful: ", txReceipt);
      }
      if (progress.step === "deposit" && progress.status === "txSuccess") {
        // once deposit is successful you have access to depositId and the receipt
        const { depositId, txReceipt } = progress;
        console.log("Deposit with id: ", depositId);
        console.log("Deposit Transaction Hash: ", txReceipt.transactionHash);
      }
      if (progress.step === "fill" && progress.status === "txSuccess") {
        // if the fill is successful, you have access the following data
        const { fillTxTimestamp, txReceipt, actionSuccess } = progress;
        console.log("Fill Transaction Hash: ", txReceipt.transactionHash);
        console.log("Action success: ", actionSuccess);
        // actionSuccess is a boolean flag, telling us if your cross chain messages were successful
      }
    },
    infiniteApproval: false,
    skipWaitingForFill: true,
  });
}
main();
