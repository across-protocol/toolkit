import { Address, Hex } from "viem";

export type Amount = string | bigint;

export type CrossChainAction = {
  target: Address;
  callData: Hex;
  value: Amount;
  updateCallData?: (outputAmount: bigint) => Hex;
};
