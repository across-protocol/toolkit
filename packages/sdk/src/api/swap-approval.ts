import z from "zod";
import {
  ethereumAddress,
  bigNumberString,
  positiveInteger,
  positiveIntString,
  positiveFloatString,
  booleanString,
  stringOrStringArray,
} from "./validators.js";

// Request schema
export const baseSwapQueryParamsSchema = z.object({
  amount: positiveIntString,
  tradeType: z.enum(["minOutput", "exactOutput", "exactInput"]).optional(),
  inputToken: ethereumAddress,
  outputToken: ethereumAddress,
  originChainId: positiveIntString,
  destinationChainId: positiveIntString,
  depositor: ethereumAddress,
  recipient: ethereumAddress.optional(),
  integratorId: z.string().optional(),
  refundAddress: ethereumAddress.optional(),
  refundOnOrigin: booleanString.optional(),
  slippage: positiveFloatString(0.5).optional(), // max. 50% slippage
  skipOriginTxEstimation: booleanString.optional(),
  excludeSources: stringOrStringArray.optional(),
  includeSources: stringOrStringArray.optional(),
  appFee: positiveFloatString(1).optional(),
  appFeeRecipient: ethereumAddress.optional(),
  strictTradeType: booleanString.optional(),
});

const actionArgSchema = z.object({
  value: z.unknown(), // will be validated at runtime
  populateDynamically: z.boolean().optional(),
  balanceSourceToken: ethereumAddress.optional(),
});

const recursiveArgArraySchema = z.union([
  z.array(actionArgSchema),
  actionArgSchema,
]);

const actionSchema = z.object({
  target: ethereumAddress,
  functionSignature: z.string().optional().default(""),
  isNativeTransfer: z.boolean().optional().default(false),
  args: recursiveArgArraySchema.default([]),
  value: z.union([bigNumberString, z.bigint()]).default(0n),
  populateCallValueDynamically: z.boolean().optional(),
});

// Response schema components
const feeComponentSchema = z.object({
  amount: bigNumberString,
  amountUsd: z.string(),
  pct: z.string(),
  token: z.object({
    address: ethereumAddress,
    symbol: z.string(),
    decimals: positiveInteger,
    chainId: positiveInteger,
  }),
});

const gasFeeSchema = z.object({
  amount: bigNumberString,
  amountUsd: z.string(),
  token: z.object({
    address: ethereumAddress,
    symbol: z.string(),
    decimals: positiveInteger,
    chainId: positiveInteger,
  }),
});

const gasFeeWithPctSchema = gasFeeSchema.extend({
  pct: z.string(),
});

const swapStepSchema = z.object({
  tokenIn: z.object({
    address: ethereumAddress,
    symbol: z.string(),
    decimals: positiveInteger,
    chainId: positiveInteger,
  }),
  tokenOut: z.object({
    address: ethereumAddress,
    symbol: z.string(),
    decimals: positiveInteger,
    chainId: positiveInteger,
  }),
  inputAmount: bigNumberString,
  outputAmount: bigNumberString,
  minOutputAmount: bigNumberString,
  maxInputAmount: bigNumberString,
  swapProvider: z.object({
    name: z.string(),
    sources: z.array(z.string()),
  }),
});

const bridgeStepSchema = z.object({
  inputAmount: bigNumberString,
  outputAmount: bigNumberString,
  tokenIn: z.object({
    address: ethereumAddress,
    symbol: z.string(),
    decimals: positiveInteger,
    chainId: positiveInteger,
    name: z.string().optional(),
  }),
  tokenOut: z.object({
    address: ethereumAddress,
    symbol: z.string(),
    decimals: positiveInteger,
    chainId: positiveInteger,
    name: z.string().optional(),
  }),
  fees: z.object({
    totalRelay: z.object({
      pct: z.string(),
      total: bigNumberString,
    }),
    relayerCapital: z.object({
      pct: z.string(),
      total: bigNumberString,
    }),
    relayerGas: z.object({
      pct: z.string(),
      total: bigNumberString,
    }),
    lp: z.object({
      pct: z.string(),
      total: bigNumberString,
    }),
  }),
});

const allowanceCheckSchema = z.object({
  token: ethereumAddress,
  spender: ethereumAddress,
  actual: bigNumberString,
  expected: bigNumberString,
});

const balanceCheckSchema = z.object({
  token: ethereumAddress,
  actual: bigNumberString,
  expected: bigNumberString,
});

const swapTxSchema = z.object({
  simulationSuccess: z.boolean(),
  chainId: positiveInteger,
  to: ethereumAddress,
  data: z.string(),
  value: bigNumberString.optional(),
  gas: bigNumberString.optional(),
  maxFeePerGas: bigNumberString.optional(),
  maxPriorityFeePerGas: bigNumberString.optional(),
});

const eip712Schema = z.object({
  domain: z.object({
    name: z.string(),
    version: z.string(),
    chainId: positiveInteger,
    verifyingContract: ethereumAddress,
  }),
  types: z.record(
    z.array(
      z.object({
        name: z.string(),
        type: z.string(),
      }),
    ),
  ),
  value: z.record(z.any()),
});

const permitSwapTxSchema = z.object({
  swapTx: swapTxSchema,
  eip712: eip712Schema,
});

// Main response schema
export const swapApprovalResponseSchema = z.object({
  crossSwapType: z.string(),
  amountType: z.string(),
  checks: z.object({
    allowance: allowanceCheckSchema,
    balance: balanceCheckSchema,
  }),
  approvalTxns: z
    .array(
      z.object({
        chainId: positiveInteger,
        to: ethereumAddress,
        data: z.string(),
      }),
    )
    .optional(),
  steps: z.object({
    originSwap: swapStepSchema.optional(),
    bridge: bridgeStepSchema,
    destinationSwap: swapStepSchema.optional(),
  }),
  inputToken: z.object({
    address: ethereumAddress,
    symbol: z.string(),
    decimals: positiveInteger,
    chainId: positiveInteger,
    name: z.string().optional(),
  }),
  outputToken: z.object({
    address: ethereumAddress,
    symbol: z.string(),
    decimals: positiveInteger,
    chainId: positiveInteger,
    name: z.string().optional(),
  }),
  refundToken: z.object({
    address: ethereumAddress,
    symbol: z.string(),
    decimals: positiveInteger,
    chainId: positiveInteger,
    name: z.string().optional(),
  }),
  fees: z.object({
    total: feeComponentSchema,
    originGas: gasFeeSchema,
    destinationGas: gasFeeWithPctSchema,
    relayerCapital: feeComponentSchema,
    lpFee: feeComponentSchema,
    relayerTotal: feeComponentSchema,
    app: feeComponentSchema,
  }),
  inputAmount: bigNumberString,
  expectedOutputAmount: bigNumberString,
  minOutputAmount: bigNumberString,
  expectedFillTime: positiveInteger,
  swapTx: z.union([swapTxSchema, permitSwapTxSchema]).optional(),
  id: z.string().optional(),
});

export type BaseSwapQueryParams = z.infer<typeof baseSwapQueryParamsSchema>;
export type SwapApprovalApiResponse = z.infer<
  typeof swapApprovalResponseSchema
>;
export type Action = z.infer<typeof actionSchema>;
