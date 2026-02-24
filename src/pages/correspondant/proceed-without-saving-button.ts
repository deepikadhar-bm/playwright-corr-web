import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Proceed without Saving Button
 * Elements: 1
 */
export class ProceedWithoutSavingButtonPage {
  constructor(private page: Page) {}

  get Proceed_without_Saving_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Proceed without Saving\"]]");
  }

}