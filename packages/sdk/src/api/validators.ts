import { z } from "zod";

export const positiveInteger = z.number().int().nonnegative();

// 20 bytes
export const ethereumAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
  message: "Invalid Ethereum address format",
});

export const bigNumberString = z.string().regex(/^-?\d+$/, {
  message: "Invalid BigNumber string format",
});

export const percentageString = z.string().regex(/^\d+(\.\d+)?$/, {
  message: "Invalid percentage string format",
});

export const numericString = z.string().regex(/^\d+$/, {
  message: "Invalid numeric string format",
});

export const positiveIntString = z.string().regex(/^\d+$/, {
  message: "Invalid positive integer string format",
});

export const positiveFloatString = (max: number) => z.string().regex(/^\d+(\.\d+)?$/, {
  message: "Invalid positive float string format",
}).refine(val => parseFloat(val) <= max, {
  message: `Value must be <= ${max}`,
});

export const booleanString = z.string().regex(/^(true|false)$/, {
  message: "Invalid boolean string format",
});

export const stringOrStringArray = z.union([z.array(z.string()), z.string()]);
