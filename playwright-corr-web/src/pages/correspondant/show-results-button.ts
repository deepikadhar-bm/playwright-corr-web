import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Show Results Button
 * Elements: 1
 */
export class ShowResultsButtonPage {
  constructor(private page: Page) {}

  get Show_Results_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Show Results\"]]");
  }

}