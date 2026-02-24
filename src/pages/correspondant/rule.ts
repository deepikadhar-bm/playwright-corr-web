import { Page, Locator } from '@playwright/test';

/**
 * Page Object: rule...
 * Elements: 1
 */
export class RulePage {
  constructor(private page: Page) {}

  get Rule_Name(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]");
  }

}