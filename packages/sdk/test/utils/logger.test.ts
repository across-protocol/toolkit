import { expect, test, vi } from "vitest";
import { AcrossClient } from "../../src/client";
import { hardhat } from "viem/chains";

const client = AcrossClient.create({
  useTestnet: true,
  logLevel: "WARN",
  chains: [hardhat],
});

test("Higher severity is logged", () => {
  const consoleLogSpy = vi.spyOn(console, "log");
  client.logger.error("Should be logged");

  expect(consoleLogSpy).toHaveBeenCalled();
});

test("Equal severity is logged", () => {
  const consoleLogSpy = vi.spyOn(console, "log");
  client.logger.warn("Should be logged");

  expect(consoleLogSpy).toHaveBeenCalled();
});

test("Lower severity is not logged", () => {
  const consoleLogSpy = vi.spyOn(console, "log");
  client.logger.debug("Should not be logged");

  expect(consoleLogSpy).not.toHaveBeenCalled();
});
