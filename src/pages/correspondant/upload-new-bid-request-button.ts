import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Upload New Bid Request Button
 * Elements: 1
 */
export class UploadNewBidRequestButtonPage {
  constructor(private page: Page) {}

  get Upload_New_Bid_Request_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Upload New Bid Request\"]]");
  }

}