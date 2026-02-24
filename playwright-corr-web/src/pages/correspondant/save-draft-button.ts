import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Save Draft Button
 * Elements: 1
 */
export class SaveDraftButtonPage {
  constructor(private page: Page) {}

  get Save_Draft_Button(): Locator {
    return this.page.locator("//div[contains(@class, 'container') and contains(@class, 'd-flex')]/div[2]/button[2]");
  }

}