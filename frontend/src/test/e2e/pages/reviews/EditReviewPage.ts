import type { Page } from '@playwright/test';
import { ReviewFormPage } from './ReviewFormPage';
import { gotoWithRetry } from '../../utils/navigation';

export class EditReviewPage extends ReviewFormPage {
  private readonly reviewId: string;
  protected readonly bottleId: string;

  constructor(page: Page, bottleId: string, reviewId: string) {
    super(page, bottleId);
    this.reviewId = reviewId;
    this.bottleId = bottleId;
  }

  async goto() {
    await gotoWithRetry(this.page, `http://localhost:5173/reviews/${this.reviewId}/edit`);
  }

  async gotoFromDetailPage() {
    await this.page.getByRole('link', { name: 'Edit Review' }).click();
    await this.page.waitForURL(`http://localhost:5173/reviews/${this.reviewId}/edit`);
  }

  async editReview(
    setting: string,
    date: string,
    restTime: string,
    glassware: string,
    nose: string,
    palate: string,
    finish: string,
    thoughts: string,
    value: string,
    overallRating: string,
  ) {
    await this.setting.fill(setting);
    await this.selectDate(this.date, date);
    await this.restTime.fill(restTime);
    await this.glassware.fill(glassware);
    await this.nose.fill(nose);
    await this.palate.fill(palate);
    await this.finish.fill(finish);
    await this.thoughts.fill(thoughts);
    await this.value.fill(value);
    await this.overallRating.fill(overallRating);

    await this.submit();

    await this.page.waitForURL(`http://localhost:5173/reviews/${this.reviewId}`);
  }
}
