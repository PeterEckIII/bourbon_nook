import { test as base } from '@playwright/test';
import { NewBottlePage } from '../pages/NewBottleFormPage';
import { EditBottlePage } from '../pages/EditBottlePage';

type MyFixtures = {
  newBottlePage: NewBottlePage;
  editBottlePage: EditBottlePage;
};

export const test = base.extend<MyFixtures>({
  newBottlePage: async ({ page }, use) => {
    const newBottlePage = new NewBottlePage(page);
    await newBottlePage.goto();

    await use(newBottlePage);

    for (const bottleId of newBottlePage.createdBottleIds) {
      const res = await page.request.delete(
        `http://localhost:8082/bottles-api/bottles/${bottleId}`,
      );
      if (!res.ok()) {
        console.warn(`Failed to clean up bottle ${bottleId}: ${res.status()} ${res.statusText()}`);
      }
    }
  },
  editBottlePage: async ({ page, newBottlePage }, use) => {
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
    const [bottleId] = newBottlePage.createdBottleIds;
    // Wait for the post-create detail page (and its loader fetch) to settle
    // before navigating away — Firefox aborts a goto() fired mid-navigation.
    await page.waitForLoadState('networkidle');
    const editBottlePage = new EditBottlePage(page, bottleId);
    await editBottlePage.goto();

    await use(editBottlePage);
  },
});

export { expect } from '@playwright/test';
