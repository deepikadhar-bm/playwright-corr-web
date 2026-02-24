// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1315 } from '../../../src/helpers/prereqs/prereq-1315';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1315(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS22_TC06_02.1_Perform the resubmit for pricing action for a bid with the Standard and chase type, and verify the values in the resubmitted record, ensuring validation of table data, loan details,', async ({ page }) => {

    const testData: Record<string, string> = {
  "ChaseFieldNameBeforeSubmit": "",
  "ChaseValueBeforeSubmit": "",
  "Execution Type Header": "Exe.Type",
  "Resubmit Pricing Error Standard1": "( nmlsId = 2767 )",
  "Company Name.": "Wik1C BeuLD MoJbr CoEmy LLpoJ  - A2964",
  "BidMappingID": "Deepika Aug1",
  "Geo Coding Reducer flow(Errors Column)": "Geo Coding error",
  "Bid Valid File(Error Description)": "No Errors",
  "Company Name New": "American Pacific  - A4257",
  "Email Success Message": "Email sent successfuly",
  "Loan Field Validation(Number)": "Deepika_June_invaliddatafield",
  "Bid Valid File(Loan Status)": "Success",
  "Bid Request ID Header": "BidRequestID",
  "Resubmit Pricing Error Chase Direct": "Execution type 'Chase Direct' not permitted for client",
  "Geo Coding happy flow(Error Description)": "No Errors",
  "Bid Enum Check(Loan Status)": "Error",
  "Pos Check(Errors Column)": "No eligibility results",
  "Eligibility Check(LoanStatus)": "Error",
  "Geo Coding Reducer flow(Error Description))": "Geocode unknown",
  "Selected Company Count": "2",
  "Geo Coding happy flow(Loan Status)": "Success",
  "Geo Coding happy flow (Errors Column)": "No errors",
  "Resubmit Pricing Error Standard": "Execution type 'Standard' not permitted for client",
  "MissingHeaders_ErrorMessage1": "Bid tape is missing values for following headers: Loan Purpose.",
  "Price Offered": "Price Offered",
  "Geo Coding Failed flow(Errors))": "Geo Coding error",
  "Ccode for freedom": "A4187",
  "MissingHeaders_ErrorMessage2": "Please verify the correct Map ID is selected or tape is formatted correctly.",
  "Geo Coding Reducer flow(Loan Status)": "Success",
  "Eligibility Check(Error Description)": "Minimum loan amount $5,000",
  "Stored_Text1": "10:10 AM",
  "Status Name": "Committed",
  "Bid Valid File(Error Column)": "No errors",
  "CompanyName3": "American Pacific - A4257",
  "Assigned Companies1": "Wik1C BeuLD MoJbr CoEmy LLpoJ",
  "SpecialCharacter_ErrorHeader": "EXTRA_SPACE_FOUND",
  "Geo Coding Failed flow(Loan Status)": "Error",
  "Pos Check(Loan Status)": "Error",
  "Loan Field Validation(Status)": "Error",
  "Eligibility Check(Error Column)": "Minimum Loan Amount $5,000",
  "Loan Field Validation(Error description)": "Loan value cannot be blank or zero for 'loan purpose'",
  "Last One Month": "Last One Month",
  "Resubmit Pricing Error Standard and Chase": "Execution type 'Standard' not permitted for client",
  "Reason For Cancellation": "To be Cancelled",
  "Reason For Deletion": "To be deleted",
  "Loan Field Validation(Error)": "Invalid Loan Data",
  "DeletingMessage for File": "You have selected to delete this file. Do you want to proceed?",
  "Resubmit Pricing Error Standard and Chase1": "( nmlsId = 2767 )",
  "Creating Batch Success Message": "Batch timing has been created successfull",
  "Bid Enum Check(Errors Column)": "Secondary Residence, Investment (NOO)]. Path: search.criteria.propertyUse is missing value",
  "Status Count 1": "3",
  "Display_Text1": "Delete Batch Time",
  "CompanyName(CustomerPermissions)": "Freedom - A4187",
  "New Company Name": "Home Sweet Mortgage",
  "CCode Header": "Ccode",
  "FileRow": "4",
  "SpecialCharacter_ErrorMessage": "Found extra space(s) in row 3 for 'Correspondent Loan Number'. Please modify and retry upload.",
  "Display_Text2": "Delete Batch",
  "Email Message Verification": "Do you want to resend Bid Offer email?",
  "BidMappingIDNew": "Default Map Internal",
  "Geo Coding Failed flow(Error Description)": "Geocode unknown, no eligibility results: cannot find zip detail information for : 09999",
  "Pos Check(Error Description)": "Not approved for [nonagency], no eligibility results",
  "MissingHeaders_ErrorHeader": "Missing Headers",
  "Search Field Company Name": "Wik1C",
  "DuplicateLoans_HeaderMessage": "Duplicate Loans",
  "Company Name": "Freedom - A4187",
  "Stored_Text": "09:19 AM",
  "Resubmit Pricing Error Chase Direct1": "( nmlsId = 2767 )",
  "DuplicateLoans_ErrorMessage": "Duplicate loan numbers contained in this file: Deepika_June_02_02, Deepika_June_02_04. Please remove these from the file and retry upload.",
  "Missing Headers(Error Message)": "Bid tape is missing values for following headers: Loan Purpose. Please verify the correct Map ID is selected or tape is formatted correctly.",
  "Bid Enum Check(Error Description)": "enum field occupancy type is missing value or value is not in valid list [primary residence, secondary residence, investment (noo)]. path: search.criteria.propertyuse is missing value"
}; // Profile: "Bid Requests", row: 0

    // [DISABLED] Verify that the element CCode Value(bid request details) displays text contains CCodeBeforeResubmit and With Scrollable FALSE
    // await expect(correspondentPortalPage.CCode_Valuebid_request_details).toContainText(vars["CCodeBeforeResubmit"]);
    // [DISABLED] Verify that the element Company Value(Bid Request Details) displays text contains CompanyBeforeResubmit and With Scrollable FALSE
    // await expect(bidRequestDetailsPage.Company_ValueBid_Request_Details).toContainText(vars["CompanyBeforeResubmit"]);
    // [DISABLED] Verify that the text RequestIDBeforeResubmit is not displayed in the element Request Id From Details and With Scrollable TRUE
    // await expect(bidRequestDetailsPage.Request_Id_From_Details).not.toContainText(vars["RequestIDBeforeResubmit"]);
    // [DISABLED] Verify that the element Bid Status From Details displays text contains Ready for Pricing and With Scrollable TRUE
    // await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Ready for Pricing");
    // [DISABLED] Verify that the element Bid Value parsed row displays text contains BidValueBeforeResubmit and With Scrollable TRUE
    // await expect(bidRequestDetailsPage.Bid_Value_parsed_row).toContainText(vars["BidValueBeforeResubmit"]);
    // [DISABLED] Verify that the element Execution Type Parsed Row displays text contains ExecutionBeforeResubmit and With Scrollable TRUE
    // await expect(bidRequestDetailsPage.Execution_Type_Parsed_Row).toContainText(vars["ExecutionBeforeResubmit"]);
    // [DISABLED] Verify that the element Parsed Total Loans displays text contains ParsedTotalLoansBeforeSubmit and With Scrollable FALSE
    // await expect(bidRequestDetailsPage.Parsed_Total_Loans).toContainText(vars["ParsedTotalLoansBeforeSubmit"]);
    // [DISABLED] Verify that the element Parsed Success Loans displays text contains ParsedSuccessLoansBeforeSubmit and With Scrollable FALSE
    // await expect(bidRequestDetailsPage.Parsed_Success_Loans).toContainText(vars["ParsedSuccessLoansBeforeSubmit"]);
    // [DISABLED] Verify that the element Parsed Errored loans displays text contains ParsedErroredLoansBeforeSubmit and With Scrollable FALSE
    // await expect(bidRequestDetailsPage.Parsed_Errored_loans).toContainText(vars["ParsedErroredLoansBeforeSubmit"]);
    // [DISABLED] Verify that the element Execution Type from Details (table1) displays text contains ExecutionTypeHeaderBeforeSubmitTable1 and With Scrollable TRUE
    // await expect(bidRequestDetailsPage.Execution_Type_from_Details_table1).toContainText(vars["ExecutionTypeHeaderBeforeSubmitTable1"]);
    // [DISABLED] Verify that the element Bid Value From Table Header1 displays text contains BidValueHeaderBeforeSubmitTable1 and With Scrollable FALSE
    // await expect(bidRequestDetailsPage.Bid_Value_From_Table_Header1).toContainText(vars["BidValueHeaderBeforeSubmitTable1"]);
    // [DISABLED] Verify that the element Total loans TableHeader 1 displays text contains TotalloansHeaderBeforeSubmitTable1 and With Scrollable FALSE
    // await expect(bidRequestDetailsPage.Total_loans_TableHeader_1).toContainText(vars["TotalloansHeaderBeforeSubmitTable1"]);
    // [DISABLED] Verify that the element Success Loans Header 1 displays text contains SuccessLoansHeaderBeforeSubmitTable1 and With Scrollable FALSE
    // await expect(bidRequestDetailsPage.Success_Loans_Header_1).toContainText(vars["SuccessLoansHeaderBeforeSubmitTable1"]);
    // [DISABLED] Verify that the element Errored Loans Header1 displays text contains ErrorredLoansHeaderBeforeSubmitTable1 and With Scrollable TRUE
    // await expect(bidRequestDetailsPage.Errored_Loans_Header1).toContainText(vars["ErrorredLoansHeaderBeforeSubmitTable1"]);
    // [DISABLED] Verifying the table data in bid request details from tdp
    // await stepGroups.stepGroup_Verifying_the_table_data_in_bid_request_details_from_tdp(page, vars);
    // [DISABLED] Click on First loan Number In table
    // await bidRequestDetailsPage.First_loan_Number_In_table.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Verify that the text RequestIdPopupBeforeSubmitTable1 is not displayed in the element Bid Request ID On Loan Details Popup and With Scrollable TRUE
    // await expect(bidRequestDetailsPage.Bid_Request_ID_On_Loan_Details_Popup).not.toContainText(vars["RequestIdPopupBeforeSubmitTable1"]);
    // [DISABLED] Verify that the element Bid Loan Number Loan Details Pop up displays text contains LoanNumberPopUpBeforeSubmitTable1 and With Scrollable FALSE
    // await expect(bidRequestDetailsPage.Bid_Loan_Number_Loan_Details_Pop_up).toContainText(vars["LoanNumberPopUpBeforeSubmitTable1"]);
    // [DISABLED] Verify that the element Errors Check On Laon Details Popup displays text contains ErrorsCheckPopupBeforeSubmitTable1 and With Scrollable FALSE
    // await expect(bidRequestDetailsPage.Errors_Check_On_Laon_Details_Popup).toContainText(vars["ErrorsCheckPopupBeforeSubmitTable1"]);
    // [DISABLED] Store the count of elements identified by locator ChaseFields Count Popup (Loan Details) into a variable ChaseFieldCountPopup
    // vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
    // [DISABLED] Store 1 in count
    // vars["count"] = "1";
    while (true) /* Verify if count <= ChaseFieldCountPopup */ {
      // [DISABLED] Click on Bid Request ID On Loan Details Popup
      // await bidRequestDetailsPage.Bid_Request_ID_On_Loan_Details_Popup.click();
      // [DISABLED] Store text from the element Individual Chase Field Name Popup into a variable ChaseFieldPopupAfterSubmit
      // vars["ChaseFieldPopupAfterSubmit"] = await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup.textContent() || '';
      // [DISABLED] Store text from the element Individual Chase Value popup2 into a variable ChaseValuePopupAfterSubmit
      // vars["ChaseValuePopupAfterSubmit"] = await bidRequestDetailsPage.Individual_Chase_Value_popup2.textContent() || '';
      for (let i = 0; i < 1; i++) /* Loop over data set in Chase Field Names and Values On Loan D */ {
        // [DISABLED] Verify that the element Individual Chase Field Name Popup displays text contains ChaseFieldNameBeforeSubmit and With Scrollable TRUE
        // await expect(bidRequestDetailsPage.Individual_Chase_Field_Name_Popup).toContainText(testData["ChaseFieldNameBeforeSubmit"]);
        if (true) /* Verify if ChaseValuePopupAfterSubmit == Key_blank */ {
          // [DISABLED] Verify if ChaseValueBeforeSubmit == Null
          // expect(String(testData["ChaseValueBeforeSubmit"])).toBe("Null");
        } else {
          // [DISABLED] Verify that the element Individual Chase Value popup2 displays text contains ChaseValueBeforeSubmit and With Scrollable TRUE
          // await expect(bidRequestDetailsPage.Individual_Chase_Value_popup2).toContainText(testData["ChaseValueBeforeSubmit"]);
        }
      }
      // [DISABLED] Perform addition on 1 and count and store the result inside a count considering 0 decimal places
      // vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    // [DISABLED] Click on Close Button Loan Details Popup
    // await correspondentPortalPage.Close_Buttonemail_config.click();
    await bidRequestDetailsPage.Last_Table_Program_Cell_Data_Bid_requests_details.scrollIntoViewIfNeeded();
    await expect(bidRequestDetailsPage.Execution_Type_from_detailstable2).toContainText(vars["ExecutionTypeHeaderBeforeSubmitTable2"]);
    await expect(bidRequestDetailsPage.Bid_Value_From_Table_Header1).toContainText(vars["BidValueHeaderBeforeSubmitTable2"]);
    await expect(bidRequestDetailsPage.Total_loans_TableHeader_1).toContainText(vars["TotalloansHeaderBeforeSubmitTable2"]);
    await expect(bidRequestDetailsPage.Success_Loans_Header_1).toContainText(vars["SuccessLoansHeaderBeforeSubmitTable2"]);
    await expect(bidRequestDetailsPage.Errored_Loans_Header1).toContainText(vars["ErrorredLoansHeaderBeforeSubmitTable2"]);
    await stepGroups.stepGroup_Verifying_the_table_data_in_bid_request_details_from_tdp(page, vars);
    await bidRequestDetailsPage.First_Loan_Number_Table_2.click();
    await stepGroups.stepGroup_Verifying_Second_Table_loan_details_On_popupBid_Request_Deta(page, vars);
    await expect(bidRequestDetailsPage.Footer_Submission_Date).not.toContainText(vars["FooterSubmssionBeforeSubmit"]);
    await expect(bidRequestDetailsPage.Footer_Queued_For_Date).not.toContainText(vars["FooterQueuedBeforeSubmit"]);
    await stepGroups.stepGroup_Verify_Footer_Submission_and_Queued_Date_For_Today_in_Bid_Re(page, vars);
  });
});
