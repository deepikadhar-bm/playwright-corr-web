import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Heading: Enumeration Mapping / Step 3 of 4
 * Elements: 1
 */
export class HeadingEnumerationMappingStep3Of4Page {
  constructor(private page: Page) {}

  get Enumeration_Mapping(): Locator {
    return this.page.locator("//h1[@class=\"fw-semibold py-3\"]");
  }

}