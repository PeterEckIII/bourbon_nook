import { test, expect } from '@playwright/test';

const userEmail = process.env.PLAYWRIGHT_CHANGE_PASSWORD_EMAIL;
const existingPassword = process.env.PLAYWRIGHT_CHANGE_PASSWORD_CURRENT_PASSWORD;
const newPassword = process.env.PLAYWRIGHT_CHANGE_PASSWORD_NEW_PASSWORD;

if (!userEmail || !existingPassword || !newPassword) {
  throw new Error(
    'PLAYWRIGHT_CHANGE_PASSWORD_EMAIL, PLAYWRIGHT_CHANGE_PASSWORD_CURRENT_PASSWORD, and PLAYWRIGHT_CHANGE_PASSWORD_NEW_PASSWORD must be set to run change-password.spec.ts',
  );
}

test.describe('Change password flow', () => {
  // This test mutates one fixed, real account's password in place. Running it
  // on multiple browser projects concurrently races two instances against
  // that same account, so it's restricted to a single project.
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Mutates a shared real account; only needs to run on one project.',
  );

  test('Successfully changes the password', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    try {
      await page.goto('/login');
      await page.getByRole('textbox', { name: /email/i }).fill(userEmail);
      await page.getByLabel('Password').fill(existingPassword);
      await page
        .getByRole('button')
        .filter({ hasText: /log in/i })
        .click();
      await expect(page).toHaveURL('/');

      await page.goto('/profile');
      await page
        .getByRole('link')
        .filter({ hasText: /change password/i })
        .click();
      await expect(page).toHaveURL('/profile/change-password');

      await page.getByLabel('Current Password').fill(existingPassword);
      await page.getByLabel('New Password').fill(newPassword);
      const confirmPassword = page.getByLabel('Confirm Password');
      await confirmPassword.fill(newPassword);
      await confirmPassword.blur();

      const changePasswordButton = page.getByRole('button').filter({ hasText: /change password/i });
      await expect(changePasswordButton).toBeEnabled();

      const [response] = await Promise.all([
        page.waitForResponse((resp) => resp.url().includes('/auth/change-password')),
        changePasswordButton.click(),
      ]);
      expect(response.status()).toBe(200);

      const oldLoginAttempt = await page.request.post(
        'http://localhost:8082/users-api/auth/login',
        { data: { email: userEmail, password: existingPassword } },
      );

      expect(oldLoginAttempt.status()).toBe(401);

      const newLoginAttempt = await page.request.post(
        'http://localhost:8082/users-api/auth/login',
        { data: { email: userEmail, password: newPassword } },
      );

      expect(newLoginAttempt.status()).toBe(200);

      await expect(page).toHaveURL('/profile');
    } finally {
      // revert back to existing password to make it idempotent
      await page.request.post('http://localhost:8082/users-api/auth/change-password', {
        data: {
          oldPassword: newPassword,
          newPassword: existingPassword,
          confirmPassword: existingPassword,
        },
      });
    }
  });
});
