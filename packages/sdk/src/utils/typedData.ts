import { Address, Hex } from "viem";
import { addressToBytes32 } from "./hex.js";

/**
 * @deprecated Use `getUpdateDepositTypedDataV3_5` instead.
 */
export function getUpdateDepositTypedData({
  signerAddress,
  originChainId,
  depositId,
  updatedMessage,
  updatedOutputAmount,
  updatedRecipient,
}: {
  signerAddress: Address;
  originChainId: number;
  depositId: bigint | number;
  updatedOutputAmount: bigint;
  updatedRecipient: Address;
  updatedMessage: Hex;
}) {
  return {
    account: signerAddress,
    domain: {
      name: "ACROSS-V2",
      version: "1.0.0",
      chainId: originChainId,
    },
    types: {
      UpdateDepositDetails: [
        { name: "depositId", type: "uint32" },
        { name: "originChainId", type: "uint256" },
        { name: "updatedOutputAmount", type: "uint256" },
        { name: "updatedRecipient", type: "address" },
        { name: "updatedMessage", type: "bytes" },
      ],
    },
    primaryType: "UpdateDepositDetails",
    message: {
      depositId: Number(depositId),
      originChainId: BigInt(originChainId),
      updatedOutputAmount,
      updatedRecipient,
      updatedMessage,
    },
  } as const;
}

export function getUpdateDepositTypedDataV3_5({
  signerAddress,
  originChainId,
  depositId,
  updatedMessage,
  updatedOutputAmount,
  updatedRecipient,
}: {
  signerAddress: Address;
  originChainId: number | bigint;
  depositId: number | bigint;
  updatedOutputAmount: bigint;
  updatedRecipient: Address;
  updatedMessage: Hex;
}) {
  return {
    account: signerAddress,
    domain: {
      name: "ACROSS-V2",
      version: "1.0.0",
      chainId: Number(originChainId),
    },
    types: {
      UpdateDepositDetails: [
        { name: "depositId", type: "uint256" },
        { name: "originChainId", type: "uint256" },
        { name: "updatedOutputAmount", type: "uint256" },
        { name: "updatedRecipient", type: "bytes32" },
        { name: "updatedMessage", type: "bytes" },
      ],
    },
    primaryType: "UpdateDepositDetails",
    message: {
      depositId: BigInt(depositId),
      originChainId: BigInt(originChainId),
      updatedOutputAmount,
      updatedRecipient: addressToBytes32(updatedRecipient),
      updatedMessage,
    },
  } as const;
}
