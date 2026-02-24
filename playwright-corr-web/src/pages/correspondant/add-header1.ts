import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Add Header1
 * Elements: 2
 */
export class AddHeader1Page {
  constructor(private page: Page) {}

  get After_Selected_Company_name_is_displayed(): Locator {
    return this.page.locator("//span[contains(text(),\"$|Companyname|\")]");
  }

  get CLM_Field_Name(): Locator {
    return this.page.locator("//div[text()='CLM Field Name']//..//..//select");
  }

}