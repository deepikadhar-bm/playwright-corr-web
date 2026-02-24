import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Bid Enumerated Tape Value
 * Elements: 4
 */
export class BidEnumeratedTapeValuePage {
  constructor(private page: Page) {}

  get Count_Of_Select_Dropdown(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1 text-start text-truncate\"]");
  }

  get Duplicate_Bid_Enumerated_Tape_Value(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[6]");
  }

  get Duplicate_Bid_Enumerated_Tape_Value1(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1 text-start text-truncate\"]/../../../../..//button[@id=\"singleSelectDropDownWithSearch\"]//div[normalize-space(text())='Single']");
  }

  get Duplicate_Bid_Enumerated_Tape_Value2(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1 text-start text-truncate\"]/../../../../..//button[@id=\"singleSelectDropDownWithSearch\"]//div[normalize-space(text())='PUD']");
  }

}