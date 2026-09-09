import { describe, expect, test } from "vitest";
import { parseFillLogs } from "../../../src/actions/waitForFillTx.js";

describe("parseFillLogs", () => {
  test("returns undefined for an empty logs array", () => {
    expect(parseFillLogs([])).toBeUndefined();
  });

  test("returns undefined when logs contain no fill events", () => {
    const unrelatedLog = {
      address: "0x0000000000000000000000000000000000000001",
      blockHash:
        "0x1111111111111111111111111111111111111111111111111111111111111111",
      blockNumber: 1n,
      data: "0x",
      logIndex: 0,
      transactionHash:
        "0x2222222222222222222222222222222222222222222222222222222222222222",
      transactionIndex: 0,
      removed: false,
      topics: [],
    } as const;

    expect(parseFillLogs([unrelatedLog])).toBeUndefined();
  });
});
