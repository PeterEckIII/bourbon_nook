import { test as setup, expect } from '@playwright/test';

const authFile = 'src/test/e2e/.auth/user.json';

const userEmail = process.env.PLAYWRIGHT_USER_EMAIL;
const userPassword = process.env.PLAYWRIGHT_USER_PASSWORD;

if (!userEmail || !userPassword) {
  throw new Error(
    'PLAYWRIGHT_USER_EMAIL and PLAYWRIGHT_USER_PASSWORD must be set to run auth setup',
  );
}

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(userEmail);
  await page.getByLabel(/password/i).fill(userPassword);
  await page.getByRole('button', { name: /log in/i }).click();
  await expect(page).toHaveURL('/');

  await page.context().storageState({ path: authFile });
});
