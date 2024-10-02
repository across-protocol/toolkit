import { useChains } from "wagmi";
import { useSupportedAcrossChains } from "./useSupportedAcrossChains";
import { reduceAcrossChains } from "../utils";

export function useAcrossChains() {
  const chains = useChains();
  const { supportedChains } = useSupportedAcrossChains({});

  // use only token data for chains we support
  if (chains?.length && supportedChains?.length) {
    return reduceAcrossChains(supportedChains, [...chains]);
  }
}
