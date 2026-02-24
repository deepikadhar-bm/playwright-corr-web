import { Page, Locator } from '@playwright/test';

/**
 * Page Object: TPO in Enumeration Mapping
 * Elements: 1
 */
export class TpoInEnumerationMappingPage {
  constructor(private page: Page) {}

  get TPO_in_Enumeration_Mapping(): Locator {
    return this.page.locator("(//div[text()[normalize-space() = \"TPO\"]])[1]");
  }

}