import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Bid Request
 * Elements: 131
 */
export class BidRequestPage {
  constructor(private page: Page) {}

  get Added_Batch_1(): Locator {
    return this.page.locator("(//div[@class=\"card-body\"]//*[text()=\"$|DeletedBatchTime1|\"])[last()]");
  }

  get Added_Batch_2(): Locator {
    return this.page.locator("(//div[@class=\"card-body\"]//*[text()=\"$|DeletedBatchTime2|\"])[last()]");
  }

  get All_Bid_Request_Status(): Locator {
    return this.page.locator("(//label[contains(@class,\"dropdown-item d-flex\")])[position() >= 98 and position() <=111]");
  }

  get All_Bid_Requests2Bid_Requests(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Req. ID\"]//button)[$|count|]");
  }

  get All_Company_Name(): Locator {
    return this.page.locator("//label[text()=\"Select Company/CCode\"]/..//div[@class=\"dropdown-overflow\"]//input");
  }

  get All_Uploaded_Date(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Uploaded Date:\")])[$|Count|]");
  }

  get All_Status_From_Dropdown(): Locator {
    return this.page.locator("(//label[text()='Select Bid Request Status']//..//div[@class=\"cursor-pointer py-3 text-wrap\"])[position() > 2 and position() <= last()]");
  }

  get Apply_Selected_Option(): Locator {
    return this.page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]");
  }

  get Bid_Mapping_Id_Bid_requests(): Locator {
    return this.page.locator("(//input[@placeholder=\"Search\"])[2]");
  }

  get Bid_Mapping_IdSearch_Input_box(): Locator {
    return this.page.locator("(//div[@class=\"mb-0 overflow-hidden\"])[1]/../..//input[@placeholder=\"Search\"]");
  }

  get Bid_Req_IdBid_Req_Details(): Locator {
    return this.page.locator("//div[text()=\"Request ID\"]//following-sibling::h5");
  }

  get Bid_Req_IDUpload_Expired(): Locator {
    return this.page.locator("//td[@data-title=\"Status\"]//span[normalize-space(text())=\"Upload Expired\"]//ancestor::tr//td[@data-title=\"Bid Req. ID\"]");
  }

  get Bid_Request_Config_Menu(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/bid-request\"]");
  }

  get Bid_Request_Status_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Status\"]//span");
  }

  get Bid_Status_BidRequestsPage(): Locator {
    return this.page.locator("//button[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"Status\"]//span");
  }

  get Bid_StatusBid_Req_Details(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Status:\")]//h5");
  }

  get BidReqIDBid_Req_Page(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]");
  }

  get BidRequest_Company_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Company\"]//div");
  }

  get BidRequest_Details_Text(): Locator {
    return this.page.locator("//h3[text()=\"Bid Request Details\"]");
  }

  get Cancel_Button_Disabled(): Locator {
    return this.page.locator("//button[@aria-label=\"Cancel Bid Request\" and @disabled]");
  }

  get Cancelled(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]//..//span[@title=\"$|StatusToBeSet|\"]");
  }

  get Chase_Direct_DropdownUpload_Bidrequest(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[2]");
  }

  get Chase_Direct_DropdownUpload_Bidrequest_2(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[2]");
  }

  get Checkbox(): Locator {
    return this.page.locator("//label[text()='Select Bid Request Status']//..//input[@type=\"checkbox\"]");
  }

  get Clear_All(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Clear All\"]]/..");
  }

  get ColumnData(): Locator {
    return this.page.locator("//td[@data-title=\"$|IndividualHeaderName|\"]\n\n");
  }

  get Commitment_in_Progress(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]//..//span[@title=\"$|StatusToBeSet|\"]");
  }

  get Committed(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]//..//span[@title=\"$|StatusToBeSet|\"]");
  }

  get Company_Column_Data(): Locator {
    return this.page.locator("(//td[@data-title=\"Company\"])[17]");
  }

  get Company_Filter_Tube(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Company\")]");
  }

  get Company_Name(): Locator {
    return this.page.locator("//tr[contains(normalize-space(),\"A4187 87IWB29C724C Freedom A4187 $21.76M 33 / 20 Standard Expired 05/01/2025 04/30/2025\")]//td[@data-title=\"Company\"]");
  }

  get Company_Name_Count(): Locator {
    return this.page.locator("(//div[normalize-space(text())='Company']//..//..//..//..//..//div[@class=\"text-nowrap\"])");
  }

  get Company_Names1(): Locator {
    return this.page.locator("(//div[normalize-space(text())='Company']//..//..//..//..//..//div[@class=\"text-nowrap\"])[$|count|]");
  }

  get Continue_ButtonUpload_Pop_up(): Locator {
    return this.page.locator("//span[text()=\"Continue\"]/..");
  }

  get Corr_LoanName(): Locator {
    return this.page.locator("(//div[text()=\" Success \"])[1]/../..//td[@data-title=\"Corr. Loan#\"]//button[1]");
  }

  get Count_Of_Companies_After_Clear_All(): Locator {
    return this.page.locator("//td[@data-title=\"Company\"]//div[not(text()=\" $|ExpectedCompany| \")]");
  }

  get Data_Table_Rows_Count(): Locator {
    return this.page.locator("(//table[@role=\"table\"])[$|count|]//tbody//tr");
  }

  get Data_Tables_Count(): Locator {
    return this.page.locator("//table[@role=\"table\"]");
  }

  get Date_Filter_Tube_Bid_request_List(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Date\")]");
  }

  get Deepika_july(): Locator {
    return this.page.locator("//table[@aria-label=\"Data Table\"]//tr//td[contains(@data-title, \"Corr\")]/div/button[text()=\"Deepika_JULY_16_10-s0\"]");
  }

  get Delete_Bid_Request_Button(): Locator {
    return this.page.locator("(//td[@data-title=\"Actions\"])[1]//button[last()]");
  }

  get Delete_Early_Config_Button(): Locator {
    return this.page.locator("(//td[@data-title='Date' and contains(text(), '$|NextBusinessDateList|')]/..//button[2])");
  }

  get Deleted(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]//..//span[@title=\"$|StatusToBeSet|\"]");
  }

  get demo_individual_status(): Locator {
    return this.page.locator("//td[@data-title=\"Status\"]//span");
  }

  get demo_price_offered(): Locator {
    return this.page.locator("//td[@data-title=\"Corr. Loan#\"]");
  }

  get Disabled_Cancel_Button_Test(): Locator {
    return this.page.locator("//button[@aria-label=\"Cancel Bid Request\" and @aria-disabled=\"true\" ]//span[@aria-hidden=\"true\"]");
  }

  get Download_Bid_Request_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Download Bid Request\"]");
  }

  get Download_Grid_Button(): Locator {
    return this.page.locator("(//button[@aria-label=\"Download Grid\"])[$|count|]");
  }

  get Enabled_Time(): Locator {
    return this.page.locator("//option[@aria-disabled=\"false\"]");
  }

  get Entered_Bid_Mapping_ID(): Locator {
    return this.page.locator("//span[contains(text(),\"@|BidMappingID|\")]");
  }

  get Error_Description_ColumnBid_request_details(): Locator {
    return this.page.locator("(//td[@data-title=\"Error Description\"]//div)[last()]");
  }

  get ExecutionType_BidReq(): Locator {
    return this.page.locator("//div[@id=\"executionTypeLabel\"]//following-sibling::h5");
  }

  get ExecutionType_BidReq2(): Locator {
    return this.page.locator("(//div[@id=\"executionTypeLabel\"]//following-sibling::h5)[2]");
  }

  get File_Upload1(): Locator {
    return this.page.locator(" //div[@class='upload-container']//input[@type='file']\n");
  }

  get First_Bid_Request_Status(): Locator {
    return this.page.locator("(//label[text()='Select Bid Request Status']//..//div[@class=\"cursor-pointer py-3 text-wrap\"])[2]");
  }

  get First_Bid_Value(): Locator {
    return this.page.locator("(//td[@data-title=\"Bid Value\"])[1]");
  }

  get First_CheckboxData(): Locator {
    return this.page.locator("//tbody//input[@type=\"checkbox\"]");
  }

  get First_Company_Name_Text(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"]//input[@type=\"checkbox\"])[1]/..//span");
  }

  get First_Requested_Date(): Locator {
    return this.page.locator("(//td[@data-title=\"Requested\"])[1]");
  }

  get First_Status_Checkbox(): Locator {
    return this.page.locator("(//label[text()='Select Bid Request Status']//..//input[@type=\"checkbox\"])[2]");
  }

  get First_Status_From_the_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Status\"])[1]");
  }

  get First_Status_In_Column(): Locator {
    return this.page.locator("(//td[@data-title=\"Status\"])[1]//span");
  }

  get First_Uploaded_Date(): Locator {
    return this.page.locator("//td[@data-title=\"Uploaded\"][1]");
  }

  get Header_Name_UIBid_Request(): Locator {
    return this.page.locator("(((//table)[$|count|]//div[contains(@aria-label,\"Sort by\")])[position()<=5])[$|HeadersCount|]");
  }

  get Header_Sort_Up(): Locator {
    return this.page.locator("//span[contains(@class, 'small') and contains(@class, 'fa-sort-up')]");
  }

  get Impound_Types2loan_details(): Locator {
    return this.page.locator("//div[text()=\" Impound Types\"]/..//div[contains(@class,\"text-danger\")]//i[@aria-hidden=\"true\"]");
  }

  get Individual_Column_Data_UIBid_Request(): Locator {
    return this.page.locator("((//table)[$|count|]//tbody//tr[$|RowsCount|]//td[position()<=5])[$|ColumnCount|]");
  }

  get Individual_Column_Header(): Locator {
    return this.page.locator("((//th//div[@role=\"button\"])[position() >=1 and position() <= 7])[$|count|]");
  }

  get Individual_Column_Name(): Locator {
    return this.page.locator("//th[position() >1 and position() < last()][$|count|]");
  }

  get Individual_Company_Checkbox_Dropdown(): Locator {
    return this.page.locator("(((//div[@class=\"dropdown-overflow\"])[1]//input)[position() >= 1 and position() <= 7])[$|count|]");
  }

  get Individual_Date_Range(): Locator {
    return this.page.locator("//span[text()=\"Last One Month\"]");
  }

  get Individual_Header_NameBid_Request(): Locator {
    return this.page.locator("((//table)[$|count|]//div[contains(@aria-label,\"Sort by\")])[$|HeadersCount|]");
  }

  get Individual_Loan_NumDetails_Screen(): Locator {
    return this.page.locator("((//table)[$|count|]//td[@data-title=\"Errors\"]//div[not(contains(text(),\"No errors\"))]//ancestor::tr//td[@data-title=\"Corr. Loan#\"])[$|count1|]");
  }

  get Individual_Requested_Date(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Requested Date:\")])[$|count|]");
  }

  get Individual_Status_NameDropdown(): Locator {
    return this.page.locator("((//label[text()='Select Bid Request Status']//..//div[@class=\"cursor-pointer py-3 text-wrap\"])[position() > 1 and position() <= last()])[$|Count|]");
  }

  get Individual_Uploaded_Date(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Uploaded Date:\")])[$|count|]");
  }

  get Invalid_Error_TextDanger(): Locator {
    return this.page.locator("(//div[@class=\"tooltip-inner\"]//div[@class=\"text-danger\"])[$|count2|]");
  }

  get Invalid_Errors(): Locator {
    return this.page.locator("//div[@class=\"tooltip-inner\"]//div[@class=\"text-danger\"]");
  }

  get Laon_Field_Data_Validation_Status(): Locator {
    return this.page.locator("//div[text()=\" LoanFieldDataValidation \"]/../..//span");
  }

  get Loan_Num_Chase_Direct(): Locator {
    return this.page.locator("//div[@id=\"executionTypeLabel\"]//following-sibling::h5[(contains(text(),\"Chase Direct\"))]/ancestor::div[@class=\"accordion-item\"]//tr//td[@data-title=\"Loan Status\"]//div[not(contains(text(),\"Error\"))]/../..//td[@data-title=\"Last Name\"]//div[contains(text(),\"$|Last Name|\")]/../..//button[1]");
  }

  get Loan_Num_Standard(): Locator {
    return this.page.locator("//div[@id=\"executionTypeLabel\"]//following-sibling::h5[(contains(text(),\"Standard\"))]/ancestor::div[@class=\"accordion-item\"]//tr//td[@data-title=\"Loan Status\"]//div[not(contains(text(),\"Error\"))]/../..//td[@data-title=\"Last Name\"]//div[contains(text(),\"$|Last Name|\")]/../..//button[1]");
  }

  get LoanAmount(): Locator {
    return this.page.locator("//div[text()=\" Success \"]/../..//td[@data-title=\"Loan Amount\"]//div");
  }

  get LoansErrors(): Locator {
    return this.page.locator("(//td[@data-title=\"#Loans / #Errors\"])[$|Count|]");
  }

  get LoansErrorsCount(): Locator {
    return this.page.locator("(//td[@data-title=\"#Loans / #Errors\"])");
  }

  get LoanstatusCount(): Locator {
    return this.page.locator("//td[@data-title=\"Loan Status\"]//div");
  }

  get Mouse_Over_the_Error_Loan(): Locator {
    return this.page.locator("(//table)[$|count|]//td[@data-title=\"Corr. Loan#\"]//button[text()=\"$|IndividualLoanNum|\"]//ancestor::tr//td[@data-title=\"Errors\"]//div[not(contains(text(),\"No errors\"))]\n");
  }

  get MPRP_in_Corr_Loan(): Locator {
    return this.page.locator("//div[text()=\" Success \"]/../..//td//button[text()=\"MPRP\"]");
  }

  get Navigate_to_Previous(): Locator {
    return this.page.locator("(//div[@aria-label=\"Pagination Controls\"]//span)[2]");
  }

  get New_Company_In_Dropdown(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"]//span[not(contains(text(),\"@|Company name 1|\") or contains(text(),\"@|Company name 2|\"))])[1]");
  }

  get No_result_Bid_requests(): Locator {
    return this.page.locator("//td[@role=\"cell\" and text()=\" No result \"]");
  }

  get Option_in_PricingReturn_Dropdown_Pasttime(): Locator {
    return this.page.locator("//option[contains(text(),\"$|BatchTime|\")]");
  }

  get OptionsCountInPricingDropdownPastTime(): Locator {
    return this.page.locator("//option[@value and @aria-disabled=\"true\"]");
  }

  get Partially_Committed(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]//..//span[@title=\"$|StatusToBeSet|\"]");
  }

  get PQ_in_Corr_Loan(): Locator {
    return this.page.locator("(//div[text()=\" Success \"]/../..//td//button[text()=\"PQ\"])");
  }

  get Pricing_in_progress(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]//..//span[@title=\"$|StatusToBeSet|\"]");
  }

  get Processing_Failed_Status(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]//..//span[@title=\"$|StatusToBeSet|\"]");
  }

  get Processing_Status(): Locator {
    return this.page.locator("(//div[normalize-space(text())='Status']//..//..//..//..//..//div[@class=\"d-flex align-items-start\"])[$|count|]");
  }

  get Processing_Failed_Status_2(): Locator {
    return this.page.locator("(//div[normalize-space(text())='Status']//..//..//..//..//..//div[@class=\"d-flex align-items-start text-danger\"])[$|Count1|]");
  }

  get Qued_for_date_from_details(): Locator {
    return this.page.locator("//span[contains(text(),\"Queued For:\")]");
  }

  get Request_ID_TextScreen(): Locator {
    return this.page.locator("//div[text()=\"Request ID\"]");
  }

  get Requested_Date_Count(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Requested Date:\")]");
  }

  get RequestID(): Locator {
    return this.page.locator("//div[text()=\"Request ID\"]/..//h5");
  }

  get Required_Bid_Req_IDBid_Req_Page(): Locator {
    return this.page.locator("//button[contains(text(),\"$|BidReqIdPriceOffered|\")]");
  }

  get Required_Status_Name(): Locator {
    return this.page.locator("//span[text()=\"@|Status Name|\"]");
  }

  get Rows_above_Loan_Field_validation(): Locator {
    return this.page.locator("(//td[@data-title=\"Status\"]//span)[position() >=1 and position() <=5]");
  }

  get Rows_CountBid_Request(): Locator {
    return this.page.locator("(//table)[$|count|]//tbody[@role=\"rowgroup\"]//tr[@role=\"row\"]");
  }

  get Search_FieldFilters(): Locator {
    return this.page.locator("(//div[@class=\"d-flex\"]//div//button[@id=\"multiSelectDropDown\"])[last()]//following::input[@placeholder=\"Search\"]");
  }

  get Searched_BidRequest(): Locator {
    return this.page.locator("(//td[@data-title=\"Bid Req. ID\"]//button)");
  }

  get Second_Bid_Request_Checkbox(): Locator {
    return this.page.locator("//input[@id='chkItemPROCESSING_FAILEDundefined']");
  }

  get Second_Filter_TubeBidRequest_List(): Locator {
    return this.page.locator("(//div[@class=\"pill rounded-pill relative\"])[2]");
  }

  get Second_PQ_Button(): Locator {
    return this.page.locator("(//button[text()=\"PQ\"])[2]");
  }

  get Second_PS_Button(): Locator {
    return this.page.locator("(//button[text()=\"PS\"])[2]");
  }

  get Select_Bid_Request_Status_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Bid Request Status\"]]/..");
  }

  get Select_Date_Range_Error(): Locator {
    return this.page.locator("//div//span[@aria-label=\"Date: Select Date Range\"]");
  }

  get Selected_Company_Value_Upload_Bid_Request_Screen(): Locator {
    return this.page.locator("//*[@id=\"selectCompanyDropdown\"]//div[@class=\"flex-grow-1 text-start text-truncate\" and not(contains(text(),\"Select\"))]");
  }

  get Show_All(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Show All\"]]");
  }

  get Show_Selected(): Locator {
    return this.page.locator("//label[@for=\"chkItembidRequestStatusundefined\"]/following-sibling::div[@aria-label=\"Toggle sort selected\"]");
  }

  get Status_checkbox_Filter(): Locator {
    return this.page.locator("//input[@type=\"checkbox\" and @aria-label=\"Select $|StatusToBeSelected|\"]");
  }

  get Status_Filter_Tube(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Status\")]");
  }

  get Status_On_Home_Page(): Locator {
    return this.page.locator("//td[@data-title=\"Status\"]");
  }

  get StatusCheck(): Locator {
    return this.page.locator("//label[.//span[normalize-space(.)=\"$|StatusToBeSet|\"]]//input[@type=\"checkbox\"]");
  }

  get Success_Corr_Loan_Num(): Locator {
    return this.page.locator("(//tr[td[@data-title=\"Loan Status\"]//div[not(contains(text(),\"Error\"))]]//td[@data-title=\"Last Name\"]//div[contains(text(),\"$|Last Name|\")]/../..//td[@data-title=\"Corr. Loan#\"]//button)[1]");
  }

  get Third_Batch_From_the_Last(): Locator {
    return this.page.locator("(//div[@class=\"card-body\"]//h5)[position() = last()-2]");
  }

  get This_Calendar_Month_Option(): Locator {
    return this.page.locator("//button[@class=\"btn btn-link p-0 text-decoration-none fs-10\"]//span[text()='This Calendar Month']");
  }

  get This_Year_Requested_Date(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Requested Date:\")])[$|count_3|]");
  }

  get Todays_Pricing(): Locator {
    return this.page.locator("//select[contains(@class,\"form-select ng-pristine ng-invalid ng-touched\")]");
  }

  get Total_Error_Loan_Num(): Locator {
    return this.page.locator("((//table)[$|count|]//td[@data-title=\"Errors\"]//div[not(contains(text(),\"No errors\"))]//ancestor::tr//td[@data-title=\"Corr. Loan#\"])");
  }

  get Upload_Expired(): Locator {
    return this.page.locator("//div[@id=\"multiSelectOptionsDropDown\"]//div//div//label//input[@aria-label=\"Select Upload Expired\"]");
  }

  get Upload_Expired_Checkbox(): Locator {
    return this.page.locator("//span[text()=\"Upload Expired\"]//parent::div//preceding-sibling::input[@type=\"checkbox\"]");
  }

  get Uploaded_Date_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Uploaded\"]");
  }

  get Uploaded_Date_Count(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Uploaded Date:\")]");
  }

}