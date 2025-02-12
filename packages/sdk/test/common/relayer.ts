import { type Address, type TransactionReceipt } from "viem";
import {
  getDepositFromLogs,
  type AcrossClient,
  type ConfiguredPublicClient,
} from "../../src/index.js";
import type { ChainClient } from "./anvil.js";
import { spokePoolAbiV3 } from "../../src/abis/SpokePool/index.js";
import { spokePoolAbiV3_5 } from "../../dist/abis/SpokePool/v3_5.js";
import { isAddressDefined } from "./utils.js";

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

  if (isAddressDefined(exclusiveRelayer)) {
    await chainClient.impersonateAccount({
      address: exclusiveRelayer,
    });
  }

  const deposit = getDepositFromLogs({
    originChainId: originPublicClient.chain.id,
    receipt: depositReceipt,
  });

  if (!deposit) {
    throw new Error("Unable to parse deposit logs");
  }

  const { request } = await destinationPublicClient.simulateContract({
    address: destinationSpokepoolAddress,
    abi: spokePoolAbiV3_5,
    functionName: "fillV3Relay",
    args: [
      {
        ...deposit,
        originChainId: BigInt(originPublicClient.chain.id),
        depositId: Number(deposit.depositId),
      },
      BigInt(destinationPublicClient.chain.id),
    ],
    account: isAddressDefined(exclusiveRelayer)
      ? exclusiveRelayer
      : chainClient.account.address,
  });

  return await chainClient.writeContract(request);
}

export async function waitForDepositAndFillV3({
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
    abi: spokePoolAbiV3,
    functionName: "fillV3Relay",
    args: [
      {
        ...deposit,
        originChainId: BigInt(originPublicClient.chain.id),
        depositId: Number(deposit.depositId),
      },
      BigInt(destinationPublicClient.chain.id),
    ],
    account: chainClient.account.address,
  });

  return await chainClient.writeContract(request);
}
