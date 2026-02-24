import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Bid Sample Field Name for Header Mapping
 * Elements: 1
 */
export class BidSampleFieldNameForHeaderMappingPage {
  constructor(private page: Page) {}

  get Bid_Sample_Field_Name_for_Header_Mapping(): Locator {
    return this.page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]//div[@class=\"flex-grow-1\"])[5]");
  }

}