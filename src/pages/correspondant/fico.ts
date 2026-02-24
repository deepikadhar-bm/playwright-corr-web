import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Fico
 * Elements: 1
 */
export class FicoPage {
  constructor(private page: Page) {}

  get Fico(): Locator {
    return this.page.locator("//td[text()[normalize-space() = \"Fico\"]]");
  }

}