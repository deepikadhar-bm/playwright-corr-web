import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal...................
 * Elements: 4
 */
export class CorrespondentPortal5Page {
  constructor(private page: Page) {}

  get Search_Field(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[2]");
  }

  get Check_Box_In_Enumeration(): Locator {
    return this.page.locator("//input[@aria-label=\"Enable or disable field Amortization Type\"]");
  }

  get Disabled_for_Standard(): Locator {
    return this.page.locator("(//div[contains(@class,'text-danger')])[1]");
  }

  get Execution_Type_Dropdowns(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]");
  }

}