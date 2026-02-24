import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Heading: BidMap
 * Elements: 4
 */
export class HeadingBidmapPage {
  constructor(private page: Page) {}

  get Bid_Sample_Field_Names(): Locator {
    return this.page.locator("(//div[@class=\"field-pair col-3\" and not(text()=\"Chase Value\") and not(text()=\"Chase Field\")][1])");
  }

  get Bid_Sample_Name(): Locator {
    return this.page.locator("(//div[@class=\"col-2\" and not(text()=\"Bid Sample Field Name\") and not(text()=\"Chase Field\")][1])[$|BidSampleField|]");
  }

  get BidMap(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"BidMap\"]]");
  }

  get Rules_and_ActionsPage_link(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"Rules and Actions\"]]");
  }

}