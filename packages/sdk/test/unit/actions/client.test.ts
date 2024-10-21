import { describe, expect, test } from "vitest";
import { testClient } from "../../common/client";
import { DefaultLogger } from "../../../src";

describe("Initialize client", () => {
  test("Client configured correctly", () => {
    expect(testClient).to.not.be.undefined;
    expect(testClient.logger).toBeInstanceOf(DefaultLogger);
    expect(testClient.isTenderlyEnabled).toBe(false);
  });
});
