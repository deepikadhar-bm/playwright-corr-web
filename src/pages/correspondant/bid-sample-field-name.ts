import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Bid Sample Field Name
 * Elements: 3
 */
export class BidSampleFieldNamePage {
  constructor(private page: Page) {}

  get Bid_Sample_Field_Name(): Locator {
    return this.page.locator("//div[text()='$|chasefieldnames|']");
  }

  get Bid_Sample_Value(): Locator {
    return this.page.locator("(//input[@aria-label=\"Enable or disable header\"]/../..//div[contains(@class,\"flex-grow\")])[$|count|]");
  }

  get Common_Xpath_For_Bid_Sample(): Locator {
    return this.page.locator("//input[@aria-label=\"Enable or disable header\"]/../..//div[contains(@class,\"flex-grow\")]");
  }

}