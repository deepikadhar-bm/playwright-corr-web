import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bid request list
 * Elements: 17
 */
export class BidRequestListPage {
  constructor(private page: Page) {}

  get BidStatus_From_List(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]");
  }

  get Company_Name_From_List(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Company\"]");
  }

  get Execution_type_from_List(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Execution Type\"]");
  }

  get Filtered_Status_BidRequest_ID_ChaseDirect(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[text()=\" Chase Direct \"]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"$|StatusToBeSelected|\")]/../../..//td[@data-title=\"Bid Req. ID\"]");
  }

  get Filtered_Status_BidRequest_ID_Standard_and_chase(): Locator {
    return this.page.locator("//div[   contains(@aria-label, 'Loans total:') and   number(substring-before(substring-after(@aria-label, 'Loans total: '), ',')) <= 10 ]/../..//td[@data-title='Execution Type']/div[normalize-space(.) = 'Standard , Chase Direct']/../..//td[@data-title=\"Status\"]//*[text()=\" $|StatusToBeSelected| \"]/../../..//td[@data-title=\"Bid Req. ID\"]");
  }

  get First_Cancel_Button(): Locator {
    return this.page.locator("(//button[@aria-label=\"Cancel Bid Request\"])[1]");
  }

  get First_Record_Bid_Status(): Locator {
    return this.page.locator("(//td[@data-title=\"Status\"])[1]");
  }

  get LoanErrors_From_List(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"#Loans / #Errors\"]");
  }

  get Queued_For_next_business_day_cancel_button(): Locator {
    return this.page.locator("(//td[@data-title=\"Status\"]//*[contains(text(),\"Queued For Next Business Day\")]/../../..//button[@aria-label=\"Cancel Bid Request\"])[1]");
  }

  get Request_Id_From_list(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Bid Req. ID\"]");
  }

  get Request_Id_to_select(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIdFromDetails|\")]");
  }

  get Requested_date_from_List(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Requested\"]");
  }

  get Required_Company_Checkbox_filter(): Locator {
    return this.page.locator("//input[@type=\"checkbox\" and contains(@aria-label,\"@|Company Name|\")]");
  }

  get Respective_Bid_Cancel_Button_list(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//button[@aria-label=\"Cancel Bid Request\"]");
  }

  get Select_Date_From_CalenderCurrent_date(): Locator {
    return this.page.locator("//span[normalize-space(text())='$|CurrentDate|' and @class=\"custom-day\"]");
  }

  get Selection_Dropdown_In_Resubmit_Popup2(): Locator {
    return this.page.locator("((//select[@aria-label=\"Dropdown selection\"]//option)[position() > 1 and position() <= last()])[$|count|]");
  }

  get Uploaded_date_from_list(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Uploaded\"]");
  }

}