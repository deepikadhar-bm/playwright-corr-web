import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Price Offered..
 * Elements: 1
 */
export class PriceOffered3Page {
  constructor(private page: Page) {}

  get Commitment_IdAdd_To_Commit_Dropdown(): Locator {
    return this.page.locator("//div[normalize-space(text())=\"$|CommitmentID|\"]");
  }

}