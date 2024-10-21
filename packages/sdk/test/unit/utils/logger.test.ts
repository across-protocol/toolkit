import { expect, test, vi } from "vitest";
import { testClient } from "../../common/client";

test("Higher severity is logged", () => {
  const consoleLogSpy = vi.spyOn(console, "log");
  testClient.logger.error("Should be logged");

  expect(consoleLogSpy).toHaveBeenCalled();
});

test("Equal severity is logged", () => {
  const consoleLogSpy = vi.spyOn(console, "log");
  testClient.logger.warn("Should be logged");

  expect(consoleLogSpy).toHaveBeenCalled();
});

test("Lower severity is not logged", () => {
  const consoleLogSpy = vi.spyOn(console, "log");
  testClient.logger.debug("Should not be logged");

  expect(consoleLogSpy).not.toHaveBeenCalled();
});
