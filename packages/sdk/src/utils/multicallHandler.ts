import { Address, encodeAbiParameters, parseAbiParameters } from "viem";

import { CrossChainAction } from "../types/index.js";
import { multicallHandlerDeployments } from "../constants/multicall-handler.js";

export type BuildMessageParams = {
  fallbackRecipient: Address;
  actions: CrossChainAction[];
};

export function getMultiCallHandlerAddress(chainId: number): Address {
  const defaultAddress = "0x924a9f036260DdD5808007E1AA95f08eD08aA569";
  const deployments = multicallHandlerDeployments;
  return deployments?.[chainId]?.address ?? defaultAddress;
}

export function buildMulticallHandlerMessage(params: BuildMessageParams) {
  const instructionsAbiParams = parseAbiParameters(
    "((address target, bytes callData, uint256 value)[], address fallbackRecipient)",
  );
  return encodeAbiParameters(instructionsAbiParams, [
    [
      params.actions.map(({ target, callData, value }) => ({
        target,
        callData,
        value: BigInt(value),
      })),
      params.fallbackRecipient,
    ],
  ]);
}

export const MulticallHandlerAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "index", type: "uint256" },
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint256", name: "value", type: "uint256" },
        ],
        internalType: "struct MulticallHandler.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "CallReverted",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "index", type: "uint256" },
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint256", name: "value", type: "uint256" },
        ],
        internalType: "struct MulticallHandler.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "InvalidCall",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint256", name: "value", type: "uint256" },
        ],
        indexed: false,
        internalType: "struct MulticallHandler.Call[]",
        name: "calls",
        type: "tuple[]",
      },
      {
        indexed: true,
        internalType: "address",
        name: "fallbackRecipient",
        type: "address",
      },
    ],
    name: "CallsFailed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DrainedTokens",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint256", name: "value", type: "uint256" },
        ],
        internalType: "struct MulticallHandler.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "attemptCalls",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address payable", name: "destination", type: "address" },
    ],
    name: "drainLeftoverTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "bytes", name: "message", type: "bytes" },
    ],
    name: "handleV3AcrossMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
] as const;
