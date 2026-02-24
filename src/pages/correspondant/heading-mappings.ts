import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Heading: Mappings
 * Elements: 1
 */
export class HeadingMappingsPage {
  constructor(private page: Page) {}

  get Mappings(): Locator {
    return this.page.locator("//h1[text()=\"Mappings\"]");
  }

}