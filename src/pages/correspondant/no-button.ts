import { Page, Locator } from '@playwright/test';

/**
 * Page Object: No Button
 * Elements: 1
 */
export class NoButtonPage {
  constructor(private page: Page) {}

  get No_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"No\"]]");
  }

}