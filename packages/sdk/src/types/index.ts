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
import { AcrossChain } from "../utils/getSupportedChains";

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
  updateCallData?: (outputAmount: bigint) => Hex;
  updateValue?: (outputAmount: bigint) => bigint;
  updateAsync?: (outputAmount: bigint) => Promise<{ callData: Hex; value: bigint }>;
  updateCallDataAsync?: (outputAmount: bigint) => Promise<Hex>;
  updateValueAsync?: (outputAmount: bigint) => Promise<bigint>;
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

export type Deposit = {
  inputToken: Address;
  outputToken: Address;
  inputAmount: bigint;
  outputAmount: bigint;
  originChainId: number;
  destinationChainId: number;
  depositId: number;
  quoteTimestamp: number;
  fillDeadline: number;
  exclusivityDeadline: number;
  depositor: Address;
  recipient: Address;
  exclusiveRelayer: Address;
  message: Hex;
  status: "pending" | "filled";
  depositTxHash: Hash;
  depositTxBlock: bigint;
  fillTxHash?: Hash;
  fillTxBlock?: bigint;
  actionSuccess?: boolean;
};

export type ChainInfoMap = Map<number, AcrossChain>;
