import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Spinner
 * Elements: 1
 */
export class SpinnerPage {
  constructor(private page: Page) {}

  get Spinner(): Locator {
    return this.page.locator("//span[contains(@class,'circle')]");
  }

}