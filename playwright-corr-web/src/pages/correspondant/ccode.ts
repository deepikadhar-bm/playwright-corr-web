import { Page, Locator } from '@playwright/test';

/**
 * Page Object: CCode
 * Elements: 1
 */
export class CcodePage {
  constructor(private page: Page) {}

  get CCode(): Locator {
    return this.page.locator("//td[@data-title=\"CCode\"]");
  }

}