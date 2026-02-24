import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bidmap
 * Elements: 15
 */
export class BidmapPage {
  constructor(private page: Page) {}

  get Click_On_Delete_Option(): Locator {
    return this.page.locator("\n//div[normalize-space(text())='$|disablevalue|']//..//..//..//i[@class=\"fa fas fa-trash trash-icon\"]");
  }

  get Created_Bid_Map_Delete_button(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"Edit map\") and contains(text(),'TS_SEARCHMAP')]/../..//button[@aria-label=\"Delete Map\"]");
  }

  get Created_New_Map_Name(): Locator {
    return this.page.locator("//button[normalize-space(text())='$|Create New Map|']");
  }

  get Data_In_Bid_Enumerated_Tape_Value(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[3]");
  }

  get Disable_Bid_Tape_Value(): Locator {
    return this.page.locator("(//div[@class=\"input-field-name text-truncate cursor-pointer\"])[5]");
  }

  get File_Name(): Locator {
    return this.page.locator("//span[text()='$|Upload File Name|']");
  }

  get First_Bid_Map_Name(): Locator {
    return this.page.locator("//button[@class=\"text-primary pointer border-0 bg-transparent\"]");
  }

  get headerForBidMapDetails(): Locator {
    return this.page.locator("(//th[@role=\"columnheader\"])[$|count|]");
  }

  get KeyWord_Related_Bid_Maps(): Locator {
    return this.page.locator("//span[contains(text(),'$|Common KeyWord|')]/parent::a");
  }

  get modificationTimezone_of_Header_and_BidMap_Data(): Locator {
    return this.page.locator("//div[contains(text(),'$|TableHeadersFromFile|')]/ancestor::table[@aria-label=\"Data Table\"]//*[contains(text(),\"$|CurrentDateAndTimezone|\")]");
  }

  get rowDataFromBidMap(): Locator {
    return this.page.locator("(//td[@role=\"cell\"])[$|Index|]");
  }

  get Store_Uploaded_File_Name(): Locator {
    return this.page.locator("//div[@class=\"text-truncate flex-grow-1\"]");
  }

  get Upload_File_Name_Text(): Locator {
    return this.page.locator("//div[text()='$|Upload File Name|']");
  }

  get Version_of_Header_and_BidMap_Data(): Locator {
    return this.page.locator("(//div[contains(text(),'Version')]/ancestor::table[@aria-label=\"Data Table\"]/..//span[text()='DRAFT']/../../..//*[contains(text(),\"$|RowDataFromBidMap|\")])[2]");
  }

  get Yes_Proceed_Button_Text(): Locator {
    return this.page.locator("//button[@aria-label=\"Yes, Proceed\"]");
  }

}