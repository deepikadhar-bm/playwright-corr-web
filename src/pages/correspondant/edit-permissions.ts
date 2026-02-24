import { Page, Locator } from '@playwright/test';

/**
 * Page Object: edit permissions
 * Elements: 3
 */
export class EditPermissionsPage {
  constructor(private page: Page) {}

  get Close_pop_up(): Locator {
    return this.page.locator("//button[@data-dismiss=\"modal\"]");
  }

  get Off_Radio_Chase_DirectEdit_Permissions(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[4]");
  }

  get Standard_Off_Radio_button(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Standard']/parent::div//input)[2]");
  }

}