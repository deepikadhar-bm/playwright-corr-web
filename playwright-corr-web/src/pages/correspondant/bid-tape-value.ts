import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Bid Tape Value
 * Elements: 4
 */
export class BidTapeValuePage {
  constructor(private page: Page) {}

  get Bid_Tape_Value(): Locator {
    return this.page.locator("(//div[@class=\"input-field-name text-truncate cursor-pointer\"])[$|countBidTapeValue|]");
  }

  get Edited_Bid_Tape_Value(): Locator {
    return this.page.locator("//div[normalize-space(text())='$|BidTapeValue|']");
  }

  get Individual_Bid_Enum_Value(): Locator {
    return this.page.locator("(//div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class='col-2' ]//div[not(@class=\"my-2\")])[$|count|]");
  }

  get mapping_from_both(): Locator {
    return this.page.locator("//div[text()='$|Individual Bid Enum Value|']/../..//div[text()='$|Bid Tape Value|']");
  }

}