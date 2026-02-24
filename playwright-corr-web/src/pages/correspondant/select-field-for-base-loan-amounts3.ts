import { Page, Locator } from '@playwright/test';

/**
 * Page Object: select field for Base loan amounts-3
 * Elements: 1
 */
export class SelectFieldForBaseLoanAmounts3Page {
  constructor(private page: Page) {}

  get select_field_for_CLTV2(): Locator {
    return this.page.locator("(//div[text()=\" Select \"])");
  }

}