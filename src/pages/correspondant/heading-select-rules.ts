import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Heading: Select Rule/s
 * Elements: 1
 */
export class HeadingSelectRulesPage {
  constructor(private page: Page) {}

  get Select_Rules(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Select Rule/s\"]]");
  }

}