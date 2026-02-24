import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Yes, Proceed Button..
 * Elements: 1
 */
export class YesProceedButtonPage {
  constructor(private page: Page) {}

  get Yes_Proceed_Buttons(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Yes, Proceed\"]]");
  }

}