import { concat, Hex, isHex } from "viem";

export const DOMAIN_CALLDATA_DELIMITER = "0x1dc0de";

export function tagIntegratorId(integratorId: Hex, txData: Hex) {
  assertValidIntegratorId(integratorId);

  return concat([txData, DOMAIN_CALLDATA_DELIMITER, integratorId]);
}

export function getIntegratorDataSuffix(integratorId: Hex) {
  assertValidIntegratorId(integratorId);

  return concat([DOMAIN_CALLDATA_DELIMITER, integratorId]);
}

export function isValidIntegratorId(integratorId: string) {
  return (
    isHex(integratorId) &&
    // "0x" + 2 bytes = 6 hex characters
    integratorId.length === 6
  );
}

export function assertValidIntegratorId(
  integratorId: string,
): integratorId is Hex {
  if (!isValidIntegratorId(integratorId)) {
    throw new Error(
      `Invalid integrator ID: ${integratorId}. Needs to be 2 bytes hex string.`,
    );
  }

  return true;
}
