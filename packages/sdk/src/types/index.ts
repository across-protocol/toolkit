import {
  Account,
  Address,
  Chain,
  GetEventArgs,
  Hash,
  Hex,
  PublicClient,
  Transport,
  WalletClient,
} from "viem";
import { STATUS } from "../constants/index.js";
import { AcrossChain } from "../utils/getSupportedChains.js";
import { spokePoolAbiV3 } from "../abis/SpokePool/index.js";
import { NoNullValuesOfObject } from "../utils/index.js";

export type Status = keyof typeof STATUS;

export type Amount = string | bigint;

export type ConfiguredWalletClient = WalletClient<Transport, Chain, Account>;
export type ConfiguredPublicClient = PublicClient<Transport, Chain>;

export type ConfiguredPublicClientMap = Map<number, ConfiguredPublicClient>;

export type CrossChainAction = {
  target: Address;
  callData: Hex;
  value: Amount;
  update?:
    | ((outputAmount: bigint) => Promise<{ callData?: Hex; value?: bigint }>)
    | ((outputAmount: bigint) => { callData?: Hex; value?: bigint });
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

export type DepositLog = {
  inputToken: Address;
  outputToken: Address;
  inputAmount: bigint;
  outputAmount: bigint;
  destinationChainId: number;
  depositId: bigint;
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
};

export type Deposit = DepositLog & {
  originChainId: number;
  fillTxHash?: Hash;
  fillTxBlock?: bigint;
  actionSuccess?: boolean;
};

export type ChainInfoMap = Map<number, AcrossChain>;

type MaybeFilledV3RelayEvent = GetEventArgs<
  typeof spokePoolAbiV3,
  "FilledV3Relay",
  { IndexedOnly: false }
>;

type MaybeDepositV3Event = GetEventArgs<
  typeof spokePoolAbiV3,
  "V3FundsDeposited",
  { IndexedOnly: false }
>;
export type FilledV3RelayEvent = NoNullValuesOfObject<MaybeFilledV3RelayEvent>;
export type V3FundsDepositedEvent = NoNullValuesOfObject<MaybeDepositV3Event>;
