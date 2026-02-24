import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Last Modified
 * Elements: 2
 */
export class LastModifiedPage {
  constructor(private page: Page) {}

  get Last_Modified(): Locator {
    return this.page.locator("//td[@data-title=\"Last Modified\"]");
  }

  get Last_Modified1(): Locator {
    return this.page.locator("(//td[@data-title=\"Last Modified\"])[1]");
  }

}