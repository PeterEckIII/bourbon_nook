import { defineConfig, devices } from "@playwright/test";
import process from "process";

export default defineConfig({
  testDir: "./e2e",
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    baseUrl: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }
    },
    // {
    //   name: "firefox",
    //   use: { ...devices['Desktop Firefox'], channel: 'firefox' }
    // },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  }
})
