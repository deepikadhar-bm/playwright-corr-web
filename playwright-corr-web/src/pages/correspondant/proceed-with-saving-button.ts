import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Proceed with Saving Button
 * Elements: 1
 */
export class ProceedWithSavingButtonPage {
  constructor(private page: Page) {}

  get Proceed_with_Saving_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Proceed with Saving\"]");
  }

}