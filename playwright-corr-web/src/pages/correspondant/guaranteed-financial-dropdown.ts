import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Guaranteed Financial Dropdown
 * Elements: 1
 */
export class GuaranteedFinancialDropdownPage {
  constructor(private page: Page) {}

  get SelectCompany_BidRequest(): Locator {
    return this.page.locator("//button[@class=\"dropdown-item d-flex\"]");
  }

}