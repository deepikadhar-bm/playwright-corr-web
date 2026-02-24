import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Status
 * Elements: 2
 */
export class StatusPage {
  constructor(private page: Page) {}

  get Status(): Locator {
    return this.page.locator("//span[contains(normalize-space(),'\"status\": \"ACTIVE\",')]");
  }

  get Status1(): Locator {
    return this.page.locator("//td[@data-title=\"Status\"]");
  }

}