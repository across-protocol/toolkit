import { getAvailableRoutes } from "../../../src/actions/getAvailableRoutes.js";
import { MAINNET_API_URL } from "../../../src/constants/index.js";
import { buildSearchParams } from "../../../src/utils/fetch.js";
import { describe, expect, test } from "vitest";
import { checkFields } from "../../common/utils.js";
import {
  AvailableRoutesApiResponse,
  routeSchema,
} from "../../../src/api/available-routes.js";

const params = {
  originChainId: 1,
  originTokenSymbol: "WETH",
  destinationTokenSymbol: "WETH",
  destinationChainId: 10,
} as const;

describe("available-routes", async () => {
  // first test the raw response from the API.
  // This should fail if any breaking changes are introduced upstream
  test("Response json matches expected schema", async () => {
    const response = await fetch(
      `${MAINNET_API_URL}/available-routes?${buildSearchParams(params)}`,
    ).then((res) => res.json());

    const validated = routeSchema.safeParse(response);

    if (validated.error) {
      validated.error.errors.forEach((e) => console.log(e));
    }

    expect(validated.success).toBe(true);
  });

  test("All values propagate", async () => {
    // check that ALL FIELDS PROPAGATE
    const [parsed, raw] = await Promise.all([
      getAvailableRoutes({
        apiUrl: MAINNET_API_URL,
        ...params,
      }),
      fetch(
        `${MAINNET_API_URL}/available-routes?${buildSearchParams(params)}`,
      ).then((res) => res.json()),
    ]);

    const renamedFields = {
      originToken: "inputToken",
      destinationToken: "outputToken",
      originTokenSymbol: "inputTokenSymbol",
      destinationTokenSymbol: "outputTokenSymbol",
    };

    const compareRawWithParsed = checkFields(
      (raw as AvailableRoutesApiResponse)[0],
      parsed[0],
      renamedFields,
    );
    expect(compareRawWithParsed).toBe(true);
  });
});
