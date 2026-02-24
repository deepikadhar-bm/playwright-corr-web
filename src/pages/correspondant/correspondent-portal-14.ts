import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal............................
 * Elements: 2
 */
export class CorrespondentPortal14Page {
  constructor(private page: Page) {}

  get Delete_button_in_Enumeration_Mapping(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Taxes and I\"]]/following-sibling::button");
  }

  get Headers(): Locator {
    return this.page.locator("(//select[@class=\"form-select\"])[2]");
  }

}