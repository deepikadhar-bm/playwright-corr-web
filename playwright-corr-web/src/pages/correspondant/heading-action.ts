import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Heading: Action
 * Elements: 2
 */
export class HeadingActionPage {
  constructor(private page: Page) {}

  get Action(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Action\"]]");
  }

  get Amortization_Type_chase_value(): Locator {
    return this.page.locator("//div[text()=\"Amortization Type\"]/../..//select");
  }

}