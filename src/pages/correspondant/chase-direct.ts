import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Chase Direct
 * Elements: 2
 */
export class ChaseDirectPage {
  constructor(private page: Page) {}

  get Chase_Direct1(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]");
  }

  get ChaseDirect_Checkbox(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]/..//input");
  }

}