import { Address, concat, Hex, isAddress, isHex, padHex } from "viem";

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

export function addressToBytes32(address: Address): Hex {
  if (!isAddress(address)) {
    throw new Error("Invalid Address, cannot convert to bytes32");
  }

  const padded = padHex(address, { dir: "left", size: 32 });
  return padded;
}

export function bytes32ToAddress(hex: Hex): Address {
  if (!isHex(hex)) {
    throw new Error("Invalid hex input");
  }

  if (hex.length !== 66) {
    throw new Error("Hex string must be 32 bytes");
  }

  const addressHex = `0x${hex.slice(-40)}`;

  if (!isAddress(addressHex)) {
    throw new Error("Invalid address extracted from bytes32");
  }

  return addressHex;
}
