import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Cross Bar in Bid Request
 * Elements: 1
 */
export class CrossBarInBidRequestPage {
  constructor(private page: Page) {}

  get ClearSearch_Action(): Locator {
    return this.page.locator("//i[contains(@class, 'fa-times')]");
  }

}