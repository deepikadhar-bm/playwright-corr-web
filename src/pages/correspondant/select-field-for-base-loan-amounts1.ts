import { Page, Locator } from '@playwright/test';

/**
 * Page Object: select field for Base loan amounts-1
 * Elements: 1
 */
export class SelectFieldForBaseLoanAmounts1Page {
  constructor(private page: Page) {}

  get select_field_for_Base_loan_amounts2(): Locator {
    return this.page.locator("(//div[text()=\" Select \"])[1]");
  }

}