import { test, expect } from "playwright-test-coverage";

test("home page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page).toHaveTitle("Bourbon Nook");
});
