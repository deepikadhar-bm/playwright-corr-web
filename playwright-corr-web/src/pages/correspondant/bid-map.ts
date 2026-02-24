import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bid map
 * Elements: 14
 */
export class BidMapPage {
  constructor(private page: Page) {}

  get BidMaps_Count_on_Mappings_Page(): Locator {
    return this.page.locator("//button[contains(text(),'$|Common KeyWord|')]");
  }

  get error_message_popup(): Locator {
    return this.page.locator("//*[contains(text(),\"Bid tape is missing values for following headers: Loan Purpose.\") and contains(text(),\"Please verify the correct Map ID is selected or tape is formatted correctly.\")]");
  }

  get Mapping_of_Header_and_2nd_BidMap(): Locator {
    return this.page.locator("//div[contains(text(),'$|HeaderValue|')]/ancestor::table[@aria-label=\"Data Table\"]//*[contains(text(),\"$|Row Value|\")]");
  }

  get Mapping_of_Header_and_1_stBidMap_Data(): Locator {
    return this.page.locator("//div[contains(text(),'$|1st Row Value|')]/ancestor::table[@aria-label=\"Data Table\"]//*[contains(text(),\"$|Row Value|\")]");
  }

  get Mapping_of_Header_and_3rd_BidMap_Data(): Locator {
    return this.page.locator("//div[contains(text(),'$|HeaderValue|')]/ancestor::table[@aria-label=\"Data Table\"]//*[contains(text(),\"$|Row Value|\")]");
  }

  get Mapping_of_Header_and_4th_BidMap_Data(): Locator {
    return this.page.locator("//div[contains(text(),'$|HeaderValue|')]/ancestor::table[@aria-label=\"Data Table\"]//*[contains(text(),\"$|Row Value|\")]");
  }

  get Mapping_of_Header_and_5th_BidMap_Data(): Locator {
    return this.page.locator("//div[contains(text(),'$|HeaderValue|')]/ancestor::table[@aria-label=\"Data Table\"]//*[contains(text(),\"$|Row Value|\")]");
  }

  get New_Field_Chase_Dropdown2(): Locator {
    return this.page.locator("(//input[@class=\"input-field-edit\"]/../../../../..//select[@class=\"form-select\"])[2]");
  }

  get Newly_Created_BidMap(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"Edit map\") and contains(text(),'@|Search Functionality BidMaps|')]");
  }

  get Required_Company_Checkbox_Bidmap_Company_dropdown(): Locator {
    return this.page.locator("((//input[@type=\"checkbox\" and not(contains(@aria-label,\"Home Sweet Mortgage\"))])[position() > 1 and position() < last()])[1]");
  }

  get SearchFilter_Input_Field(): Locator {
    return this.page.locator("//input[@placeholder=\"Search/Filter\"]");
  }

  get Select_All_Checkbox_For_BidMap(): Locator {
    return this.page.locator("//input[@aria-label=\"Select all for \" and @type=\"checkbox\"]");
  }

  get Show_All_Option(): Locator {
    return this.page.locator("//a[text()='Show All']");
  }

  get Third_Company_Checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[4]");
  }

}