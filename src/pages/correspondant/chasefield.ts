import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Chasefield
 * Elements: 1
 */
export class ChasefieldPage {
  constructor(private page: Page) {}

  get Bid_Sample_Filed_Name_under_Enumeration(): Locator {
    return this.page.locator("//select[@title=\"$|ChaseField|\"]/../../../..//div[@class=\"flex-grow-1\"]");
  }

}