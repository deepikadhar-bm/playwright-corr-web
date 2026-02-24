import { Page, Locator } from '@playwright/test';

/**
 * Page Object: mapname
 * Elements: 1
 */
export class MapnamePage {
  constructor(private page: Page) {}

  get mapNamefiled(): Locator {
    return this.page.locator("//input[@placeholder=\"Map Name\"]");
  }

}