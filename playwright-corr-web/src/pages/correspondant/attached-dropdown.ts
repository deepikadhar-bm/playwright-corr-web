import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Attached Dropdown
 * Elements: 1
 */
export class AttachedDropdownPage {
  constructor(private page: Page) {}

  get Attached_Dropdown_in_Enumeration_Mapping(): Locator {
    return this.page.locator("(//div[text()=\"Attachment Type\"]/../..//select)[1]");
  }

}