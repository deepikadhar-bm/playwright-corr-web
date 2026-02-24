import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Exit Button
 * Elements: 1
 */
export class ExitButtonPage {
  constructor(private page: Page) {}

  get Exit_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Exit\"]]");
  }

}