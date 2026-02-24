import { Page, Locator } from '@playwright/test';

/**
 * Page Object: column_Header_Rule
 * Elements: 1
 */
export class ColumnheaderrulePage {
  constructor(private page: Page) {}

  get column_Header_Rule(): Locator {
    return this.page.locator("(//i[text()[normalize-space() = \"col:\"]])[1]");
  }

}