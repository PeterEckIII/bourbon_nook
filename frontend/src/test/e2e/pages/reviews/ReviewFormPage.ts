import { expect, type Page, type Locator } from '@playwright/test';

export class ReviewFormPage {
  protected readonly bottleId: string;

  protected readonly page: Page;
  protected readonly bottle: Locator;
  protected readonly setting: Locator;
  protected readonly date: Locator;
  protected readonly restTime: Locator;
  protected readonly glassware: Locator;
  protected readonly nose: Locator;
  protected readonly palate: Locator;
  protected readonly finish: Locator;
  protected readonly thoughts: Locator;
  protected readonly value: Locator;
  protected readonly overallRating: Locator;

  constructor(page: Page, bottleId: string) {
    this.bottleId = bottleId;
    this.page = page;
    this.bottle = page.getByLabel('Bottle', { exact: true });
    this.setting = page.getByLabel('Review Setting');
    this.date = page.getByLabel('Review Date', { exact: true });
    this.restTime = page.getByLabel('Rest Time (minutes)');
    this.glassware = page.getByLabel('Glassware');
    this.nose = page.getByLabel('Nose');
    this.palate = page.getByLabel('Palate');
    this.finish = page.getByLabel('Finish');
    this.thoughts = page.getByLabel('Thoughts');
    this.value = page.getByLabel('Value Rating');
    this.overallRating = page.getByLabel('Overall Rating');
  }

  async submit() {
    await this.page.getByRole('button', { name: /save review/i }).click();
  }

  async clearRequiredFields() {
    await this.setting.clear();
    await this.setting.blur();
    await this.glassware.clear();
    await this.glassware.blur();
  }

  protected async selectDate(trigger: Locator, isoDate: string) {
    const today = new Date();
    // Parsed as local time (not UTC) to avoid an off-by-one day near midnight.
    const target = new Date(`${isoDate}T00:00:00`);
    const monthsToAdvance =
      (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());

    const dialog = this.page.getByRole('dialog');
    // A blur-triggered validation re-render on the previously focused field can
    // shift the trigger out from under the click; retry until the dialog opens.
    await expect(async () => {
      await trigger.click();
      await expect(dialog).toBeVisible({ timeout: 1000 });
    }).toPass();
    const navButton = dialog.getByRole('button', {
      name: monthsToAdvance >= 0 ? 'Go to the Next Month' : 'Go to the Previous Month',
    });
    for (let i = 0; i < Math.abs(monthsToAdvance); i++) {
      await navButton.click();
    }

    const weekday = target.toLocaleDateString('en-US', { weekday: 'long' });
    const month = target.toLocaleDateString('en-US', { month: 'long' });
    const day = target.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
          ? 'nd'
          : day % 10 === 3 && day !== 13
            ? 'rd'
            : 'th';
    const dayLabel = new RegExp(`${weekday}, ${month} ${day}${suffix}, ${target.getFullYear()}`);

    await dialog.getByRole('button', { name: dayLabel }).click();
  }
}
