import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal,,,,,,,,,,,,
 * Elements: 1
 */
export class CorrespondentPortal15Page {
  constructor(private page: Page) {}

  get Execution_Type_Dropdown(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]");
  }

}