import { test as base } from '@playwright/test';
import { NewBottlePage } from '../pages/bottles/NewBottleFormPage';
import { EditBottlePage } from '../pages/bottles/EditBottlePage';
import { NewReviewPage } from '../pages/reviews/NewReviewFormPage';
import { EditReviewPage } from '../pages/reviews/EditReviewPage';

type Fixtures = {
  newBottlePage: NewBottlePage;
  editBottlePage: EditBottlePage;
  newReviewPage: NewReviewPage;
  editReviewPage: EditReviewPage;
};

export const test = base.extend<Fixtures>({
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
    const editBottlePage = new EditBottlePage(page, bottleId);
    await editBottlePage.gotoFromDetailPage();

    await use(editBottlePage);
  },
  newReviewPage: async ({ page, newBottlePage }, use) => {
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
    const newReviewPage = new NewReviewPage(page, bottleId);
    await newReviewPage.goto();

    await use(newReviewPage);

    // Clean up bottle
    for (const bottleId of newBottlePage.createdBottleIds) {
      const res = await page.request.delete(
        `http://localhost:8082/bottles-api/bottles/${bottleId}`,
      );

      if (!res.ok()) {
        console.warn(`Failed to clean up bottle ${bottleId}`);
      }
    }

    // Clean up review
    for (const reviewId of newReviewPage.createdReviewIds) {
      const res = await page.request.delete(
        `http://localhost:8082/reviews-api/reviews/${reviewId}`,
      );

      if (!res.ok()) {
        console.warn(`Failed to clean up review ${reviewId}`);
      }
    }
  },
  editReviewPage: async ({ page, newReviewPage, newBottlePage }, use) => {
    const [bottleId] = newBottlePage.createdBottleIds;

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
    const [reviewId] = newReviewPage.createdReviewIds;
    const editReviewPage = new EditReviewPage(page, bottleId, reviewId);
    await editReviewPage.gotoFromDetailPage();

    await use(editReviewPage);
  },
});

export { expect } from '@playwright/test';
