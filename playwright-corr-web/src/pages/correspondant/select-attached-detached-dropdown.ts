import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Select Attached Detached Dropdown
 * Elements: 2
 */
export class SelectAttachedDetachedDropdownPage {
  constructor(private page: Page) {}

  get Select_Attached_Detached_Dropdown(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select Attached Detached\")])[2]");
  }

  get Select_Attached_Detached_Dropdown1(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select Attached Detached\")])[4]");
  }

}