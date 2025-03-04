import {
  maxUint256,
  parseEther,
  type Address,
  type TransactionReceipt,
} from "viem";
import {
  addressToBytes32,
  getDepositFromLogs,
  simulateApproveTx,
  type AcrossClient,
  type ConfiguredPublicClient,
} from "../../src/index.js";
import type { ChainClient } from "./anvil.js";
import { spokePoolAbiV3_5 } from "../../src/abis/SpokePool/v3_5.js";
import {
  fundUsdc,
  getUsdcBalance,
  isAddressDefined,
  toV3RelayData,
} from "./utils.js";

type RelayerParams = {
  depositReceipt: TransactionReceipt;
  acrossClient: AcrossClient;
  originPublicClient: ConfiguredPublicClient;
  destinationPublicClient: ConfiguredPublicClient;
  chainClient: ChainClient;
  spokePoolAddress?: Address;
  exclusiveRelayer?: Address;
};

// ACROSS RELAYER MOCK
// waits for deposit TX to succeed, then performs the fill on the destination chain.
export async function waitForDepositAndFillV3_5({
  depositReceipt,
  acrossClient,
  originPublicClient,
  destinationPublicClient,
  chainClient,
  spokePoolAddress,
  exclusiveRelayer,
}: RelayerParams) {
  const destinationSpokepoolAddress =
    spokePoolAddress ??
    (await acrossClient.getSpokePoolAddress(destinationPublicClient.chain.id));

  const deposit = getDepositFromLogs({
    originChainId: originPublicClient.chain.id,
    receipt: depositReceipt,
  });

  if (!deposit) {
    throw new Error("Unable to parse deposit logs");
  }

  const relayerAddress = isAddressDefined(exclusiveRelayer)
    ? exclusiveRelayer
    : chainClient.account.address;

  await chainClient.setBalance({
    address: relayerAddress,
    value: parseEther("1"),
  });

  // fund relayer with USDC on destination chain
  await fundUsdc(
    chainClient,
    relayerAddress,
    destinationPublicClient?.chain?.id,
  );

  const v3RelayData = toV3RelayData(deposit);

  const args = [
    v3RelayData,
    BigInt(destinationPublicClient.chain.id),
    addressToBytes32(relayerAddress),
  ] as const;

  console.log("Simulating fill approval...");

  await chainClient.impersonateAccount({
    address: relayerAddress,
  });

  const [ethBalance, usdcBalance] = await Promise.all([
    destinationPublicClient.getBalance({ address: relayerAddress }),
    getUsdcBalance(relayerAddress, destinationPublicClient),
  ]);

  console.log("ethBalance", ethBalance);
  console.log("usdcBalance", usdcBalance);

  const { request: approveRequest } = await simulateApproveTx({
    walletClient: chainClient,
    publicClient: destinationPublicClient,
    spender: destinationSpokepoolAddress,
    approvalAmount: maxUint256,
    tokenAddress: v3RelayData.outputToken,
  });

  console.log("Approving...");

  const approveTxHash = await chainClient.writeContract({
    account: chainClient.account,
    ...approveRequest,
  });

  console.log("Waiting for approval to be mined...");

  const fillApprovalReceipt =
    await destinationPublicClient.waitForTransactionReceipt({
      hash: approveTxHash,
    });

  console.log("Fill Approval Success!", fillApprovalReceipt);
  console.log("Doing Fill...");

  const { request } = await destinationPublicClient.simulateContract({
    address: destinationSpokepoolAddress,
    abi: spokePoolAbiV3_5,
    functionName: "fillRelay",
    args,
    account: relayerAddress,
  });

  return await chainClient.writeContract(request);
}
