import {
  Account,
  Address,
  Chain,
  Hash,
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

export type ConfiguredPublicClientMap = Map<number, ConfiguredPublicClient>;

export type CrossChainAction = {
  target: Address;
  callData: Hex;
  value: Amount;
  update?: (outputAmount: bigint) => { callData: Hex; value: bigint };
};

export type IndexerStatusResponse = {
  error?: string;
  message?: string;
  status: "pending" | "filled";
  fillTx: null | Hash;
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

export type TokenInfo = {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl: string;
};
