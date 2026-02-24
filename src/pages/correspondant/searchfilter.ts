import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Search/Filter
 * Elements: 1
 */
export class SearchfilterPage {
  constructor(private page: Page) {}

  get SearchFilter(): Locator {
    return this.page.locator("//input[@placeholder=\"Search/Filter\"]");
  }

}