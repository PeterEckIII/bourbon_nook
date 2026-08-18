import type { Page, Locator } from '@playwright/test';

export class BottleFormPage {
  protected readonly page: Page;
  protected readonly name: Locator;
  protected readonly type: Locator;
  protected readonly status: Locator;
  protected readonly distillery: Locator;
  protected readonly producer: Locator;
  protected readonly country: Locator;
  protected readonly region: Locator;
  protected readonly price: Locator;
  protected readonly age: Locator;
  protected readonly proof: Locator;
  protected readonly year: Locator;
  protected readonly barrel: Locator;
  protected readonly finishing: Locator;
  protected readonly openDate: Locator;
  protected readonly killDate: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.getByLabel('Bottle Name', { exact: true });
    this.type = page.getByLabel('Liquor Type');
    this.status = page.getByLabel('Bottle Status');
    this.distillery = page.getByLabel('Distillery');
    this.producer = page.getByLabel('Producer');
    this.country = page.getByLabel('Country of Origin');
    this.region = page.getByLabel('Region');
    this.price = page.getByLabel('Price');
    this.age = page.getByLabel('Age', { exact: true });
    this.proof = page.getByLabel('Proof');
    this.year = page.getByLabel('Release Year');
    this.barrel = page.getByLabel('Barrel Information');
    this.finishing = page.getByLabel('Finishing Barrels');
    this.openDate = page.getByLabel('Open Date', { exact: true });
    this.killDate = page.getByLabel('Kill Date', { exact: true });
  }

  async submit() {
    await this.page.getByRole('button', { name: /save bottle/i }).click();
  }

  protected async selectDate(trigger: Locator, isoDate: string) {
    const today = new Date();
    // Parsed as local time (not UTC) to avoid an off-by-one day near midnight.
    const target = new Date(`${isoDate}T00:00:00`);
    const monthsToAdvance =
      (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());

    await trigger.click();
    const dialog = this.page.getByRole('dialog');
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
