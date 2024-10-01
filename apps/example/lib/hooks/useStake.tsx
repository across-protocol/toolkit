import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { useMinStake } from "./useMinStake";
import { useQueryClient } from "@tanstack/react-query";
import { parseUnits } from "viem";
import { STAKE_CONTRACT } from "../stake";
import { StakeTooSmallError } from "../errors";
import { useAcross } from "../across";

export function useStake() {
  const { minStake } = useMinStake();
  const { address } = useAccount();
  const sdk = useAcross();
  const currentChainId = useChainId();
  const queryClient = useQueryClient();
  const { switchChainAsync } = useSwitchChain();

  const { writeContractAsync } = useWriteContract();

  async function checkChain() {
    if (currentChainId !== STAKE_CONTRACT.chain.id) {
      await switchChainAsync({ chainId: STAKE_CONTRACT.chain.id });
    }
  }

  async function stake(amount: string) {
    if (minStake === undefined || !address) {
      throw new Error("Fetching data from contract...");
    }
    const value = parseUnits(amount, STAKE_CONTRACT.token.decimals);
    if (value < minStake) {
      throw new StakeTooSmallError();
    }
    await checkChain();
    // await sdk.actions.executeQuote();
  }
}
