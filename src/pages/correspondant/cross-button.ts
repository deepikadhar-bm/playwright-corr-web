import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Cross Button
 * Elements: 1
 */
export class CrossButtonPage {
  constructor(private page: Page) {}

  get Cross_Button(): Locator {
    return this.page.locator("//i[contains(@class, 'fa-lg') and contains(@class, 'color-primary') and contains(@class, 'fa-times')]");
  }

}