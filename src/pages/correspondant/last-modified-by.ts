import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Last Modified By
 * Elements: 1
 */
export class LastModifiedByPage {
  constructor(private page: Page) {}

  get Last_Modified_By(): Locator {
    return this.page.locator("//td[@data-title=\"Last Modified By\"]");
  }

}