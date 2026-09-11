import { percentageString } from "../../../src/api/validators.js";
import {
  getSuggestedFees,
  GetSuggestedFeesParams,
  parseSuggestedFees,
} from "../../../src/actions/getSuggestedFees.js";
import { suggestedFeesResponseJsonSchema } from "../../../src/api/suggested-fees.js";
import { MAINNET_API_URL } from "../../../src/constants/index.js";
import { buildSearchParams } from "../../../src/utils/fetch.js";
import { describe, expect, test } from "vitest";
import { checkFields } from "../../common/utils.js";

const params = {
  originChainId: 1,
  inputToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  outputToken: "0x4200000000000000000000000000000000000006",
  destinationChainId: 10,
  amount: "2000000000000000000",
  allowUnmatchedDecimals: true,
} as const satisfies GetSuggestedFeesParams;

describe("suggested-fees", async () => {
  // first test the raw response from the API.
  // This should fail if any breaking changes are introduced upstream
  test("Response json matches expected schema", async () => {
    const response = await fetch(
      `${MAINNET_API_URL}/suggested-fees?${buildSearchParams(params)}`,
    ).then((res) => res.json());

    const validated = suggestedFeesResponseJsonSchema.safeParse(response);

    if (validated.error) {
      validated.error.errors.forEach((e) => console.log(e));
    }

    expect(validated.success).toBe(true);
  });

  test("All values propagate", async () => {
    // check that ALL FIELDS PROPAGATE
    const [parsed, raw] = await Promise.all([
      getSuggestedFees({
        apiUrl: MAINNET_API_URL,
        ...params,
      }),
      fetch(
        `${MAINNET_API_URL}/suggested-fees?${buildSearchParams(params)}`,
      ).then((res) => res.json()),
    ]);

    const compareRawWithParsed = checkFields(raw, parsed);
    expect(compareRawWithParsed).toBe(true);
  });
  test("percentageString rejects decimal strings and accepts integer strings", () => {
    expect(percentageString.safeParse("0.5").success).toBe(false);
    expect(percentageString.safeParse("0.0005").success).toBe(false);
    expect(percentageString.safeParse("76950972772560").success).toBe(true);
    expect(percentageString.safeParse("0").success).toBe(true);
  });

  test("parseSuggestedFees safely converts decimal and integer pct fields to bigint", () => {
    const mockRaw: any = {
      outputAmount: "1999846098054454880",
      estimatedFillTimeSec: 3,
      capitalFeePct: "76875000000000",
      capitalFeeTotal: "153750000000000",
      relayGasFeePct: "75972772560",
      relayGasFeeTotal: "151945545120",
      relayFeePct: "76950972772560",
      relayFeeTotal: "153901945545120",
      lpFeePct: "0",
      timestamp: "1789091423",
      isAmountTooLow: false,
      quoteBlock: "25950980",
      exclusiveRelayer: "0xaD03abC6223e9DEf79B3Feb624F54303A372f0c7",
      exclusivityDeadline: 1789091551,
      spokePoolAddress: "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5",
      destinationSpokePoolAddress: "0x6f26Bf09B1C792e3228e5467807a900A503c0281",
      totalRelayFee: { pct: "0.5", total: "153901945545120" },
      relayerCapitalFee: { pct: "76875000000000", total: "153750000000000" },
      relayerGasFee: { pct: "75972772560", total: "151945545120" },
      lpFee: { pct: "0", total: "0" },
      limits: {
        minDeposit: "203996703413272",
        maxDeposit: "1143902177198408031000",
        maxDepositInstant: "41759844987637500165",
        maxDepositShortDelay: "1143902177198408031000",
        recommendedDepositInstant: "41759844987637500165",
      },
      fillDeadline: "1789098623",
      inputToken: {
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        symbol: "WETH",
        decimals: 18,
        chainId: 1,
      },
      outputToken: {
        address: "0x4200000000000000000000000000000000000006",
        symbol: "WETH",
        decimals: 18,
        chainId: 10,
      },
    };

    expect(() => parseSuggestedFees(mockRaw)).not.toThrow();
    const parsed = parseSuggestedFees(mockRaw);
    expect(parsed.totalRelayFee.pct).toBe(0n);
    expect(parsed.relayerCapitalFee.pct).toBe(76875000000000n);
  });
});
