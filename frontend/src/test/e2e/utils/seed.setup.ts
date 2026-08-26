import { test as setup, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { gotoWithRetry } from './navigation';

const seedFile = 'src/test/e2e/data/.auth/follower.json';

const followerEmail = process.env.PLAYWRIGHT_FOLLOWER_EMAIL;
const followerPassword = process.env.PLAYWRIGHT_FOLLOWER_PASSWORD;

if (!followerEmail || !followerPassword) {
  throw new Error(
    'PLAYWRIGHT_FOLLOWER_EMAIL and PLAYWRIGHT_FOLLOWER_PASSWORD must be set to run seed setup',
  );
}

setup('seed', async ({ page }) => {
  // Read lazily, inside the test body: Playwright loads/parses every test
  // file (including this module-level code) up front during test discovery,
  // before any project's setup body actually runs -- reading the file at
  // module scope races the `register` project actually writing it and
  // always loses. Dependency order only guarantees test *body* ordering.
  const testUserId = process.env.CI
    ? (JSON.parse(readFileSync('src/test/e2e/data/.auth/ci-user.json', 'utf-8'))
        .testUserId as string)
    : process.env.PLAYWRIGHT_USER_USER_ID;

  if (!testUserId) {
    throw new Error(
      'Either the register step must have run (CI) or PLAYWRIGHT_USER_USER_ID must be set (local) to run seed setup',
    );
  }

  await gotoWithRetry(page, '/login');
  await page.getByLabel(/email/i).fill(followerEmail);
  await page.getByLabel(/password/i).fill(followerPassword);
  await page.getByRole('button', { name: /log in/i }).click();
  await expect(page).toHaveURL('/');
  await page.request.post(`http://localhost:8082/users-api/follows/${testUserId}`);

  await page.context().storageState({ path: seedFile });
});
