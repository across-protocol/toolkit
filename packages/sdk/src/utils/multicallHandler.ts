import { Address, encodeAbiParameters, parseAbiParameters } from "viem";

import { CrossChainAction } from "../types";

export type BuildMessageParams = {
  fallbackRecipient: Address;
  actions: CrossChainAction[];
};

export function getMultiCallHandlerAddress(chainId: number) {
  // @todo: use sdk or API to source addresses?
  const defaultAddress = "0x924a9f036260DdD5808007E1AA95f08eD08aA569";
  switch (chainId) {
    case 324:
      return "0x863859ef502F0Ee9676626ED5B418037252eFeb2";
    case 59144:
      return "0x1015c58894961F4F7Dd7D68ba033e28Ed3ee1cDB";
    default:
      return defaultAddress;
  }
}

export function buildMulticallHandlerMessage(params: BuildMessageParams) {
  const instructionsAbiParams = parseAbiParameters(
    "((address target, bytes callData, uint256 value)[], address fallbackRecipient)"
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
