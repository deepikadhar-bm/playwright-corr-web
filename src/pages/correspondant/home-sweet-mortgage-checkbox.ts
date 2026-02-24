import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Home Sweet Mortgage Checkbox
 * Elements: 2
 */
export class HomeSweetMortgageCheckboxPage {
  constructor(private page: Page) {}

  get FifthCompany_Checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[6]");
  }

  get FourthCompany_Checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[5]");
  }

}