import { concat, Hex, toHex } from "viem";

export const DOMAIN_CALLDATA_DELIMITER = "0x1dc0de";

export function tagIntegratorId(integratorId: string, txData: Hex) {
  return concat([txData, DOMAIN_CALLDATA_DELIMITER, toHex(integratorId)]);
}

export function getIntegratorDataSuffix(integratorId: string) {
  return concat([DOMAIN_CALLDATA_DELIMITER, toHex(integratorId)]);
}
