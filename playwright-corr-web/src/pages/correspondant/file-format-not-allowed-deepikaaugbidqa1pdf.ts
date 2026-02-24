import { Page, Locator } from '@playwright/test';

/**
 * Page Object: File format not allowed: DeepikaAugBidQA-_1_.pdf
 * Elements: 1
 */
export class FileFormatNotAllowedDeepikaaugbidqa1pdfPage {
  constructor(private page: Page) {}

  get Error_Message_in_Creation_Of_Bid_Maps(): Locator {
    return this.page.locator("//div[@class=\"error-message\"]");
  }

}