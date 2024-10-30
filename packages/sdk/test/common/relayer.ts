import type { Hash, TransactionReceipt } from "viem";
import {
  getDepositFromLogs,
  type AcrossClient,
  type ConfiguredPublicClient,
} from "../../src";
import type { ChainClient } from "./anvil";
import { spokePoolAbi } from "../../src/abis/SpokePool";

type RelayerParams = {
  depositReceipt: TransactionReceipt;
  acrossClient: AcrossClient;
  originPublicClient: ConfiguredPublicClient;
  destinationPublicClient: ConfiguredPublicClient;
  chainClient: ChainClient;
};

// ACROSS RELAYER MOCK
// waits for deposit TX to succeed, then performs the fill on the destination chain.
export async function waitForDepositAndFill({
  depositReceipt,
  acrossClient,
  originPublicClient,
  destinationPublicClient,
  chainClient,
}: RelayerParams) {
  const destinationSpokepoolAddress = await acrossClient.getSpokePoolAddress(
    destinationPublicClient.chain.id,
  );

  const deposit = getDepositFromLogs({
    originChainId: originPublicClient.chain.id,
    receipt: depositReceipt,
  });

  if (!deposit) {
    throw new Error("Unable to parse deposit logs");
  }

  const { request } = await destinationPublicClient.simulateContract({
    address: destinationSpokepoolAddress,
    abi: spokePoolAbi,
    functionName: "fillV3Relay",
    args: [
      { ...deposit, originChainId: BigInt(originPublicClient.chain.id) },
      BigInt(destinationPublicClient.chain.id),
    ],
    account: chainClient.account.address,
  });

  return await chainClient.writeContract(request);
}
