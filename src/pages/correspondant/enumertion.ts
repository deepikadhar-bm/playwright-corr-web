import { Page, Locator } from '@playwright/test';

/**
 * Page Object: enumertion
 * Elements: 1
 */
export class EnumertionPage {
  constructor(private page: Page) {}

  get Bid_Sample_Name_1(): Locator {
    return this.page.locator("(//div[@class=\"col-2\"]//div[text()=\"$|FirstBidSampleName|\"])[1]/../..//input[@type=\"checkbox\"]");
  }

}