import { test, expect } from '../../fixtures';

test('user can add a new review', async ({ newReviewPage, page }) => {
  await newReviewPage.addReview(
    'After work',
    '2026-08-19',
    '10',
    'Glencairn',
    'This nose smells great!',
    'Tastes amazing',
    'Long finish with oak and cherry',
    'What a dram!',
    '8',
    '8.5',
  );

  await expect(page).toHaveURL(/\/reviews\/[0-9a-f-]{36}/i);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Buffalo Trace');
  await expect(page.getByText('This nose smells great!')).toBeVisible();
  await expect(page.getByText('What a dram!')).toBeVisible();
});

test('shows validation errors when required fields are left blank', async ({
  newReviewPage,
  page,
}) => {
  await newReviewPage.submit();

  await expect(page.getByRole('alert').filter({ hasText: 'Setting is required' })).toBeVisible();
  await expect(page.getByRole('alert').filter({ hasText: 'Glassware is required' })).toBeVisible();
  await expect(page).toHaveURL(/\/reviews\/new$/);
});
