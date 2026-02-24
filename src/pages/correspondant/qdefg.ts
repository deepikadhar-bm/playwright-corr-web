import { Page, Locator } from '@playwright/test';

/**
 * Page Object: qdefg
 * Elements: 1
 */
export class QdefgPage {
  constructor(private page: Page) {}

  get qdefg(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"qdefg\"]]");
  }

}