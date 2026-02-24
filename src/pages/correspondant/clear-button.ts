import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Clear Button
 * Elements: 1
 */
export class ClearButtonPage {
  constructor(private page: Page) {}

  get Clear_Button(): Locator {
    return this.page.locator("//i[contains(@class, 'fa-times-circle')]");
  }

}