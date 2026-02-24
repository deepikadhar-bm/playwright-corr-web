import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Show All
 * Elements: 2
 */
export class ShowAllPage {
  constructor(private page: Page) {}

  get Show_All(): Locator {
    return this.page.locator("(//*[text()=\"Show All\"])[1]");
  }

  get Show_All_2(): Locator {
    return this.page.locator("//h6[text()='BidMap']");
  }

}