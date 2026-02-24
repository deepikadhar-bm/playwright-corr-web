import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Heading: Rule Name
 * Elements: 1
 */
export class HeadingRuleNamePage {
  constructor(private page: Page) {}

  get Rule_Name(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Rule Name\"]]");
  }

}