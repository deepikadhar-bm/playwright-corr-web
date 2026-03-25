import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Price Offered..
 * Elements: 1
 */
export class PriceOffered3Page {
  constructor(private page: Page) {}

  Commitment_IdAdd_To_Commit_Dropdown(CommitmentID:string): Locator {
    return this.page.locator(`//div[normalize-space(text())=\"${CommitmentID}\"]`);
  }

}