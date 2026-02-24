import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Save and Publish Button
 * Elements: 1
 */
export class SaveAndPublishButtonPage {
  constructor(private page: Page) {}

  get Save_and_Publish_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Save and Publish\"]]");
  }

}