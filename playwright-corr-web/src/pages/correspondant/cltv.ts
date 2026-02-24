import { Page, Locator } from '@playwright/test';

/**
 * Page Object: CLTV
 * Elements: 1
 */
export class CltvPage {
  constructor(private page: Page) {}

  get CLTV(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"CLTV\"]]");
  }

}