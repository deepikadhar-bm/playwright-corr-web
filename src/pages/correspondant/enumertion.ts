import { Page, Locator } from '@playwright/test';

/**
 * Page Object: enumertion
 * Elements: 1
 */
export class EnumertionPage {
  constructor(private page: Page) {}

  get_Bid_Sample_Name_1(FirstBidSampleName:string): Locator {
    return this.page.locator(`(//div[@class=\"col-2\"]//div[text()=\"${FirstBidSampleName}\"])[1]/../..//input[@type=\"checkbox\"]`);
  }

}