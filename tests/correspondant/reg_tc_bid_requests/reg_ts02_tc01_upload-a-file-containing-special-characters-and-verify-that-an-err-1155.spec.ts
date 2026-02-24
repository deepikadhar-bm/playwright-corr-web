// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive4Page } from '../../../src/pages/correspondant/status-inactive--4';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;
  let statusInactive4Page: StatusInactive4Page;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive4Page = new StatusInactive4Page(page);
  });

  test('REG_TS02_TC01_Upload a file containing special characters and verify that an error popup is displayed. The popup should have the header \\\"Bid Upload Progress.\\\" Also, verify the correctness of the err', async ({ page }) => {
    const testData: Record<string, string> = {
  "SpecialCharacter_ErrorHeader": "EXTRA_SPACE_FOUND",
  "SpecialCharacter_ErrorMessage": "Found extra space(s) in row 3 for 'Correspondent Loan Number'. Please modify and retry upload.",
  "DeletingMessage for File": "You have selected to delete this file. Do you want to proceed?",
  "MissingHeaders_ErrorHeader": "Missing Headers",
  "DuplicateLoans_HeaderMessage": "Duplicate Loans",
  "DuplicateLoans_ErrorMessage": "Duplicate loan numbers contained in this file: Deepika_June_02_02, Deepika_June_02_04. Please remove these from the file and retry upload.",
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
  "Resubmit Pricing Error Standard and Chase1": "( nmlsId = 2767 )",
  "Creating Batch Success Message": "Batch timing has been created successfull",
  "Bid Enum Check(Errors Column)": "Secondary Residence, Investment (NOO)]. Path: search.criteria.propertyUse is missing value",
  "Status Count 1": "3",
  "Display_Text1": "Delete Batch Time",
  "CompanyName(CustomerPermissions)": "Freedom - A4187",
  "New Company Name": "Home Sweet Mortgage",
  "CCode Header": "Ccode",
  "FileRow": "4",
  "Display_Text2": "Delete Batch",
  "Email Message Verification": "Do you want to resend Bid Offer email?",
  "BidMappingIDNew": "Default Map Internal",
  "Geo Coding Failed flow(Error Description)": "Geocode unknown, no eligibility results: cannot find zip detail information for : 09999",
  "Pos Check(Error Description)": "Not approved for [nonagency], no eligibility results",
  "Search Field Company Name": "Wik1C",
  "Company Name": "Freedom - A4187",
  "Stored_Text": "09:19 AM",
  "Resubmit Pricing Error Chase Direct1": "( nmlsId = 2767 )",
  "Missing Headers(Error Message)": "Bid tape is missing values for following headers: Loan Purpose. Please verify the correct Map ID is selected or tape is formatted correctly.",
  "Bid Enum Check(Error Description)": "enum field occupancy type is missing value or value is not in valid list [primary residence, secondary residence, investment (noo)]. path: search.criteria.propertyuse is missing value"
}; // Profile: "Bid Requests", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    if (true) /* Element Second Enabled Time is visible */ {
      await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
      vars["SelectedEnabledTime"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
      // [DISABLED] Store text from the element Enabled Time into a variable EnabledTime
      // vars["EnabledTime"] = await bidRequestPage.Enabled_Time.textContent() || '';
      // [DISABLED] Select option by text EnabledTime in the Pricing_Return_Time list
      // await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: vars["EnabledTime"] });
    } else {
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page, vars);
      await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
      await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
      await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
      await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
      vars["SelectedEnabledTime"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
      // [DISABLED] Scroll to the element Enabled Time into view
      // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
      // [DISABLED] Store text from the element Enabled Time into a variable EnabledTime
      // vars["EnabledTime"] = await bidRequestPage.Enabled_Time.textContent() || '';
      // [DISABLED] Select option by text EnabledTime in the Pricing_Return_Time list
      // await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: vars["EnabledTime"] });
      // [DISABLED] Store the text of the selected option from Pricing_Return_Time list into a variable SelectedEnabledTime
      // vars["SelectedEnabledTime"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    }
    // [DISABLED] Store text from the element Enabled_PricingReturnTime into a variable PricingReturnTime
    // vars["PricingReturnTime"] = await statusInactive4Page.Enabled_PricingReturnTime.textContent() || '';
    // [DISABLED] Click on Pricing_Return_Time
    // await correspondentPortalPage.Pricing_Return_Time.click();
    // [DISABLED] Scroll up to the element Enabled_PricingReturnTime into view
    // await statusInactive4Page.Enabled_PricingReturnTime.scrollIntoViewIfNeeded();
    // [DISABLED] Click on Enabled_PricingReturnTime
    // await statusInactive4Page.Enabled_PricingReturnTime.click();
    // [DISABLED] Remove the no of ( 1,1 ) positions of given string SelectedEnabledTime and store into runtime variable SelectedEnabledTime
    // vars["SelectedEnabledTime"] = String(vars["SelectedEnabledTime"]).substring(1, String(vars["SelectedEnabledTime"]).length - 1);
    vars["SelectedEnabledTime"] = String(vars["SelectedEnabledTime"]).trim();
    await expect(correspondentPortalPage.Pricing_Return_Time).toHaveValue(vars["SelectedEnabledTime"]);
    await expect(page.getByText("Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt")).toBeVisible();
    await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "Bid_Special_character_space.xlsx"));
    await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
    await correspondentPortalPage.UploadBid_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Bid Upload Progress")).toBeVisible();
    await expect(page.getByText(testData["SpecialCharacter_ErrorHeader"])).toBeVisible();
    await expect(page.getByText(testData["SpecialCharacter_ErrorMessage"])).toBeVisible();
    await correspondentPortalPage.Okay_Close_Button.click();
    await correspondentPortalPage.Delete_Button_BidRequest.click();
    await expect(page.getByText(testData["DeletingMessage for File"])).toBeVisible();
    await correspondentPortalPage.Yes_proceed_Button_BidRequest.click();
    // [DISABLED] Upload file Bid_Missing_headers.xlsx,Bid_Missing_headers.xlsx using the element UploadFile [BidRequest]
    // await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "Bid_Missing_headers.xlsx"));
    // [DISABLED] Click on Upload Bid Button
    // await correspondentPortalPage.UploadBid_Button.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Verify that the current page displays text Bid Upload Progress
    // await expect(page.getByText("Bid Upload Progress")).toBeVisible();
    // [DISABLED] Verify that the current page displays text MissingHeaders_ErrorHeader
    // await expect(page.getByText(testData["MissingHeaders_ErrorHeader"])).toBeVisible();
    // [DISABLED] Verify that the current page displays text Bid tape is missing values for following headers: Loan Purpose.
    // await expect(page.getByText("Bid tape is missing values for following headers: Loan Purpose.")).toBeVisible();
    // [DISABLED] Verify that the current page displays text Please verify the correct Map ID is selected or tape is formatted correctly.
    // await expect(page.getByText("Please verify the correct Map ID is selected or tape is formatted correctly.")).toBeVisible();
    // [DISABLED] Click on Okay, Close Button
    // await correspondentPortalPage.Okay_Close_Button.click();
    // [DISABLED] Click on Delete Button_BidRequest
    // await correspondentPortalPage.Delete_Button_BidRequest.click();
    // [DISABLED] Verify that the current page displays text DeletingMessage for File
    // await expect(page.getByText(testData["DeletingMessage for File"])).toBeVisible();
    // [DISABLED] Click on Yes, proceed_Button [BidRequest]
    // await correspondentPortalPage.Yes_proceed_Button_BidRequest.click();
    // [DISABLED] Upload file Bid_Duplicate_file.xlsx,Bid_Duplicate_file.xlsx using the element UploadFile [BidRequest]
    // await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "Bid_Duplicate_file.xlsx"));
    // [DISABLED] Click on Upload Bid Button
    // await correspondentPortalPage.UploadBid_Button.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Verify that the current page displays text Bid Upload Progress
    // await expect(page.getByText("Bid Upload Progress")).toBeVisible();
    // [DISABLED] Verify that the current page displays text DuplicateLoans_HeaderMessage
    // await expect(page.getByText(testData["DuplicateLoans_HeaderMessage"])).toBeVisible();
    // [DISABLED] Verify that the current page displays text DuplicateLoans_ErrorMessage
    // await expect(page.getByText(testData["DuplicateLoans_ErrorMessage"])).toBeVisible();
    // [DISABLED] Click on Okay, Close Button
    // await correspondentPortalPage.Okay_Close_Button.click();
    // [DISABLED] Click on Delete Button_BidRequest
    // await correspondentPortalPage.Delete_Button_BidRequest.click();
    // [DISABLED] Verify that the current page displays text DeletingMessage for File
    // await expect(page.getByText(testData["DeletingMessage for File"])).toBeVisible();
    // [DISABLED] Click on Yes, proceed_Button [BidRequest]
    // await correspondentPortalPage.Yes_proceed_Button_BidRequest.click();
  });
});
