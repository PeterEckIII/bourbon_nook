import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    include: [`./app/**/unit/*.test.{ts,tsx}`],
    exclude: [`./app/**/integration/*.test.{ts,tsx}`],
    setupFiles: ["./tests/setup.unit.ts"],
  },
});
