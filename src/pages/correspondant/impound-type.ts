import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Impound Type
 * Elements: 1
 */
export class ImpoundTypePage {
  constructor(private page: Page) {}

  get Impound_Type(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Impound Type\"]]");
  }

}