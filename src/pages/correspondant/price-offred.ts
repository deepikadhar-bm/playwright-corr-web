import { Page, Locator } from '@playwright/test';

/**
 * Page Object: price offred
 * Elements: 1
 */
export class PriceOffredPage {
  constructor(private page: Page) {}

  get Duplicate_Loan_Number(): Locator {
    return this.page.locator("//div[text()=\"Duplicate Loan # \"]//following::div[1]/div");
  }

}