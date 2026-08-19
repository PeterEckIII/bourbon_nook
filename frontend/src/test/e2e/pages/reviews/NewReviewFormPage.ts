import { ReviewFormPage } from './ReviewFormPage';
import { gotoWithRetry } from '../../utils/navigation';

const REVIEW_DETAIL_URL = /\/reviews\/([0-9a-f-]{36})$/i;

export class NewReviewPage extends ReviewFormPage {
  readonly createdReviewIds: string[] = [];

  async goto() {
    await gotoWithRetry(this.page, 'http://localhost:5173/reviews/new');
  }

  async addReview(
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
    await this.bottle.click();
    await this.page.locator(`[id$="-option-${this.bottleId}"]`).click();
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

    await this.page.waitForURL(REVIEW_DETAIL_URL);
    const [, reviewId] = REVIEW_DETAIL_URL.exec(this.page.url())!;
    this.createdReviewIds.push(reviewId);
  }
}
