import { test, expect } from '../../fixtures';

test('user can edit an existing bottle', async ({ editBottlePage, page }) => {
  await editBottlePage.editBottle(
    'Eagle Rare',
    'Bourbon',
    'FINISHED',
    'Buffalo Trace',
    'Sazerac',
    'USA',
    'KY',
    '39.99',
    '10yrs',
    '90',
    '2026',
    'N/A',
    'N/A',
    '2026-08-08',
    '2026-10-25',
  );
  await expect(page).toHaveURL(/\/bottles\/[0-9a-f-]{36}/i);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Eagle Rare');
  await expect(page.getByText('Buffalo Trace · Sazerac')).toBeVisible();
  await expect(page.getByText('$39.99')).toBeVisible();
  await expect(page.getByText('FINISHED', { exact: true })).toBeVisible();

  await page.goto('/bottles');
  await expect(page.getByRole('table').getByText('Eagle Rare').first()).toBeVisible();
});
