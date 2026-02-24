import { Page, Locator } from '@playwright/test';

/**
 * Page Object: False Dropdown
 * Elements: 1
 */
export class FalseDropdownPage {
  constructor(private page: Page) {}

  get Select_Dropdown_for_First_Time_Home_Buyer(): Locator {
    return this.page.locator("//*[text()=\"First Time Home Buyer\"]/../..//select");
  }

}