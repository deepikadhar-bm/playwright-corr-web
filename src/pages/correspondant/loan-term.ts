import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Loan Term
 * Elements: 1
 */
export class LoanTermPage {
  constructor(private page: Page) {}

  get Loan_Term(): Locator {
    return this.page.locator("(//div[text()[normalize-space() = \"Loan Term\"]])[1]");
  }

}