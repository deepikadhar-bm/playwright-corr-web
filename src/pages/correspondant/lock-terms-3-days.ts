import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Lock Terms 3 Days
 * Elements: 1
 */
export class LockTerms3DaysPage {
  constructor(private page: Page) {}

  get Lock_Terms_3_Days(): Locator {
    return this.page.locator("//div[@class='col-6'][contains(.,'$|Lock Terms 3 Days|')]");
  }

}