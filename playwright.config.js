import { defineConfig, devices } from "@playwright/test";
import process from "process";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  works: process.env.CI ? 1 : undefined,
  reporter: 'list',
  user: {
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
