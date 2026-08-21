import { test, expect } from '@playwright/test';

const userEmail = process.env.PLAYWRIGHT_USER_EMAIL;
const userPassword = process.env.PLAYWRIGHT_USER_PASSWORD;

if (!userEmail || !userPassword) {
  throw new Error(
    'PLAYWRIGHT_USER_EMAIL and PLAYWRIGHT_USER_PASSWORD must be set to run auth setup',
  );
}

test.describe('Login flow', () => {
  test('Existing user can log in', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    await page.goto('/login');

    const emailInput = page.getByRole('textbox', { name: /email/i });
    await emailInput.fill(userEmail);

    const passwordInput = page.getByLabel(/password/i);
    await passwordInput.fill(userPassword);

    const submitButton = page.getByRole('button', { name: /log in/i });
    await submitButton.click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: /log out/i })).toBeVisible();
  });

  test('Logging user in redirects to correct page', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    await page.goto('/login?redirect=/reviews');

    const emailInput = await page.getByRole('textbox', { name: /email/i });
    await emailInput.fill(userEmail);

    const passwordInput = await page.getByLabel('Password');
    await passwordInput.fill(userPassword);

    const submitButton = page.getByRole('button', { name: /log in/i });
    await submitButton.click();

    await expect(page).toHaveURL('/reviews');
    await expect(page.getByRole('button', { name: /log out/i })).toBeVisible();
  });

  test('shows error when logging in with the wrong password', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    await page.goto('/login');

    const emailInput = page.getByRole('textbox', { name: /email/i });
    const passwordInput = page.getByLabel(/password/i);

    await emailInput.fill(userEmail);
    await passwordInput.fill('NotTheRightPWD55');

    const submitButton = page.getByRole('button', { name: /log in/i });
    await submitButton.click();

    await expect(page).toHaveURL('/login?redirect=%2F');

    await expect(page.getByRole('alert').filter({ hasText: /bad credentials/i })).toBeVisible();
  });
});
