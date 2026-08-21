import { test, expect } from '@playwright/test';

test.describe('Logout flow', () => {
  test('Logs the user out', async ({ page, context }) => {
    await page.goto('/');

    let cookies = await context.cookies();
    const jwtCookieBefore = cookies.find((c) => c.name === 'jwt');
    expect(jwtCookieBefore).toBeDefined();

    const logoutButton = page.getByRole('button', { name: /log out/i });
    await expect(logoutButton).toBeEnabled();

    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/auth/logout') && resp.status() === 200),
      logoutButton.click(),
    ]);

    cookies = await context.cookies();
    const jwtCookieAfter = cookies.find((c) => c.name === 'jwt');
    expect(jwtCookieAfter).not.toBeDefined();

    await expect(page).toHaveURL('/login?redirect=%2F');
    await page.goto('/bottles').then(() => expect(page).toHaveURL('/login?redirect=%2Fbottles'));
  });
});
