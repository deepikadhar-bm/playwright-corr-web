import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Property Type
 * Elements: 1
 */
export class PropertyTypePage {
  constructor(private page: Page) {}

  get Property_Type(): Locator {
    return this.page.locator("(//div[text()[normalize-space() = \"Property Type\"]])[1]");
  }

}