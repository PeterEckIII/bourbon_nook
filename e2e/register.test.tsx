import { test, expect } from "@playwright/test";

test.describe("Register auth flow", () => {
  test("test", async ({ page }) => {
    await page.goto("http://localhost:3000/register");
    await page.getByLabel("Email").click();
    await page.getByLabel("Email").fill("mytest@gmail.com");
    await page.getByLabel("Email").press("Tab");
    await page.getByLabel("Username").fill("test_user1");
    await page.getByLabel("Username").press("Tab");
    await page.getByLabel("Password", { exact: true }).fill("password!");
    await page.getByLabel("Password", { exact: true }).press("Tab");
    await page.getByLabel("Confirm Password").fill("password!");
    await page.getByLabel("Confirm Password").press("Tab");
    await page.getByLabel("Remember me").check();
    await page.getByLabel("Remember me").press("Tab");
    await page.getByRole("button", { name: "Register" }).click();

    // await expect(page.url()).toBe("http://localhost:3000/");
  });
});
