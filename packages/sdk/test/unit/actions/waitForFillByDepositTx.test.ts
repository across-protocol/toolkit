import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  waitForFillByDepositTx,
  DEFAULT_WAIT_FOR_FILL_TIMEOUT_MS,
} from "../../../src/actions/getFillByDepositTx.js";
import { WaitForFillTimeoutError } from "../../../src/errors/index.js";
import type { PublicClient } from "viem";

describe("waitForFillByDepositTx", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("indexer unavailable")),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("rejects with WaitForFillTimeoutError when no fill appears before timeout", async () => {
    const destinationChainClient = {
      pollingInterval: 20,
      getLogs: vi.fn().mockResolvedValue([]),
      getTransactionReceipt: vi.fn(),
      getBlock: vi.fn(),
    } as unknown as PublicClient;

    await expect(
      waitForFillByDepositTx({
        deposit: {
          depositId: 42n,
          originChainId: 1,
          destinationChainId: 10,
          destinationSpokePoolAddress:
            "0x0000000000000000000000000000000000000001",
          message: "0x",
        },
        destinationChainClient,
        indexerUrl: "http://127.0.0.1:9",
        timeout: 80,
        pollingInterval: 20,
        logger: {
          error: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
          info: vi.fn(),
        },
      }),
    ).rejects.toBeInstanceOf(WaitForFillTimeoutError);
  });

  test("exports a finite default timeout so callers are not left polling forever", () => {
    expect(DEFAULT_WAIT_FOR_FILL_TIMEOUT_MS).toBeGreaterThan(0);
    expect(DEFAULT_WAIT_FOR_FILL_TIMEOUT_MS).toBe(300_000);
  });
});
