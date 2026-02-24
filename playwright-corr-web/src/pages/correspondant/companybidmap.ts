import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Company_BidMap
 * Elements: 2
 */
export class CompanybidmapPage {
  constructor(private page: Page) {}

  get Company_BidMap(): Locator {
    return this.page.locator("//td[@data-title=\"Company\"]//span");
  }

  get New_Map_Name(): Locator {
    return this.page.locator("//label[text()=\"New Map Name\"]/..//input");
  }

}