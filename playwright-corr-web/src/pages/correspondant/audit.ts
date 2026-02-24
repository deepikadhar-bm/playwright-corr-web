import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Audit
 * Elements: 2
 */
export class AuditPage {
  constructor(private page: Page) {}

  get Date_Filter_Dropdown(): Locator {
    return this.page.locator("//a[@role=\"button\" and contains(@class, 'd-flex')]");
  }

  get Date_Range_DropdownFilter(): Locator {
    return this.page.locator("//input[@placeholder=\"Select Date\"]");
  }

}