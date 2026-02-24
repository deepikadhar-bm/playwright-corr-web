import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Buy Cosmetics Products
 * Elements: 2
 */
export class BuyCosmeticsProductsPage {
  constructor(private page: Page) {}

  get luxe(): Locator {
    return this.page.locator("luxe");
  }

  get Natural(): Locator {
    return this.page.locator("//a[starts-with(@href, \"https://www.nykaa.com/sp/natural-native/natural\")]");
  }

}