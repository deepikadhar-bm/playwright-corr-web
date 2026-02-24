import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Select Dropdown
 * Elements: 1
 */
export class SelectDropdownPage {
  constructor(private page: Page) {}

  get Select_Company_In_BidRequest(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select\"]]");
  }

}