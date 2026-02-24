import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Filter Dropdown
 * Elements: 1
 */
export class FilterDropdownPage {
  constructor(private page: Page) {}

  get Filter_Dropdown(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Filter\"]]");
  }

}