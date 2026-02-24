import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Freedom A4187 (A4187) Checkbox
 * Elements: 1
 */
export class FreedomA4187A4187CheckboxPage {
  constructor(private page: Page) {}

  get First_Company_Checkbox(): Locator {
    return this.page.locator("(//input[contains(@class,\"mr-2 cursor\") and @type=\"checkbox\"])[2]");
  }

}