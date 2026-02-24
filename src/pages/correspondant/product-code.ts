import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Product Code
 * Elements: 1
 */
export class ProductCodePage {
  constructor(private page: Page) {}

  get Product_Code(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Product Code\"]]");
  }

}