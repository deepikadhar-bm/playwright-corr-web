import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Interest Only
 * Elements: 1
 */
export class InterestOnlyPage {
  constructor(private page: Page) {}

  get Interest_Only(): Locator {
    return this.page.locator("(//div[text()[normalize-space() = \"Interest Only\"]])[1]");
  }

}