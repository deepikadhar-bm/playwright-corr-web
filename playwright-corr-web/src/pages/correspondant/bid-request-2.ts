import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Bid Request.
 * Elements: 1
 */
export class BidRequest2Page {
  constructor(private page: Page) {}

  get LoanStatusText(): Locator {
    return this.page.locator("(//td[@data-title=\"Loan Status\"]//div)[$|Rows|]");
  }

}