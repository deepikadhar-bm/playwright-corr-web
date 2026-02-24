import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Download Map
 * Elements: 2
 */
export class DownloadMapPage {
  constructor(private page: Page) {}

  get Download_Map(): Locator {
    return this.page.locator("(//span[@class=\"fas fa-download\"]/../../../..//td[@data-title=\"Version\"])[4]");
  }

  get Download_Map_in_Bid_Map(): Locator {
    return this.page.locator("(//span[contains(@class, 'fa-download')])[1]");
  }

}