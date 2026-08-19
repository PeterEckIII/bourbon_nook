import { BottleFormPage } from './BottleFormPage';
import { gotoWithRetry } from '../../utils/navigation';

const BOTTLE_DETAIL_URL = /\/bottles\/([0-9a-f-]{36})$/i;

export class NewBottlePage extends BottleFormPage {
  readonly createdBottleIds: string[] = [];

  async goto() {
    await gotoWithRetry(this.page, 'http://localhost:5173/bottles/new');
  }

  async addBottle(
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

    await this.page.waitForURL(BOTTLE_DETAIL_URL);
    await this.page.waitForLoadState('networkidle');
    const [, bottleId] = BOTTLE_DETAIL_URL.exec(this.page.url())!;
    this.createdBottleIds.push(bottleId);
  }
}
