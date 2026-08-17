import { test as setup, expect } from '@playwright/test';

const seedFile = 'src/test/e2e/.auth/follower.json';

const followerEmail = process.env.PLAYWRIGHT_FOLLOWER_EMAIL;
const followerPassword = process.env.PLAYWRIGHT_FOLLOWER_PASSWORD;
const testUserId = process.env.PLAYWRIGHT_USER_USER_ID;

if (!followerEmail || !followerPassword || !testUserId) {
  throw new Error(
    'PLAYWRIGHT_FOLLOWER_EMAIL, PLAYWRIGHT_FOLLOWER_PASSWORD, and PLAYWRIGHT_USER_USER_ID must be set to run seed setup',
  );
}

setup('seed', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(followerEmail);
  await page.getByLabel(/password/i).fill(followerPassword);
  await page.getByRole('button', { name: /log in/i }).click();
  await expect(page).toHaveURL('/');
  await page.request.post(`http://localhost:8082/users-api/follows/${testUserId}`);

  await page.context().storageState({ path: seedFile });
});
