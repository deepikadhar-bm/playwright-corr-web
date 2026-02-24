import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Search/Filter Input
 * Elements: 1
 */
export class SearchfilterInputPage {
  constructor(private page: Page) {}

  get SearchFilter_InputAll_Map_List_Page(): Locator {
    return this.page.locator("//input[@placeholder=\"Search/Filter\"]");
  }

}