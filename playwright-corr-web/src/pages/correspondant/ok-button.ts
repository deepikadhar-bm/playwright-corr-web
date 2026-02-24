import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Ok Button
 * Elements: 1
 */
export class OkButtonPage {
  constructor(private page: Page) {}

  get Ok_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Ok\"]]");
  }

}