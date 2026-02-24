import { Page, Locator } from '@playwright/test';

/**
 * Page Object: First Payment Date
 * Elements: 1
 */
export class FirstPaymentDatePage {
  constructor(private page: Page) {}

  get First_Payment_Date(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"First Payment Date\"]]");
  }

}