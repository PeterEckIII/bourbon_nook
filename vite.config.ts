import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { remixDevTools } from "remix-development-tools";
import TurboConsole from "vite-plugin-turbo-console";

installGlobals();

export default defineConfig({
  plugins: [
    TurboConsole(),
    remixDevTools({
      pluginDir: "./plugins",
    }),
    remix(),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
  },
});
