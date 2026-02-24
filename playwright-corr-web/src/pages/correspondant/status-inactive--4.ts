import { Page, Locator } from '@playwright/test';

/**
 * Page Object: "status": " INACTIVE ",.........................................
 * Elements: 12
 */
export class StatusInactive4Page {
  constructor(private page: Page) {}

  get Attached_Type_In_Enumeration_Mapping(): Locator {
    return this.page.locator("(//div[text()=\"Attachment Type\"]/../..//select[@id=\"id\"])[4]");
  }

  get BidEnumaratedTapeValue_3(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/../../../../../..//div[contains(@class,\"flex-grow-1 text-start\")])[6]");
  }

  get BidMapping_ID_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Mapping\"]]");
  }

  get Chase_Field_In_EnumerationMapping(): Locator {
    return this.page.locator("//div[@class=\"my-2\"]/../../..//div[@class=\"col-2\"]");
  }

  get Chase_Values(): Locator {
    return this.page.locator("//select[contains(normalize-space(),\"Select\")]");
  }

  get Enabled_PricingReturnTime(): Locator {
    return this.page.locator("//option[contains(text(),\"$|BulkBatchTiming|\")]");
  }

  get Enter_Rule_Name(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]");
  }

  get Entered_Company_name(): Locator {
    return this.page.locator("//span[contains(text(),\"$|FirstCompanyname|\")]");
  }

  get Enum_SearchField(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Enum\"]]");
  }

  get Property_Valuation_Type_In_Enumeration_Mapping(): Locator {
    return this.page.locator("(//div[text()=\"Property Valuation Type\"]/../..//select[@id=\"id\"])[1]");
  }

  get Select_Category_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Category\"]]");
  }

  get Selected_Category_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Selected (1)\"]]");
  }

}