import { Page, Locator } from '@playwright/test';

/**
 * Page Object: iTag
 * Elements: 1
 */
export class ItagPage {
  constructor(private page: Page) {}

  get Reset_Button(): Locator {
    return this.page.locator("//i[contains(@class, 'fa-undo')]");
  }

}