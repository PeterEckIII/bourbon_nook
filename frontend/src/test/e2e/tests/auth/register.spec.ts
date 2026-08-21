import { test, expect } from '@playwright/test';

const userEmail = process.env.PLAYWRIGHT_USER_EMAIL;

if (!userEmail) {
  throw new Error('PLAYWRIGHT_USER_EMAIL must be set to run register e2e tests');
}

test.describe('Register flow', () => {
  test('new user can register', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    const unique = `${Date.now()}-${test.info().workerIndex}`;
    const email = `e2e-register-${unique}@bourbonnook-e2e.test`;
    const username = `e2e_register_${unique}`;
    const password = 'CorrectHorseBattery9';

    await page.goto('/register');

    // The email/username fields validate against the live backend on a
    // debounced async check; wait for both checks to actually complete before
    // submitting, rather than racing a click against in-flight validation.
    const emailChecked = page.waitForResponse((res) => res.url().includes('/auth/check-email'));
    const usernameChecked = page.waitForResponse((res) =>
      res.url().includes('/auth/check-username'),
    );
    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByLabel('Username').fill(username);
    await Promise.all([emailChecked, usernameChecked]);

    await page.getByLabel(/^Password/).fill(password);
    await page.getByLabel('Confirm Password').fill(password);

    await page.getByRole('button', { name: /register/i }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: /log out/i })).toBeVisible();

    // Real registrations are not covered by any fixture teardown, so clean up
    // directly via the API the way the browser session is already authenticated for.
    await page.request.delete('http://localhost:8082/users-api/auth/me', {
      data: { password },
    });
  });

  test('shows a live availability error for an already-registered email', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    const unique = `${Date.now()}-${test.info().workerIndex}`;

    await page.goto('/register');

    const emailChecked = page.waitForResponse((res) => res.url().includes('/auth/check-email'));
    await page.getByRole('textbox', { name: /email/i }).fill(userEmail);
    await emailChecked;

    await page.getByLabel('Username').fill(`e2e_register_${unique}`);
    await page.getByLabel(/^Password/).fill('CorrectHorseBattery9');
    await page.getByLabel('Confirm Password').fill('CorrectHorseBattery9');

    await expect(
      page.getByRole('alert').filter({ hasText: /email is already registered/i }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /register/i })).toBeDisabled();
  });
});
