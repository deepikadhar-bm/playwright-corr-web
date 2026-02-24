import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Added On.
 * Elements: 6
 */
export class AddedOnPage {
  constructor(private page: Page) {}

  get ChaseFiedName_1(): Locator {
    return this.page.locator("((//*[text()=\"Chase Field Name\"]/..//select)[1]/../..//option)[5]");
  }

  get company_1(): Locator {
    return this.page.locator("//td[@data-title=\"Company\" and contains(text(),\"$|firstCompanySelected|\")]");
  }

  get company_2(): Locator {
    return this.page.locator("//td[@data-title=\"Company\" and contains(text(),\"$|secondCompanySelected|\")]");
  }

  get company_3(): Locator {
    return this.page.locator("//td[@data-title=\"Company\" and contains(text(),\"$|thirdCompanySelected|\")]");
  }

  get FileRow(): Locator {
    return this.page.locator("//div[@class=\"truncate\"]");
  }

  get SelectMapping(): Locator {
    return this.page.locator("//div[contains(@class,\"gap-2 header-grid-layout\")]/..//select");
  }

}