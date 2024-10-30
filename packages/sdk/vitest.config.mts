import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 180_000,
    hookTimeout: 180_000,
    environment: "node",
    reporters: "verbose",
    globalSetup: ["./test/common/globalSetup.ts"],
    setupFiles: ["./test/mocks/setup.ts", "./test/common/setup.ts"],
  },
});
