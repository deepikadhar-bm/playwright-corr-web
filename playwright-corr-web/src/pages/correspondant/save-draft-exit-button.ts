import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Save Draft & Exit Button
 * Elements: 1
 */
export class SaveDraftExitButtonPage {
  constructor(private page: Page) {}

  get Save_Draft_Exit_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Save Draft & Exit\"]]");
  }

}