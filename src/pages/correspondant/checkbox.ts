import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Checkbox
 * Elements: 2
 */
export class CheckboxPage {
  constructor(private page: Page) {}

  get Checkbox1(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[2]");
  }

  get checkbox2(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[4]");
  }

}