import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    include: [`./app/**/*.test.ts`],
    exclude: [`./tests/*.test.{ts,tsx}`],
    setupFiles: ["./tests/setup.unit.ts"],
  },
});
