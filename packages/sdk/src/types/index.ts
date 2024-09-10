import {
  Account,
  Address,
  Chain,
  Hex,
  PublicClient,
  Transport,
  WalletClient,
} from "viem";
import { STATUS } from "../constants";

export type Status = keyof typeof STATUS;

export type Amount = string | bigint;

export type ConfiguredWalletClient = WalletClient<Transport, Chain, Account>;
export type ConfiguredPublicClient = PublicClient<Transport, Chain>;

export type ConfiguredPublicClientMap = Record<string, ConfiguredPublicClient>;

export type CrossChainAction = {
  target: Address;
  callData: Hex;
  value: Amount;
  updateCallData?: (outputAmount: bigint) => Hex;
};

export type Route = {
  originChainId: number;
  inputToken: Address;
  destinationChainId: number;
  outputToken: Address;
  inputTokenSymbol: string;
  outputTokenSymbol: string;
  isNative: boolean;
};
