import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Company
 * Elements: 2
 */
export class CompanyPage {
  constructor(private page: Page) {}

  get Company(): Locator {
    return this.page.locator("(//span[@class=\"text-nowrap\"])[1]");
  }

  get Company3(): Locator {
    return this.page.locator("//td[@data-title=\"Company\"]");
  }

}