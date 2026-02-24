import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Select Company/CCode Dropdown
 * Elements: 1
 */
export class SelectCompanyccodeDropdownPage {
  constructor(private page: Page) {}

  get Select_CompanyCCode_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Company/CCode\"]]");
  }

}