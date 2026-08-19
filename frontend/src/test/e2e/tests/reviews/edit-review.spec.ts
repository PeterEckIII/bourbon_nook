import { test, expect } from '../../fixtures';

test('user can edit an existing review', async ({ editReviewPage, page }) => {
  await editReviewPage.editReview(
    'A new setting',
    '2026-08-20',
    '20',
    'Norlan',
    'Wow what a nose!',
    'So tasty',
    'Short, but sweet',
    'An OK dram',
    '6',
    '7',
  );
  await expect(page).toHaveURL(/\/reviews\/[0-9a-f-]{36}/i);
  await expect(page.getByText('Review', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Buffalo Trace');
  await expect(page.getByText('Overall Rating')).toBeVisible();
  await expect(page.getByText('Aug 20, 2026')).toBeVisible();
  await expect(page.getByRole('link', { name: /view bottle →/i })).toHaveAttribute(
    'href',
    /\/bottles\/[0-9a-f-]{36}/i,
  );
});

test('shows validation errors when required fields are left blank', async ({
  editReviewPage,
  page,
}) => {
  await editReviewPage.clearRequiredFields();

  await expect(page.getByRole('alert').filter({ hasText: 'Setting is required' })).toBeVisible();
  await expect(page.getByRole('alert').filter({ hasText: 'Glassware is required' })).toBeVisible();
});
