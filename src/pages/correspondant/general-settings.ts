import { Page, Locator } from '@playwright/test';

/**
 * Page Object: general settings
 * Elements: 3
 */
export class GeneralSettingsPage {
  constructor(private page: Page) {}

  get Clear_search_buttoncustomer_permissions(): Locator {
    return this.page.locator("//button[contains(@class, 'search-cancel-btn')]");
  }

  get Company_Check_box1customer_permissions(): Locator {
    return this.page.locator("(//td[@data-title=\"Company Name\" and not(contains(text(),\"Home Sweet Mortgage\"))]/preceding-sibling::td//input[@type=\"checkbox\"])[1]");
  }

  get Last_Edit_Button_Email_Config(): Locator {
    return this.page.locator("//tbody[@role=\"rowgroup\"]/tr[last()]/td[2]/button[1]/i[1]");
  }

}