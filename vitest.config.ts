import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Gives you describe, it, expect, etc. without importing
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./tests/setup.unit.ts"],
    include: [
      // Include app *test.(ts|tsx) files (components)
      "./app/**/*.test.{ts,tsx}",
    ],
    // Ignore integration tests
    exclude: ["./app/**/integration/*.test.{ts,tsx}"],
  },
});
