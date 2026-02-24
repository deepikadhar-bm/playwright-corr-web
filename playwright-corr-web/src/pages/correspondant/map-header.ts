import { Page, Locator } from '@playwright/test';

/**
 * Page Object: map header
 * Elements: 1
 */
export class MapHeaderPage {
  constructor(private page: Page) {}

  get Execution_Type_Dropdown_New(): Locator {
    return this.page.locator("//label[text()=\"Execution Type\"]/..//select");
  }

}