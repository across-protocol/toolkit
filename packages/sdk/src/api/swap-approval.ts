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

export enum FeeDetailsType {
  TOTAL_BREAKDOWN = "total-breakdown",
  MAX_TOTAL_BREAKDOWN = "max-total-breakdown",
  ACROSS = "across",
}

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

const bridgeFeeDetailComponentSchema = z.object({
  amount: bigNumberString,
  pct: z.string(),
  token: z
    .object({
      address: ethereumAddress,
      symbol: z.string(),
      decimals: positiveInteger,
      chainId: positiveInteger,
      name: z.string().optional(),
    })
    .optional(),
  amountUsd: z.string().optional(),
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
    amount: bigNumberString,
    pct: z.string(),
    token: z.object({
      address: ethereumAddress,
      symbol: z.string(),
      decimals: positiveInteger,
      chainId: positiveInteger,
      name: z.string().optional(),
    }),
    details: z
      .object({
        type: z.nativeEnum(FeeDetailsType),
        relayerCapital: bridgeFeeDetailComponentSchema.optional(),
        destinationGas: bridgeFeeDetailComponentSchema.optional(),
        lp: bridgeFeeDetailComponentSchema.optional(),
      })
      .optional(),
  }),
  provider: z.string().optional(),
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
    total: feeComponentSchema.extend({
      details: z
        .object({
          type: z.nativeEnum(FeeDetailsType),
          swapImpact: feeComponentSchema.optional(),
          app: feeComponentSchema.optional(),
          bridge: feeComponentSchema
            .extend({
              details: z
                .object({
                  type: z.nativeEnum(FeeDetailsType),
                  lp: feeComponentSchema.optional(),
                  destinationGas: feeComponentSchema.optional(),
                  relayerCapital: feeComponentSchema.optional(),
                })
                .optional(),
            })
            .optional(),
        })
        .optional(),
    }),
    maxTotal: feeComponentSchema
      .extend({
        details: z
          .object({
            type: z.nativeEnum(FeeDetailsType),
            maxSwapImpact: feeComponentSchema.optional(),
            app: feeComponentSchema.optional(),
            bridge: feeComponentSchema
              .extend({
                details: z
                  .object({
                    type: z.nativeEnum(FeeDetailsType),
                    lp: feeComponentSchema.optional(),
                    destinationGas: feeComponentSchema.optional(),
                    relayerCapital: feeComponentSchema.optional(),
                  })
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
    originGas: gasFeeSchema,
  }),
  inputAmount: bigNumberString,
  maxInputAmount: bigNumberString.optional(),
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
