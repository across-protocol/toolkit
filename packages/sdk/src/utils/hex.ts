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
  if (!isHex(address)) {
    throw new Error("Invalid hex input");
  }

  if (address.length === 66) {
    // Address is already 32 bytes
    return address as Hex;
  }

  if (!isAddress(address)) {
    throw new Error("Invalid Address, cannot convert to bytes32");
  }

  const padded = padHex(address, { dir: "left", size: 32 });
  return padded;
}

// if SVM 32bytes address, return full address.
// If EVM address padded to 32 bytes, return truncated address (20 bytes)
// This function does not encode SVM addresses back into base58
export function bytes32ToAddress(hex: Hex): Address | Hex {
  if (!isHex(hex)) {
    throw new Error("Invalid hex input");
  }

  if (hex.length !== 66) {
    throw new Error("Hex string must be 32 bytes");
  }

  // Check if the first 12 bytes (24 hex characters) are padding (zeros)
  const padding = hex.slice(2, 26);
  const isPadded = /^0{24}$/.test(padding);

  if (isPadded) {
    const addressHex = `0x${hex.slice(-40)}`;

    if (!isAddress(addressHex)) {
      throw new Error("Invalid address extracted from bytes32");
    }

    return addressHex;
  }

  // Return the full bytes32 if not padded (SVM addresses)
  return hex;
}
