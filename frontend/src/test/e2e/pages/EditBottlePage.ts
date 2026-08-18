import type { Page } from '@playwright/test';
import { BottleFormPage } from './BottleFormPage';

export class EditBottlePage extends BottleFormPage {
  private readonly bottleId: string;

  constructor(page: Page, bottleId: string) {
    super(page);
    this.bottleId = bottleId;
  }

  async goto() {
    await this.page.goto(`http://localhost:5173/bottles/${this.bottleId}/edit`);
  }

  // Client-side link click avoids the hard-navigation race with goto() that intermittently aborts in Firefox.
  async gotoFromDetailPage() {
    await this.page.getByRole('link', { name: 'Edit Bottle' }).click();
    await this.page.waitForURL(`http://localhost:5173/bottles/${this.bottleId}/edit`);
  }

  async editBottle(
    name: string,
    type: string,
    status: 'OPENED' | 'SEALED' | 'FINISHED',
    distillery: string,
    producer: string,
    country: string,
    region: string,
    price: string,
    age: string,
    proof: string,
    year: string,
    barrel: string,
    finishing: string,
    openDate: string,
    killDate: string,
  ) {
    await this.name.clear();
    await this.name.fill(name);
    await this.type.fill(type);
    await this.status.selectOption(status);
    await this.distillery.fill(distillery);
    await this.producer.fill(producer);
    await this.country.fill(country);
    await this.region.fill(region);
    await this.price.fill(price);
    await this.age.fill(age);
    await this.proof.fill(proof);
    await this.year.fill(year);
    await this.barrel.fill(barrel);
    await this.finishing.fill(finishing);
    await this.selectDate(this.openDate, openDate);
    await this.selectDate(this.killDate, killDate);

    await this.submit();

    await this.page.waitForURL(`http://localhost:5173/bottles/${this.bottleId}`);
  }
}
