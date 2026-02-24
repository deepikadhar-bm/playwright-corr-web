import { Page, Locator } from '@playwright/test';

/**
 * Page Object: FTHB Waiver Y First Time Homebuyer Credit Fee Waiver
 * Elements: 1
 */
export class FthbWaiverYFirstTimeHomebuyerCreditFeeWaiverPage {
  constructor(private page: Page) {}

  get Enumeration_Fields(): Locator {
    return this.page.locator("(//div[contains(normalize-space(),\"FTHB Waiver Y First Time Homebuyer Credit Fee Waiver Add Field Select False True\")])[11]");
  }

}