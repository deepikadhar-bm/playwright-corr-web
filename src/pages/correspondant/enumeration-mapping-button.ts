import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Enumeration Mapping Button
 * Elements: 1
 */
export class EnumerationMappingButtonPage {
  constructor(private page: Page) {}

  get Enumeration_Mapping_Button(): Locator {
    return this.page.locator("//span[text()='Enumeration Mapping']");
  }

}