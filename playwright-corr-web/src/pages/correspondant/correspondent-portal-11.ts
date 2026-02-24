import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal..........
 * Elements: 3
 */
export class CorrespondentPortal11Page {
  constructor(private page: Page) {}

  get Chase_Field_Name(): Locator {
    return this.page.locator("(//option/../..//select[@class=\"form-select\"])[3]");
  }

  get CheckBox_for_the_Chase_Direct(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]/preceding-sibling::input[@type=\"checkbox\"]");
  }

  get Execution_Dropdown(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]");
  }

}