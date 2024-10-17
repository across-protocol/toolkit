import { Address, Hex } from "viem";

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
  depositId: number;
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
      depositId,
      originChainId: BigInt(originChainId),
      updatedOutputAmount,
      updatedRecipient,
      updatedMessage,
    },
  } as const;
}
