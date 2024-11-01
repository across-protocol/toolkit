import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/index.ts"],
  format: "esm",
  dts: true,
  outDir: "dist",
  clean: true,
  target: "esnext",
  sourcemap: true,
  treeshake: true,
});
