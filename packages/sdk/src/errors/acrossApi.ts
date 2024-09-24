export type AcrossErrorCodeType = keyof typeof AcrossErrorCode;

// TODO: These error codes should be sourced automatically from the Across API
// See https://github.com/across-protocol/frontend-v2/blob/b4ce24f4be6b4f305d3874c8d9368cd39d1b5d92/api/_errors.ts
export const AcrossErrorCode = {
  // Status: 40X
  INVALID_PARAM: "INVALID_PARAM",
  MISSING_PARAM: "MISSING_PARAM",
  SIMULATION_ERROR: "SIMULATION_ERROR",
  AMOUNT_TOO_LOW: "AMOUNT_TOO_LOW",
  AMOUNT_TOO_HIGH: "AMOUNT_TOO_HIGH",
  ROUTE_NOT_ENABLED: "ROUTE_NOT_ENABLED",

  // Status: 50X
  UPSTREAM_RPC_ERROR: "UPSTREAM_RPC_ERROR",
  UPSTREAM_HTTP_ERROR: "UPSTREAM_HTTP_ERROR",
} as const;
