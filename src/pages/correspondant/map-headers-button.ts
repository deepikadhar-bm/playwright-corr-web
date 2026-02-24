import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Map Headers Button
 * Elements: 1
 */
export class MapHeadersButtonPage {
  constructor(private page: Page) {}

  get Map_Headers_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Map Headers\"]]");
  }

}