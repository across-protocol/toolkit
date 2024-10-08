import { expect, test, vi } from "vitest";
import { testSDK } from "./_utils";

test("Higher severity is logged", () => {
  const consoleLogSpy = vi.spyOn(console, "log");
  testSDK.logger.error("Should be logged");

  expect(consoleLogSpy).toHaveBeenCalled();
});

test("Equal severity is logged", () => {
  const consoleLogSpy = vi.spyOn(console, "log");
  testSDK.logger.warn("Should be logged");

  expect(consoleLogSpy).toHaveBeenCalled();
});

test("Lower severity is not logged", () => {
  const consoleLogSpy = vi.spyOn(console, "log");
  testSDK.logger.debug("Should not be logged");

  expect(consoleLogSpy).not.toHaveBeenCalled();
});
