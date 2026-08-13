import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vite-plus';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      disableLogging: true,
    }),
    react(),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    typecheck: { enabled: true },
    watch: false,
    globals: true,
  },
});
