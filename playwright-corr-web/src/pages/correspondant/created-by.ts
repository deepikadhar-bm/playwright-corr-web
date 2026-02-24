import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Created By
 * Elements: 1
 */
export class CreatedByPage {
  constructor(private page: Page) {}

  get Created_By(): Locator {
    return this.page.locator("//td[@data-title=\"Created By\"]");
  }

}