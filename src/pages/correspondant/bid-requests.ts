import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Bid Requests
 * Elements: 30
 */
export class BidRequestsPage {
  constructor(private page: Page) {}

  get All_Bid_RequestsBid_Requests(): Locator {
    return this.page.locator("//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Req. ID\"]//button");
  }

  get Assigned_Companies1(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'@|Company Name.|')]");
  }

  get Bid_ID_Contains_SearchedID(): Locator {
    return this.page.locator("//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Req. ID\"]//button[contains(@aria-label, \"$|IDSearchedFor|\")]");
  }

  get BidRequests_Menu(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Bid Requests\"] and contains(@class, 'hide-text')]");
  }

  get Company_Dropdown_Input_field(): Locator {
    return this.page.locator("(//div[contains(@class, \"form-control\")]//button)[1]");
  }

  get Count_of_Columns_Request_list(): Locator {
    return this.page.locator("//th[position() > 1 and position() < last()]");
  }

  get Cross_Button_in_Search_Field(): Locator {
    return this.page.locator("//button[contains(@class,\"search-cancel-btn\")]//i");
  }

  get First_Enabled_Time(): Locator {
    return this.page.locator("//option[@aria-disabled=\"false\"][1]");
  }

  get Individual_Company_Under_Bid_Request_Dropdown(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'$|Company Name|')]");
  }

  get Individual_Customer_Company_Name(): Locator {
    return this.page.locator("(//td[@data-title='Company Name'])[$|CompanyCount|]");
  }

  get Loans_Errors_From_Bid_Requests_List(): Locator {
    return this.page.locator("//table[@aria-label=\"Data Table\"]//td[@data-title=\"#Loans / #Errors\"]//div");
  }

  get LoansErrorStatus_From_List(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"#Loans / #Errors\"]");
  }

  get MapNameFromUI(): Locator {
    return this.page.locator("//div[contains(text(),'Map Name')]/ancestor::table[@aria-label=\"Data Table\"]//td//button");
  }

  get Navigate_to_Next(): Locator {
    return this.page.locator("(//div[@aria-label=\"Pagination Controls\"]//span)[4]");
  }

  get Navigate_To_Page(): Locator {
    return this.page.locator("(//div[@aria-label=\"Pagination Controls\"]//span)[3]");
  }

  get Processing_Failed(): Locator {
    return this.page.locator("//label//div/span[text()=\"$|StatusToBeSet\"]");
  }

  get Queued_for_Next_Batchbid_requests(): Locator {
    return this.page.locator("//input[@type=\"checkbox\" and @id=\"chkItemQUEUED_NEXT_BATCHundefined\"]");
  }

  get Queued_Forbid_request_details_text_danger(): Locator {
    return this.page.locator("//div/span[@class=\"text-danger\"]");
  }

  get Queued_For_Next_Business_Day(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]//..//span[@title=\"$|StatusToBeSet|\"]");
  }

  get Requested_Date_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Requested\"]");
  }

  get Requested_Date_Header(): Locator {
    return this.page.locator("(//th//div[@role=\"button\"])[8]");
  }

  get Required_Status(): Locator {
    return this.page.locator("//label/div/span[@title=\"$|StatusToBeCheck\"]");
  }

  get Required_Status_Selection(): Locator {
    return this.page.locator("//label[.//span[normalize-space(.)=\"$|StatusToBeCheck|\"]]");
  }

  get Search_by_Bid_Request_ID_Field(): Locator {
    return this.page.locator("//div//input[@placeholder=\"Search By Bid Request ID\"]");
  }

  get Search_For_Required_Status(): Locator {
    return this.page.locator("(//input[@id=\"searchBox\"])[2]");
  }

  get Selected_Date_Result(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Requested Date:\")])[$|count_4|]");
  }

  get Total_Row_in_Company_Column(): Locator {
    return this.page.locator("//td[@data-title=\"Company\"]");
  }

  get Total_Row_with_Required_Company(): Locator {
    return this.page.locator("//td[@data-title=\"Company\"]//div[text()=\" @|Company Name| \"]");
  }

  get Unfiltered_Dates(): Locator {
    return this.page.locator("//td[@data-title=\"Uploaded\"]//div[not(starts-with(text(),\" $|Last Month|\"))]");
  }

  get Uploaded_Date_Count(): Locator {
    return this.page.locator("//td[@data-title=\"Uploaded\"]");
  }

}