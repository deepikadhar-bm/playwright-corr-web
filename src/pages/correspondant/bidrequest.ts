import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bidrequest
 * Elements: 19
 */
export class BidrequestPage {
  constructor(private page: Page) {}

  get BidRequestID(): Locator {
    return this.page.locator("(//td[@data-title=\"#Loans / #Errors\"]/..//td[@data-title=\"Bid Req. ID\"])[$|Count|]");
  }

  get BidTapeValueUI(): Locator {
    return this.page.locator("(//div[text()=\"$|ColumnHeader|\" and not(@class=\"my-2\")]/../..//div[contains(@class,\"input-field-name\")])");
  }

  get Column_Headers_UI(): Locator {
    return this.page.locator("(//th//div[@role=\"button\"])[position() >=1 and position() < last()]");
  }

  get Company_SelectedSelect_Company_Dropdwn(): Locator {
    return this.page.locator("//div[@class=\"form-control p-0\"]//button//div");
  }

  get Danger_Error_Body_Text(): Locator {
    return this.page.locator("(//div[@class=\"tooltip-inner\"]//div[@class=\"text-secondary\"])[$|count2|]");
  }

  get Edited_Batch(): Locator {
    return this.page.locator("(//div[@class=\"card-body\"]//*[text()=\"$|LastBeforeBatchTime|\"])");
  }

  get Filtered_Lastmonth_Uploaded_Date(): Locator {
    return this.page.locator("//td[@data-title=\"Uploaded\"]//div[starts-with(text(),\" $|Last Month|\")]");
  }

  get Filtered_Status_BidRequest_ID(): Locator {
    return this.page.locator("//div[   contains(@aria-label, 'Loans total:') and   number(substring-before(substring-after(@aria-label, 'Loans total: '), ',')) < 10 ]/../..//td[@data-title=\"Execution Type\"]//div[text()=\" $|ExecutionType| \"]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"$|StatusToBeSelected|\")]/../../..//td[@data-title=\"Bid Req. ID\"]");
  }

  get First_Column_Data(): Locator {
    return this.page.locator("(//td[@data-title=\"$|IndividualHeaderName|\"])[1]");
  }

  get First_Filter_TubeBidRequest_List(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\"]");
  }

  get Individual_Company_Name_In_Dropdown(): Locator {
    return this.page.locator("(((//div[@class=\"dropdown-overflow\"])[1]//span)[position() >= 1 and position() <= 7])[$|count|]");
  }

  get Individual_RowUpload_progress_popup(): Locator {
    return this.page.locator("((//td[@data-title=\"Status\"])[position() >=7 and position()<=last()])[$|count|]");
  }

  get OptionsCountInPricingDropdown(): Locator {
    return this.page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]//option[position() >=2 and position() <=last()]\n\n\n");
  }

  get Price_Offered_Checkbox(): Locator {
    return this.page.locator("//label[@for=\"chkItemPRICE_OFFEREDundefined\"]//input");
  }

  get PS_in_Corr_Loan(): Locator {
    return this.page.locator("//div[text()=\" Success \"]/../..//td//button[text()=\"PS\"]");
  }

  get Queued_Next_Batch(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]//..//span[@title=\"$|StatusToBeSet|\"]");
  }

  get Rows_Below_Loan_Field(): Locator {
    return this.page.locator("(//td[@data-title=\"Status\"])[position() >=7 and position()<=last()]");
  }

  get StatusOfBidRequestID(): Locator {
    return this.page.locator("(//td[@data-title=\"Status\"])[$|Count|]");
  }

  get Uploaded_Date_Header(): Locator {
    return this.page.locator("(//th//div[@role=\"button\"])[9]");
  }

}