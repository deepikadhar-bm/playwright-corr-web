import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bid request details
 * Elements: 140
 */
export class BidRequestDetailsPage {
  constructor(private page: Page) {}

  get Bid_Enum_Check_Validation_On_Popup(): Locator {
    return this.page.locator("//div[text()=\" Bid Request Enumeration Mapping Validation \"]/../..//span");
  }

  get Errors_Check_On_Laon_Details_Popup(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1 d-flex gap-3\"]//div/div[@id=\"errorsCheckLabel\"]/..//h5[@aria-labelledby=\"errorsCheckLabel\"]");
  }

  get All_Success_Loan_Amount_Textbid_request_details_tbl1(): Locator {
    return this.page.locator("((//tbody)[1]//td[@data-title=\"Loan Status\"]//div[contains(text(),\"Success\")]/../..//td[@data-title=\"Loan Amount\"])[$|count1|]");
  }

  get Apply_Selected_Button_2_filter(): Locator {
    return this.page.locator("(//button[contains(normalize-space(),\"Apply Selected 1\")])[2]");
  }

  get Bid_Loan_Number_Loan_Details_Pop_up(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"bidRequestIdLabel\"])[2]");
  }

  get Bid_Request_Details_Text(): Locator {
    return this.page.locator("//div[@aria-label=\"Request ID Label\"]/..//h5");
  }

  get Bid_Request_ID_On_Loan_Details_Popup(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"bidRequestIdLabel\"])[1]");
  }

  get Bid_Status_From_Details(): Locator {
    return this.page.locator("//div[text()=\"Status\"]/..//h5");
  }

  get Bid_Upload_Progress_Header(): Locator {
    return this.page.locator("//div[@class=\"modal-header\"]/div/h5");
  }

  get Bid_Value_From_list(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Bid Value\"]");
  }

  get Bid_Value_from_Table_Header_2(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"bidValueLabel\"])[2]");
  }

  get Bid_Value_From_Table_Header1(): Locator {
    return this.page.locator("//h5[@aria-labelledby=\"bidValueLabel\"]");
  }

  get Bid_Value_parsed_row(): Locator {
    return this.page.locator("//div[text()=\"Total Bid Value\"]/..//h5");
  }

  get Bid_Valuesflbid_request_details(): Locator {
    return this.page.locator("//div[@aria-labelledby=\"executionHeader\"]//div/h5[@aria-labelledby=\"bidValueLabel\"]");
  }

  get bidRequestDate_Today_Radio_Button(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"Today\"]]/preceding-sibling::input[@type=\"radio\"]");
  }

  get BidRequestedDate_Label(): Locator {
    return this.page.locator("//label[text()=\"Bid Requested Date\"]");
  }

  get Ccode_From_List(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"CCode\"]");
  }

  get ChaseFields_Count_Popup_Loan_Details(): Locator {
    return this.page.locator("//div[@class=\"border-bottom p-2\"]");
  }

  get Close_Button_Loan_Details_Popup(): Locator {
    return this.page.locator("//button[@aria-label=\"Close\"]");
  }

  get Common_Execution_Type_Rowsbid_requests_details(): Locator {
    return this.page.locator("//div[@id=\"accordionHeader\"]");
  }

  get Company_ValueBid_Request_Details(): Locator {
    return this.page.locator("//div[text()=\"Company\"]/..//h5");
  }

  get Companybid_request_details(): Locator {
    return this.page.locator("//div[text()=\"Company\"]/..//h5");
  }

  get Continue_ButtonEnabled(): Locator {
    return this.page.locator("//div[@class=\"modal-footer\"]/button");
  }

  get Corr_Loantable1_bid_request_details(): Locator {
    return this.page.locator("((//table)[1]//tr[@role=\"row\"]//td[@data-title=\"Loan Status\"]//div[text()[normalize-space() = \"Success\"]]/../..//td[@data-title=\"Corr. Loan#\"])[$|count|]");
  }

  get Corr_Loantable2_bid_request_details(): Locator {
    return this.page.locator("((//table)[2]//tr[@role=\"row\"]//td[@data-title=\"Loan Status\"]//div[text()[normalize-space() = \"Success\"]]/../..//td[@data-title=\"Corr. Loan#\"])[$|count|]");
  }

  get demo_last_name(): Locator {
    return this.page.locator("//button[contains(text(),\"TestSigma_07-01-2026_SC1_ey_339\")]");
  }

  get Download_File_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Download File\"]");
  }

  get Eligibility_Pricing_Check_On_pop_up(): Locator {
    return this.page.locator("//div[text()=\" Eligibility Pricing \"]/../..//span");
  }

  get Error_Column_Data_Common(): Locator {
    return this.page.locator("(//td[@data-title=\"Errors\"]//div)");
  }

  get Error_Column_popup(): Locator {
    return this.page.locator("//div[text()=\"Enumeration\"]/..//div[@class=\"text-secondary\"]");
  }

  get Error_Column_Popup1(): Locator {
    return this.page.locator("//div[text()=\"Eligibility\"]/..//div[@class=\"text-secondary\"]");
  }

  get Error_Description_Column_DataCommon(): Locator {
    return this.page.locator("(//td[@data-title=\"Error Description\"]//div)");
  }

  get Error_Page(): Locator {
    return this.page.locator("//div[@id=\"modalBody\"]/b[text()=\" Cannot submit for pricing as last batch for pricing missed \"]");
  }

  get Errored_Loans_Count_from_Rows_table_1(): Locator {
    return this.page.locator("(//table)[1]//td[@data-title=\"Loan Status\"]//*[text()=\" Error \"]");
  }

  get Errored_Loans_Count_Rows_table_2(): Locator {
    return this.page.locator("(//table)[2]//td[@data-title=\"Loan Status\"]//*[text()=\" Error \"]");
  }

  get Errored_Loans_From_Details(): Locator {
    return this.page.locator("//div[@aria-label=\"Total Loan Rows Label\"]/..//span[contains(@aria-label,\"Errored Loans\")]");
  }

  get Errored_Loans_Header_2(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Errored Loans\")])[2]");
  }

  get Errored_Loans_Header1(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Errored Loans\")])[1]");
  }

  get Errors_Column(): Locator {
    return this.page.locator("(//td[@data-title=\"Errors\"]//div)[last()]");
  }

  get Errors_count_in_the_tool_tip(): Locator {
    return this.page.locator("//div[@class=\"tooltip-inner\"]//div[@class=\"text-danger\"]");
  }

  get Execution_Type_From_Details(): Locator {
    return this.page.locator("//div[text()=\" Execution Type \"]/..//h5");
  }

  get Execution_Type_from_Details_table1(): Locator {
    return this.page.locator("(//div[text()=\" Execution Type \"]/..//h5)[1]");
  }

  get Execution_Type_from_detailstable2(): Locator {
    return this.page.locator("(//div[text()=\" Execution Type \"]/..//h5)[2]");
  }

  get Execution_Type_Parsed_Row(): Locator {
    return this.page.locator("//div[@aria-label=\"Execution Type Label\"]/..//h5");
  }

  get Execution_Typecdbid_request_details(): Locator {
    return this.page.locator("//div[@aria-labelledby=\"executionHeader\"]//div/h5[text()=\"Chase Direct\"]");
  }

  get Execution_Typesflbid_request_details(): Locator {
    return this.page.locator("//div[@aria-labelledby=\"executionHeader\"]//div/h5[text()=\"Standard Flow Loans\"]");
  }

  get ExecutionTypebid_requests_details_counter(): Locator {
    return this.page.locator("(//div[text()=\" Execution Type \"]/..//h5)[$|count|]");
  }

  get Expected_Execution_Type_Parsed_Row(): Locator {
    return this.page.locator("//h5[contains(@aria-label,\"Execution Type\") and text()=\" SF($|SelectedLockTerm|d) \"]");
  }

  get Expected_Execution_Type_Parsed_rowcd(): Locator {
    return this.page.locator("//h5[contains(@aria-label,\"Execution Type\") and text()=\" CD($|SelectedLockTerm|d) \"]");
  }

  get First_Download_Icon(): Locator {
    return this.page.locator("(//i[contains(@class, 'fa-arrow-to-bottom')])[1]");
  }

  get First_error_data(): Locator {
    return this.page.locator("//td[@data-title=\"Errors\"]");
  }

  get First_loan_Number_In_table(): Locator {
    return this.page.locator("(//tbody//tr//td)[1]//button[1]");
  }

  get First_Loan_Number_Table_2(): Locator {
    return this.page.locator("(//tbody)[2]//tr[1]//td[1]//button[1]");
  }

  get Footer_Queued_For_Date(): Locator {
    return this.page.locator("//div[@id=\"page-footer\"]//span[contains(text(),\"Queued For\")]");
  }

  get Footer_Submission_Date(): Locator {
    return this.page.locator("//div[@id=\"page-footer\"]//span[@class=\"d-block\"]");
  }

  get Heading_Successful_Loans_4(): Locator {
    return this.page.locator(" //div[@aria-labelledby=\"executionHeader\"]//div/h5[text()=\"Chase Direct\"]/../..//div[text()='Total Loan Rows']/..//span[contains(@aria-label,\"Successful Loan\")]");
  }

  get Individual_Cell_Data(): Locator {
    return this.page.locator("(//tr[$|RowsCount|]//td)[$|ColumnCount|]");
  }

  get Individual_Cell_Data_from_table_2(): Locator {
    return this.page.locator("(//table)[2]//tr[$|RowsCount|]//td[$|ColumnCount|]");
  }

  get Individual_Cell_Data_Table(): Locator {
    return this.page.locator("(//td[@data-title=\"$|ColumnHeaderUI|\"])[$|RowsCountTable|]");
  }

  get Individual_Cell_Data_Table_2(): Locator {
    return this.page.locator("((//table)[2]//td[@data-title=\"$|ColumnHeaderUI|\"])[$|RowsCountTable|]");
  }

  get Individual_Cell_Table(): Locator {
    return this.page.locator("(//table)[$|count|]//tr[$|RowCountExcel|]//td[$|ColumnCount|]");
  }

  get Individual_Chase_Field_Name_Popup(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\"])[$|count|]");
  }

  get Individual_Chase_Value_Popup(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldNameBeforeSubmit|\")]/following-sibling::div)[1]");
  }

  get Individual_Chase_Value_popup2(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldPopupAfterSubmit|\")]/following-sibling::div)[1]");
  }

  get Individual_Error_Danger_TextTool_Tip(): Locator {
    return this.page.locator("(//div[@class=\"tooltip-inner\"]//div[@class=\"text-danger\"])[$|ErrorCount|]");
  }

  get Individual_Loan_Amount(): Locator {
    return this.page.locator("(//td[@data-title=\"Loan Amount\"])[$|count|]");
  }

  get Individual_Loan_Amount_table_2(): Locator {
    return this.page.locator("((//tbody)[2]//td[@data-title=\"Loan Amount\"])[$|count|]");
  }

  get Individual_PQ_Button(): Locator {
    return this.page.locator("(//td//button[text()=\"PQ\"])[$|RowsCount|]");
  }

  get Individual_PQ_Button_table2(): Locator {
    return this.page.locator("((//table)[2]//td//button[text()=\"PQ\"])[$|RowsCount|]");
  }

  get Individual_PS_Button(): Locator {
    return this.page.locator("(//td//button[text()=\"PS\"])[$|RowsCount|]");
  }

  get Individual_PS_Button_Table2(): Locator {
    return this.page.locator("((//table)[2]//td//button[text()=\"PS\"])[$|RowsCount|]");
  }

  get Last_Name_Sort_Button(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Last Name\"]");
  }

  get Last_Name_Sort_Button_2(): Locator {
    return this.page.locator("(//div[@aria-label=\"Sort by Last Name\"])[2]");
  }

  get Last_Nametable1_bid_request_details(): Locator {
    return this.page.locator("((//table)[1]//tr[@role=\"row\"]//td[@data-title=\"Loan Status\"]//div[text()[normalize-space() = \"Success\"]]/ancestor::tr//td[@data-title=\"Last Name\"]/div)[$|count|]");
  }

  get Last_Nametable2_bid_request_details(): Locator {
    return this.page.locator("((//table)[2]//tr[@role=\"row\"]//td[@data-title=\"Loan Status\"]//div[text()[normalize-space() = \"Success\"]]/ancestor::tr//td[@data-title=\"Last Name\"]/div)[$|count|]");
  }

  get Last_Table_Program_Cell_Data_Bid_requests_details(): Locator {
    return this.page.locator("(//td[@data-title=\"Program\"])[last()]");
  }

  get Loan_Amount_Sort_Button(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Loan Amount\"]");
  }

  get Loan_Amount_Sort_Button_2(): Locator {
    return this.page.locator("(//div[@aria-label=\"Sort by Loan Amount\"])[2]");
  }

  get Loan_Amounttable1_bid_request_details(): Locator {
    return this.page.locator("((//table)[1]//tr[@role=\"row\"]//td[@data-title=\"Loan Status\"]//div[text()[normalize-space() = \"Success\"]]/../..//td[@data-title=\"Loan Amount\"])[$|count|]");
  }

  get Loan_Amounttable2_bid_request_details(): Locator {
    return this.page.locator("((//table)[2]//tr[@role=\"row\"]//td[@data-title=\"Loan Status\"]//div[text()[normalize-space() = \"Success\"]]/../..//td[@data-title=\"Loan Amount\"])[$|count|]");
  }

  get Loan_Number_Column(): Locator {
    return this.page.locator("(//td[@data-title=\"Corr. Loan#\"]//button[1])[last()]");
  }

  get Loan_Number_DataCommon(): Locator {
    return this.page.locator("(//td[@data-title=\"Corr. Loan#\"]//div)[$|RowsCountTable|]");
  }

  get Loan_Number_Sort_Button_2(): Locator {
    return this.page.locator("(//th[@aria-label=\"Corr. Loan#\"]//span[contains(@class, 'small') and contains(@class, 'fa-sort')]/preceding-sibling::div)[2]");
  }

  get Loan_Status_Column(): Locator {
    return this.page.locator("(//td[@data-title=\"Loan Status\"]//div)[last()]");
  }

  get Loan_Status_ColumnCommon(): Locator {
    return this.page.locator("(//td[@data-title=\"Loan Status\"]//div)");
  }

  get Loan_Status_From_Details(): Locator {
    return this.page.locator("//table[@aria-label=\"Data Table\"]//td[@data-title=\"Loan Status\"]//div");
  }

  get LoansDataParsedRow(): Locator {
    return this.page.locator("//h5[@aria-label=\"Total Loan Rows\"]");
  }

  get LoansDataTableHeader(): Locator {
    return this.page.locator("//h5[@aria-labelledby=\"totalLoanRowsLabel\"]");
  }

  get LoanStatusCount(): Locator {
    return this.page.locator("//table[@aria-label=\"Data Table\"]//td[@data-title=\"Loan Status\"]");
  }

  get Moved_to_batch_pop_up(): Locator {
    return this.page.locator("//div[@id=\"modalBody\"]//b");
  }

  get Next_Business_Day(): Locator {
    return this.page.locator("(//form//div[@class=\"col\"]//div//input[@name=\"bidRequestDate\"])[2]");
  }

  get No_Errors_Count(): Locator {
    return this.page.locator("//td[@data-title=\"Errors\"]");
  }

  get Non_Empty_Loan_Status_Count(): Locator {
    return this.page.locator("//td[@data-title=\"Loan Status\" and normalize-space() != '']");
  }

  get Not_Approved_for_Conventional_Error_Description(): Locator {
    return this.page.locator("//td[@data-title=\"Error Description\"]//div[contains(text(),\"not approved for [conventional]\") or contains(text(),\"Not approved for [conventional]\")]");
  }

  get Ok_Click_Button(): Locator {
    return this.page.locator("//button[@type=\"button\"]/span[text()=\"Ok \"]");
  }

  get Parsed_Errored_loans(): Locator {
    return this.page.locator("(//h5[@aria-label=\"Total Loan Rows\"]//span[contains(@aria-label,\"Errored Loans\")])");
  }

  get Parsed_Success_Loans(): Locator {
    return this.page.locator("(//h5[@aria-label=\"Total Loan Rows\"]//span[contains(@aria-label,\"Successful Loans\")])");
  }

  get Parsed_Total_Loans(): Locator {
    return this.page.locator("(//h5[@aria-label=\"Total Loan Rows\"]//span[contains(@aria-label,\"Total Loans\")])");
  }

  get Passed_Queued_For_TimeRed_Colour_Text(): Locator {
    return this.page.locator("//span[@class=\"text-danger\" and contains(text(),\"Queued For\")]");
  }

  get Pos_Validation_Check_On_Popup(): Locator {
    return this.page.locator("//div[text()=\" POS Validation \"]/../..//span");
  }

  get PQ_button(): Locator {
    return this.page.locator("//button[text()=\"PQ\"]");
  }

  get Price_Offered_Status(): Locator {
    return this.page.locator("//td[@data-title=\"Status\"]//*[text()=\" Price Offered \"]");
  }

  get Price_Offered_Status_of_searched_bid(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"Price Offered\")]");
  }

  get Pricing_Dropdown(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]");
  }

  get Pricing_Return_Time_elapsed_page(): Locator {
    return this.page.locator("//div[@id=\"modalBody\" ]/div[@class=\"p-2\"]");
  }

  get Pricing_ReturnTime_Dropdown1(): Locator {
    return this.page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]/option");
  }

  get PS_button(): Locator {
    return this.page.locator("//button[text()=\"PS\"]");
  }

  get Queued_For_TimeBlack_colour_text(): Locator {
    return this.page.locator("//*[@class=\"text-dark\" and contains(text(),\"Queued For\")]");
  }

  get Queued_Forbid_request_details_text_dark(): Locator {
    return this.page.locator("//div/span[@class=\"text-dark\"]");
  }

  get Request_Id_From_Details(): Locator {
    return this.page.locator("//div[text()=\"Request ID\"]/..//h5");
  }

  get Request_IDbid_request_details(): Locator {
    return this.page.locator("//div[text()=\"Request ID\"]/..//h5");
  }

  get Resubmit_Pricing_Dropdown_new(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]");
  }

  get Rows_Count_Table_1(): Locator {
    return this.page.locator("(//table)[1]//tbody//tr");
  }

  get Rows_Count_Table_2(): Locator {
    return this.page.locator("(//tbody)[2]//tr");
  }

  get Searched_Data_in_List(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"])[2]/button[@role=\"option\"]//div/span[@title=\"$|CreatedBidMap|\"]");
  }

  get Selection_Dropdown_In_Resubmit_Popup(): Locator {
    return this.page.locator("(//select[@aria-label=\"Dropdown selection\"]//option)[position() > 1 and position() <= last()]");
  }

  get Status_Of_Request_Id(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIdFromDetails|\")]/../..//td[@data-title=\"Status\"]");
  }

  get Statusbid_request_details(): Locator {
    return this.page.locator("//div[text()=\"Status\"]/..//h5");
  }

  get Submit_Button_On_pop_up(): Locator {
    return this.page.locator("//button[contains(@class, 'btn-primary') and contains(@class, 'fw-bold')]");
  }

  get Submit_For_Pricingdisabled(): Locator {
    return this.page.locator("//div[@id=\"page-footer\"]//button[@disabled]");
  }

  get Submit_for_PricingEnabled(): Locator {
    return this.page.locator("//button/span[text()=\"Submit For Pricing\"]/..");
  }

  get Success_Loan_Amountbid_request_details_table2(): Locator {
    return this.page.locator("(//tbody)[2]//td[@data-title=\"Loan Status\"]//div[contains(text(),\"Success\")]/../..//td[@data-title=\"Loan Amount\"]");
  }

  get Success_Loan_Amountbid_request_detailstbl2(): Locator {
    return this.page.locator("(//tbody)[2]//td[@data-title=\"Loan Status\"]//div[contains(text(),\"Success\")]/../..//td[@data-title=\"Loan Amount\"]");
  }

  get Success_Loancdbid_request_details(): Locator {
    return this.page.locator(" //div[@aria-labelledby=\"executionHeader\"]//div/h5[text()=\"Chase Direct\"]/../..//div[text()='Total Loan Rows']/..//span[contains(@aria-label,\"Successful Loan\")]");
  }

  get Success_Loansfl_bid_request_details(): Locator {
    return this.page.locator(" //div[@aria-labelledby=\"executionHeader\"]//div/h5[text()=\"Standard Flow Loans\"]/../..//div[text()='Total Loan Rows']/..//span[contains(@aria-label,\"Successful Loan\")]");
  }

  get Success_Loans_Count_From_Rows_table1(): Locator {
    return this.page.locator("(//table)[1]//td[@data-title=\"Loan Status\"]//*[text()=\" Success \"]");
  }

  get Success_Loans_Header_1(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Successful Loans\")])[1]");
  }

  get Success_Loans_Header_2(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Successful Loans\")])[2]");
  }

  get Success_loans_Rows_Count_table_header_2(): Locator {
    return this.page.locator("(//table)[2]//td[@data-title=\"Loan Status\"]//*[text()=\" Success \"]");
  }

  get Success_Rowtable1_bid_request_details(): Locator {
    return this.page.locator("(//table)[1]//tr[@role=\"row\"]//td[@data-title=\"Loan Status\"]//div[text()[normalize-space() = \"Success\"]]");
  }

  get Success_Rowtable2_bid_request_details(): Locator {
    return this.page.locator("(//table)[2]//tr[@role=\"row\"]//td[@data-title=\"Loan Status\"]//div[text()[normalize-space() = \"Success\"]]");
  }

  get Tool_Tip_Text(): Locator {
    return this.page.locator("//div[@class=\"tooltip-inner\"]");
  }

  get Total_Loan_Amount_Count_Table1(): Locator {
    return this.page.locator("(//table)[1]//td[@data-title=\"Loan Amount\"]");
  }

  get Total_Loan_Amount_Count_Table2(): Locator {
    return this.page.locator("(//table)[2]//td[@data-title=\"Loan Amount\"]");
  }

  get Total_Loans_Count_From_Rows_table_1(): Locator {
    return this.page.locator("(//table)[1]//td[@data-title=\"Loan Status\"]");
  }

  get Total_Loans_From_Details(): Locator {
    return this.page.locator("//div[@aria-label=\"Total Loan Rows Label\"]/..//span[contains(@aria-label,\"Total Loans\")]");
  }

  get Total_loans_Table_header_2(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Total Loans\")])[2]");
  }

  get Total_loans_TableHeader_1(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Total Loans\")])[1]");
  }

  get Total_Success_Loantable1_bid_request_details(): Locator {
    return this.page.locator("(//tbody)[1]//td[@data-title=\"Loan Status\"]//div[contains(text(),\"Success\")]/../..//td[@data-title=\"Loan Amount\"]");
  }

  get Yes_Submit_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Yes Submit\"]");
  }

}