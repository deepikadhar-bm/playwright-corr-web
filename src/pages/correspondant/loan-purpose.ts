import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Loan Purpose
 * Elements: 2
 */
export class LoanPurposePage {
  constructor(private page: Page) {}

  get Error_Checkloan_details(): Locator {
    return this.page.locator("//div//div[@id=\"errorsCheckLabel\"]");
  }

  get Loan_Purpose1(): Locator {
    return this.page.locator("(//div[text()[normalize-space() = \"Loan Purpose\"]])[1]");
  }

}