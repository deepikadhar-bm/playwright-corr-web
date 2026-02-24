import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Download Map..
 * Elements: 1
 */
export class DownloadMap2Page {
  constructor(private page: Page) {}

  get Download_Map(): Locator {
    return this.page.locator("(//span[contains(@class,'fas fa-download')])[1]");
  }

}