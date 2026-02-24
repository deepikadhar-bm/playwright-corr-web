// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS26_TC01_Verification Of Cancel and Delete Feature', async ({ page }) => {
    const testData: Record<string, string> = {
  "Reason For Cancellation": "To be Cancelled",
  "Reason For Deletion": "To be deleted",
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

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    // [DISABLED] Uploading Bid Request
    // await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    // [DISABLED] Uploading Bid Request(New)
    // await stepGroups.stepGroup_Uploading_Bid_RequestNew(page, vars);
    await stepGroups.stepGroup_Uploading_New_Bid_Request_Bid_Request_Screen(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestDetailsPage.Yes_Submit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_New_Bid_Request_Bid_Request_Screen(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestDetailsPage.Yes_Submit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await bidRequestPage.Select_Bid_Request_Status_Dropdown.click();
    await bidRequestsPage.Queued_for_Next_Batchbid_requests.check();
    await expect(bidRequestsPage.Queued_for_Next_Batchbid_requests).toBeVisible();
    await correspondentPortalPage.Apply_Selected.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestPage.First_Status_In_Column).toContainText("Queued");
    vars["CanceledBidRequestID"] = await correspondentPortalPage.First_Bid_Request_ID.textContent() || '';
    await correspondentPortalPage.Cancel_Bid_Request_Button.click();
    await expect(correspondentPortalPage.Cancel_Bid_Request_PopUp).toBeVisible();
    await expect(correspondentPortalPage.Yes_Go_ahead_Button_Bid_Request_List).toBeVisible();
    await correspondentPortalPage.Reason_for_cancelling_bid_request_Input.fill(testData["Reason For Cancellation"]);
    await correspondentPortalPage.Yes_Go_ahead_Button_Bid_Request_List.click();
    await page.waitForTimeout(4000);
    vars["FirstBidRequestIDAfterCancel"] = await correspondentPortalPage.First_Bid_Request_ID.textContent() || '';
    expect(String(vars["CanceledBidRequestID"])).toBe(vars["FirstBidRequestIDAfterCancel"]);
    vars["DeletedBidRequestId"] = await correspondentPortalPage.First_Bid_Request_ID.textContent() || '';
    await bidRequestPage.Delete_Bid_Request_Button.click();
    await expect(correspondentPortalPage.Yes_Go_ahead_Buttondelete).toBeVisible();
    await correspondentPortalPage.Reason_for_deleting_bid_request_Input.fill(testData["Reason For Deletion"]);
    await expect(correspondentPortalPage.Yes_Go_ahead_Buttondelete).toBeVisible();
    await correspondentPortalPage.Yes_Go_ahead_Buttondelete.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["FirstBidRequestIdAfterDelete"] = await correspondentPortalPage.First_Bid_Request_ID.textContent() || '';
    expect(String(vars["DeletedBidRequestId"])).toBe(vars["FirstBidRequestIdAfterDelete"]);
    await correspondentPortalPage.Clear_All_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["CanceledBidRequestID"] = String(vars["CanceledBidRequestID"]).trim();
    vars["DeletedBidRequestId"] = String(vars["DeletedBidRequestId"]).trim();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["CanceledBidRequestID"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.First_Bid_Request_ID).toContainText(vars["CanceledBidRequestID"]);
    await expect(bidRequestPage.First_Status_In_Column).toContainText("Cancelled");
    await bidRequestPage.First_Status_In_Column.hover();
    await expect(page.getByText(testData["Reason For Cancellation"])).toBeVisible();
    await expect(correspondentPortalPage.Cancel_Bid_Request_Button).toBeVisible();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.clear();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["DeletedBidRequestId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.First_Bid_Request_ID).toContainText(vars["DeletedBidRequestId"]);
    await expect(bidRequestPage.First_Status_In_Column).toContainText("Deleted by testsigma_internal");
    await bidRequestPage.First_Bid_Value.hover();
    await bidRequestPage.First_Status_In_Column.hover();
    await expect(page.getByText(testData["Reason For Deletion"])).toBeVisible();
    await expect(bidRequestPage.Delete_Bid_Request_Button).toBeVisible();
  });
});
