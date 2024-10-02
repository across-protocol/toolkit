import { CrossChainAction } from "@across-protocol/integrator-sdk";
import { Address, encodeFunctionData } from "viem";
import { optimism } from "viem/chains";

// For this example, we want to allow users to stake native ETH on our contract on Optimism.
export const routeConfig = {
  destinationTokenSymbol: "ETH", // for native tokens, use symbol instead of address to avoid WETH/ETH collisions
  destinationChainId: optimism.id,
} as const;

export const stakeToken = {
  address: "0x4200000000000000000000000000000000000006",
  symbol: "ETH",
  name: "Ether",
  decimals: 18,
  logoUrl:
    "https://raw.githubusercontent.com/across-protocol/frontend/master/src/assets/token-logos/eth.svg",
} as const;

export const StakerContractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "stakerAddress",
        type: "address",
      },
    ],
    name: "Stake",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "stakerAddress",
        type: "address",
      },
    ],
    name: "UnStake",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "stakerAddress",
        type: "address",
      },
    ],
    name: "getStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "stakerAddress",
        type: "address",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "stakes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const STAKE_CONTRACT = {
  address: "0x733Debf51574c70CfCdb7918F032E16F686bd9f8",
  chain: optimism,
  token: stakeToken,
  multicallHandler: "0x924a9f036260DdD5808007E1AA95f08eD08aA569",
  abi: StakerContractABI,
} as const;

export function generateStakeAction(
  userAddress: Address,
  value: bigint,
): CrossChainAction {
  return {
    target: STAKE_CONTRACT.address,
    callData: generateStakeCallData(userAddress),
    value,
  };
}

export function generateStakeCallData(userAddress: Address) {
  return encodeFunctionData({
    abi: STAKE_CONTRACT.abi,
    functionName: "stake",
    args: [userAddress],
  });
}
