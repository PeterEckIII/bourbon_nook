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
    include: ["./app/**/integration/*.test.{ts,tsx}"],
    exclude: ["./app/**/unit/*.test.{ts,tsx}"]
  },
});
