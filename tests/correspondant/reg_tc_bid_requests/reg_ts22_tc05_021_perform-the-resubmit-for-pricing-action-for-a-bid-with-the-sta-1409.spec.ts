// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1298 } from '../../../src/helpers/prereqs/prereq-1298';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1298(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS22_TC05_02.1_Perform the resubmit for pricing action for a bid with the Standard execution type, and verify the values in the resubmitted record(Target: Submit on next business day, upload expir', async ({ page }) => {

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

    await bidRequestDetailsPage.First_loan_Number_In_table.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestDetailsPage.Bid_Request_ID_On_Loan_Details_Popup).not.toContainText(vars["RequestIdPopupBeforeSubmit"]);
    await expect(bidRequestDetailsPage.Bid_Loan_Number_Loan_Details_Pop_up).toContainText(vars["LoanNumberPopUpBeforeSubmit"]);
    await expect(bidRequestDetailsPage.Errors_Check_On_Laon_Details_Popup).toContainText(vars["ErrorsCheckPopupBeforeSubmit"]);
    vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseFieldCountPopup"]))) {
      await bidRequestDetailsPage.Bid_Request_ID_On_Loan_Details_Popup.click();
      vars["ChaseFieldPopupAfterSubmit"] = await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup.textContent() || '';
      vars["ChaseValuePopupAfterSubmit"] = await bidRequestDetailsPage.Individual_Chase_Value_popup2.textContent() || '';
      for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
        await expect(bidRequestDetailsPage.Individual_Chase_Field_Name_Popup).toContainText(testData["ChaseFieldNameBeforeSubmit"]);
        if (String(vars["ChaseValuePopupAfterSubmit"]) === String("Key_blank")) {
          expect(String(testData["ChaseValueBeforeSubmit"])).toBe("Null");
        } else {
          await expect(bidRequestDetailsPage.Individual_Chase_Value_popup2).toContainText(testData["ChaseValueBeforeSubmit"]);
        }
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await correspondentPortalPage.Close_Buttonemail_config.click();
    await expect(bidRequestDetailsPage.Footer_Submission_Date).not.toContainText(vars["FooterSubmssionBeforeSubmit"]);
    await expect(bidRequestDetailsPage.Footer_Queued_For_Date).not.toContainText(vars["FooterQueuedBeforeSubmit"]);
    await stepGroups.stepGroup_Getting_Next_Bussiness_day_by_handling_weekend(page, vars);
    await stepGroups.stepGroup_Verifying_Footer_Queued_and_Submission_date_for_next_bussine(page, vars);
  });
});
