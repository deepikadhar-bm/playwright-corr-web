import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bidrequest
 * Elements: 19
 */
export class BidrequestPage {
  constructor(private page: Page) {}

  BidRequestID(Count: string): Locator {
    return this.page.locator(`(//td[@data-title="#Loans / #Errors"]/..//td[@data-title="Bid Req. ID"])[${Count}]`);
  }

  BidTapeValueUI(ColumnHeader:string): Locator {
    return this.page.locator(`(//div[text()=\"${ColumnHeader}\" and not(@class=\"my-2\")]/../..//div[contains(@class,\"input-field-name\")])`);
  }

  get Column_Headers_UI(): Locator {
    return this.page.locator("(//th//div[@role=\"button\"])[position() >=1 and position() < last()]");
  }

  get Company_SelectedSelect_Company_Dropdwn(): Locator {
    return this.page.locator("//div[@class=\"form-control p-0\"]//button//div");
  }

  Danger_Error_Body_Text(count2:string): Locator {
    return this.page.locator(`(//div[@class=\"tooltip-inner\"]//div[@class=\"text-secondary\"])[${count2}]`);
  }

  Edited_Batch(LastBeforeBatchTime: String): Locator {
    return this.page.locator(`(//div[@class=\"card-body\"]//*[text()=\"${LastBeforeBatchTime}\"])`);
  }

  Filtered_Lastmonth_Uploaded_Date(lastMonth: string): Locator {
    return this.page.locator(`//td[@data-title="Uploaded"]//div[starts-with(text(), " ${lastMonth}")]`);
  }

  Filtered_Status_BidRequest_ID(ExecutionType: string, StatusToBeSelected: string): Locator {
    return this.page.locator(`//div[   contains(@aria-label, 'Loans total:') and   number(substring-before(substring-after(@aria-label, 'Loans total: '), ',')) < 10 ]/../..//td[@data-title=\"Execution Type\"]//div[text()=\" ${ExecutionType} \"]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"${StatusToBeSelected}\")]/../../..//td[@data-title=\"Bid Req. ID\"]`);
  }

  First_Column_Data(IndividualHeaderName: string): Locator {
    return this.page.locator(`(//td[@data-title="${IndividualHeaderName}"])[1]`);
  }

  get First_Filter_TubeBidRequest_List(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\"]");
  }

   Individual_Company_Name_In_Dropdown(count: string): Locator {
    return this.page.locator(`(((//div[@class="dropdown-overflow"])[1]//span)[position() >= 1 and position() <= 7])[${count}]`);
  }

  Individual_RowUpload_progress_popup(count: string): Locator {
    return this.page.locator(`((//td[@data-title="Status"])[position() >=7 and position()<=last()])[${count}]`);
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

  Queued_Next_Batch(StatusToBeSet:string): Locator {
    return this.page.locator(`//input[@type=\"checkbox\"]//..//span[@title=\"${StatusToBeSet}\"]`);
  }

  get Rows_Below_Loan_Field(): Locator {
    return this.page.locator("(//td[@data-title=\"Status\"])[position() >=7 and position()<=last()]");
  }

  StatusOfBidRequestID(count: string): Locator {
    return this.page.locator(`(//td[@data-title="Status"])[${count}]`);
  }

  get Uploaded_Date_Header(): Locator {
    return this.page.locator("(//th//div[@role=\"button\"])[9]");
  }

}