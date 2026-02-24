import { Page, Locator } from '@playwright/test';

/**
 * Page Object: No data Found
 * Elements: 1
 */
export class NoDataFoundPage {
  constructor(private page: Page) {}

  get No_data_Found(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"No data Found\"]]");
  }

}