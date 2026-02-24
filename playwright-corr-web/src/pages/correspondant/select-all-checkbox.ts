import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Select All Checkbox
 * Elements: 1
 */
export class SelectAllCheckboxPage {
  constructor(private page: Page) {}

  get Select_All_Checkbox(): Locator {
    return this.page.locator("//input[@id='chkItemallIdundefined']");
  }

}