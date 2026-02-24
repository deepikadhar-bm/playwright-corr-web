import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Select Company..
 * Elements: 1
 */
export class SelectCompanyPage {
  constructor(private page: Page) {}

  get Selected_CompanyValue(): Locator {
    return this.page.locator("//div[contains(@class,'text-start') and contains(@class,'text-truncate')]\"");
  }

}