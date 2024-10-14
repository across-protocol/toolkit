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

type CrossChainBase = {
  target: Address;
  callData: Hex;
  value: Amount;
};

// This convoluted type ensures we restrict some update functions
type UpdateBothOption =
  | {
      update: (outputAmount: bigint) => { callData: Hex; value: bigint };
      updateAsync?: undefined;
      updateValue?: undefined;
      updateValueAsync?: undefined;
      updateCallData?: undefined;
      updateCallDataAsync?: undefined;
    }
  | {
      updateAsync: (
        outputAmount: bigint,
      ) => Promise<{ callData: Hex; value: bigint }>;
      update?: undefined;
      updateValue?: undefined;
      updateValueAsync?: undefined;
      updateCallData?: undefined;
      updateCallDataAsync?: undefined;
    };

type UpdateValueOption =
  | {
      updateValue: (outputAmount: bigint) => bigint;
      updateValueAsync?: undefined;
    }
  | {
      updateValueAsync: (outputAmount: bigint) => Promise<bigint>;
      updateValue?: undefined;
    }
  | {
      updateValue?: undefined;
      updateValueAsync?: undefined;
    };

type UpdateCallDataOption =
  | {
      updateCallData: (outputAmount: bigint) => Hex;
      updateCallDataAsync?: undefined;
    }
  | {
      updateCallDataAsync: (outputAmount: bigint) => Promise<Hex>;
      updateCallData?: undefined;
    }
  | {
      updateCallData?: undefined;
      updateCallDataAsync?: undefined;
    };

export type CrossChainAction =
  | (CrossChainBase & UpdateBothOption)
  | (CrossChainBase & {
      update?: undefined;
      updateAsync?: undefined;
    } & UpdateValueOption &
      UpdateCallDataOption);

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
