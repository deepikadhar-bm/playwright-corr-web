import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Close Button
 * Elements: 1
 */
export class CloseButtonPage {
  constructor(private page: Page) {}

  get Close_Button(): Locator {
    return this.page.locator("//button[@class=\"btn bg-transparent border-0 m-0\"]");
  }

}