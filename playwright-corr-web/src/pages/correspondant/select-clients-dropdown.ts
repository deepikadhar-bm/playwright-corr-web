import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Select Clients Dropdown
 * Elements: 1
 */
export class SelectClientsDropdownPage {
  constructor(private page: Page) {}

  get Select_Clients_Dropdown1(): Locator {
    return this.page.locator("//button[@id='multiSelectDropDown']");
  }

}