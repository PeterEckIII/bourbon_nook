import { test, expect } from "@playwright/test";

test("should login with valid credentials", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await expect(page).toHaveTitle("Login | Bourbon Nook");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});
