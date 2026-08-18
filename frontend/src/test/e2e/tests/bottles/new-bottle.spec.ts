import { test, expect } from '../../fixtures/bottles';

test('user can add a new bottle', async ({ newBottlePage, page }) => {
  await newBottlePage.addBottle(
    'Buffalo Trace',
    'Bourbon',
    'OPENED',
    'Buffalo Trace',
    'Sazerac',
    'USA',
    'KY',
    '25.99',
    'NAS',
    '90',
    '2026',
    'N/A',
    'N/A',
    '2026-08-08',
    '2026-09-01',
  );
  await expect(page).toHaveURL(/\/bottles\/[0-9a-f-]{36}/i);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Buffalo Trace');
  await expect(page.getByText('Buffalo Trace · Sazerac')).toBeVisible();
  await expect(page.getByText('$25.99')).toBeVisible();
  await expect(page.getByText('OPENED', { exact: true })).toBeVisible();

  await page.goto('/bottles');
  await expect(page.getByRole('table').getByText('Buffalo Trace').first()).toBeVisible();
});

test('shows validation errors when required fields are left blank', async ({
  newBottlePage,
  page,
}) => {
  await newBottlePage.submit();

  await expect(page.getByRole('alert').filter({ hasText: 'Name is required' })).toBeVisible();
  await expect(page.getByRole('alert').filter({ hasText: 'Type is required' })).toBeVisible();
  await expect(page).toHaveURL(/\/bottles\/new$/);
});
