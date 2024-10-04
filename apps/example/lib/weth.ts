import { Amount } from "@across-protocol/app-sdk";
import { encodeFunctionData } from "viem";
import { optimism } from "viem/chains";

export const WethAbi = [
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "wad", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export function generateUnwrapCallData(wethAmount: Amount) {
  return encodeFunctionData({
    abi: WethAbi,
    functionName: "withdraw",
    args: [BigInt(wethAmount)],
  });
}

export const WETH_OPTIMISM = {
  chain: optimism,
  abi: WethAbi,
  token: {
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    logoUrl:
      "https://raw.githubusercontent.com/across-protocol/frontend/master/src/assets/token-logos/weth.svg",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  address: "0x4200000000000000000000000000000000000006",
} as const;
