import { Page, Locator } from '@playwright/test';

/**
 * Page Object: chase Field value
 * Elements: 3
 */
export class ChaseFieldValuePage {
  constructor(private page: Page) {}

  get Chase_Field_Name_Edit_Button(): Locator {
    return this.page.locator("//select[@title=\"$|chasefieldnames|\"]//..//..//..//i[@class=\"fas fa-pencil-alt\"]");
  }

  get Chase_Filed_Name1(): Locator {
    return this.page.locator("//select[@title=\"$|chasefieldnames|\"]");
  }

  get Select_Fields(): Locator {
    return this.page.locator("(//select[@class=\"form-select\"])[$|number|]");
  }

}