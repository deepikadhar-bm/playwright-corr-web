import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Company_Map_Name
 * Elements: 1
 */
export class CompanymapnamePage {
  constructor(private page: Page) {}

  get Company_Map_Name(): Locator {
    return this.page.locator("(//td[@data-title=\" Company\"])[21]");
  }

}