import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Gives you describe, it, expect, etc. without importing
    globals: true,
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    setupFiles: ["./tests/setup.integration.ts"],
    include: ["./tests/**/*.test.{ts,tsx}"],
    exclude: ["./app/**/*.test.{ts,tsx}"],
  },
});
