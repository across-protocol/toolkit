import { getSuggestedFees } from "../../../src/actions/getSuggestedFees.js";
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
} as const;

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
});
