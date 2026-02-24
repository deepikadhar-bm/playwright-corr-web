import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Bid Upload Date
 * Elements: 2
 */
export class BidUploadDatePage {
  constructor(private page: Page) {}

  get Bid_Upload_Date(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Bid Upload Date\"]]");
  }

  get Pricing_Return_Time_Dtopdown(): Locator {
    return this.page.locator("//option[@aria-disabled=\"true\" or @aria-disabled=\"false\"]");
  }

}