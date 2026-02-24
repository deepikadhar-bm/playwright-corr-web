import { Page, Locator } from '@playwright/test';

/**
 * Page Object: No result
 * Elements: 1
 */
export class NoResultPage {
  constructor(private page: Page) {}

  get No_result(): Locator {
    return this.page.locator("//td[text()[normalize-space() = \"No result\"]]");
  }

}