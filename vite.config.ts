import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { remixDevTools } from "remix-development-tools";
import istanbul from "vite-plugin-istanbul";

installGlobals();

export default defineConfig({
  plugins: [
    remixDevTools({
      pluginDir: "./plugins",
    }),
    remix(),
    tsconfigPaths(),
  ],
  server: {
    open: true,
    port: 3000,
  },
});
