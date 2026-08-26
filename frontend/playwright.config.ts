import { existsSync } from 'node:fs';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

/* Read environment variables from .env, if present. */
const envPath = path.resolve(import.meta.dirname, '.env');
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/test/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:5173',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'register',
      testMatch: /register\.setup\.ts/,
    },
    {
      name: 'auth',
      testMatch: /auth\.setup\.ts/,
      dependencies: ['register'],
    },
    {
      name: 'seed',
      testMatch: /seed\.setup\.ts/,
      dependencies: ['register'],
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'src/test/e2e/data/.auth/testuser.json' },
      dependencies: ['auth', 'seed'],
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'src/test/e2e/data/.auth/testuser.json' },
      dependencies: ['auth', 'seed'],
    },

    // NOTE: Dropped webkit due to known limitation with secure cookies over HTTP
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     baseURL: 'https://localhost:5173',
    //     ignoreHTTPSErrors: true,
    //     storageState: 'src/test/e2e/.auth/testuser.json',
    //   },
    //   dependencies: ['auth', 'seed'],
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
