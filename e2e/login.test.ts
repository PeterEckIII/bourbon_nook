import { expect, test } from "@playwright/test";

test("should login with valid credentials", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await expect(page).toHaveTitle("Login | Bourbon Nook");
  const email = page.getByLabel("Email");
  const password = page.getByLabel("Password");
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();

  await email.fill("jpeckiii@gmail.com");
  await password.fill("");
  await page.getByRole("button", { name: "Login" }).click();

  expect(await page.url()).toBe("http://localhost:3000/bottles");
});
