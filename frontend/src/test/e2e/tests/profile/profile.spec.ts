import { test, expect } from '@playwright/test';

test.describe('Profile flow', () => {
  test('profile page shows follower/following counts', async ({ page }) => {
    await page.goto('/profile');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/testuser/i);
    await expect(page.getByRole('list', { name: /followers/i })).toBeVisible();
  });
});
