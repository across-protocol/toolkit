import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    cache: false,
    testTimeout: 180_000,
    globalSetup: ["./test/common/globalSetup.ts"],
    setupFiles: ["./test/mocks/setup.ts", "./test/common/setup.ts"],
  },
});
