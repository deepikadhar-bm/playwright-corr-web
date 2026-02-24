import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Update Permissions Button
 * Elements: 1
 */
export class UpdatePermissionsButtonPage {
  constructor(private page: Page) {}

  get UpdatePermissions_Button(): Locator {
    return this.page.locator("//span[text()=\"Update Permissions\"]/ancestor::button");
  }

}