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
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['src/test/e2e/**/*'],
    setupFiles: './src/test/integration/setup.ts',
    typecheck: { enabled: true },
    watch: false,
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**'],
      exclude: ['src/routeTree.gen.ts', 'src/main.tsx', 'src/api/generated/**'],
      thresholds: {
        statements: 50,
        branches: 40,
      },
    },
  },
});
