import { test, expect } from '@playwright/test';

test('profile page shows follower/following counts', async ({ page }) => {
  await page.goto('/profile');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/testuser/i);
  await expect(page.getByRole('list', { name: /followers/i })).toBeVisible();
});

test('unauthenticated user is redirected to /login', async ({ browser }) => {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();
  await page.goto('/profile');
  await expect(page).toHaveURL(/\/login\?redirect=%2Fprofile/);
});
