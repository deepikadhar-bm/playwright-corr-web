import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Loan Type
 * Elements: 3
 */
export class LoanTypePage {
  constructor(private page: Page) {}

  get Impound_Typesloan_details(): Locator {
    return this.page.locator("//div[text()=\" Impound Types\"]/..//div[contains(@class,\"text-danger\")]");
  }

  get Loan_Type(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Loan Type\"]]");
  }

  get Value_Fieldloan_details(): Locator {
    return this.page.locator("//div[@class=\"border-bottom p-2 tr-value\"]/..//div[contains(@class,\"text-danger\")]");
  }

}