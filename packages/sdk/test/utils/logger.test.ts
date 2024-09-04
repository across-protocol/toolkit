import { expect, test, vi } from "vitest";
import { AcrossClient } from "../../src/client";

const client = AcrossClient.create({
  useTestnet: true,
  integratorId: "TEST_ID",
  logLevel: "WARN",
});

const consoleErrorSpy = vi.spyOn(console, "error");
const consoleWarnSpy = vi.spyOn(console, "warn");
const consoleDebugSpy = vi.spyOn(console, "debug");

test("Lower log level not logged", () => {
  client.log.error("Should not be logged");

  expect(consoleErrorSpy).not.toHaveBeenCalled();
});

test("Equal log level is logged", () => {
  client.log.warn("Should be logged");

  expect(consoleWarnSpy).toHaveBeenCalled();
});

test("Higher log level is logged", () => {
  client.log.debug("Should be logged");

  expect(consoleDebugSpy).toHaveBeenCalled();
});
