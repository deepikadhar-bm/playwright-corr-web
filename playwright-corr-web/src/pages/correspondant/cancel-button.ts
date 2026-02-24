import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Cancel Button
 * Elements: 1
 */
export class CancelButtonPage {
  constructor(private page: Page) {}

  get Cancel_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Cancel\"]]");
  }

}