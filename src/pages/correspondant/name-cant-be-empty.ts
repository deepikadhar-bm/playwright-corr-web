import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Name can't be empty.
 * Elements: 1
 */
export class NameCantBeEmptyPage {
  constructor(private page: Page) {}

  get Name_cant_be_empty(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Name can't be empty.\"]]");
  }

}