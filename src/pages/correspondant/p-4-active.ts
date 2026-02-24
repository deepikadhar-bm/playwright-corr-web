import { Page, Locator } from '@playwright/test';

/**
 * Page Object: 4 - Active
 * Elements: 1
 */
export class P4ActivePage {
  constructor(private page: Page) {}

  get Version_Number(): Locator {
    return this.page.locator("(//i[@class=\"fas fa-arrow-to-bottom\"])[1]");
  }

}