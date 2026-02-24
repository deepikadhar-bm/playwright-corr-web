// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { CoorespondentPage } from '../../../src/pages/correspondant/coorespondent';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { P15Active2Page } from '../../../src/pages/correspondant/p-15-active-2';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let coorespondentPage: CoorespondentPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let p15Active2Page: P15Active2Page;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    coorespondentPage = new CoorespondentPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    p15Active2Page = new P15Active2Page(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS22_TC09_Reprice bid for #Bid req ID\\\" popup Delete an existing batch record from the bulk batch config and validate that deleted time should no longer be displayed in the pricing return time dro', async ({ page }) => {
    const testData: Record<string, string> = {
  "Display_Text1": "Delete Batch Time",
  "Display_Text2": "Delete Batch",
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
  "CompanyName(CustomerPermissions)": "Freedom - A4187",
  "New Company Name": "Home Sweet Mortgage",
  "CCode Header": "Ccode",
  "FileRow": "4",
  "SpecialCharacter_ErrorMessage": "Found extra space(s) in row 3 for 'Correspondent Loan Number'. Please modify and retry upload.",
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
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(coorespondentPage.Last_Batch).toBeVisible();
    vars["LastBatchTime"] = await correspondentPortalPage.Last_Batch_Time.textContent() || '';
    vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
    vars["LastBatchTime(OneMinAdded)"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["LastBatchTime"]));
      d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
    })();
    await correspondentPortalPage.Delete_Batch_Time.hover();
    await expect(page.getByText(testData["Display_Text1"])).toBeVisible();
    await correspondentPortalPage.Delete_Batch_Time.click();
    await expect(page.getByText(testData["Display_Text2"])).toBeVisible();
    await correspondentPortalPage.Delete_batch.click();
    await expect(correspondentPortalPage.Each_Batch).not.toContainText(vars["LastBatchTime"]);
    await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    await bidRequestListPage.Required_Company_Checkbox_filter.check();
    await p15Active2Page.Apply_Selected_Button.click();
    await correspondentPortalPage.Select_Bid_Request_Status.click();
    await expect(correspondentPortalPage.Expired_Option).toBeVisible();
    await correspondentPortalPage.Expired_Option.check();
    await bidRequestDetailsPage.Apply_Selected_Button_2_filter.click();
    await expect(applyFiltersButtonPage.Apply_Filters_Button).toBeVisible();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.First_Bid_Request_ID).toBeVisible();
    await correspondentPortalPage.First_Bid_Request_ID.click();
    await correspondentPortalPage.ReSubmit_For_Pricing.click();
    await expect(correspondentPortalPage.Bid_Requested_Date).toBeVisible();
    await expect(correspondentPortalPage.Today).toBeEnabled();
    await correspondentPortalPage.Dropdown_selection_2.click();
    await expect(correspondentPortalPage.Dropdown_selection_2.locator('option', { hasText: vars["LastBatchTime(OneMinAdded)"] })).not.toBeVisible();
    await bidRequestDetailsPage.Next_Business_Day.check();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Dropdown_selection_2.click();
    await expect(correspondentPortalPage.Dropdown_selection_2.locator('option', { hasText: vars["LastBatchTime(OneMinAdded)"] })).not.toBeVisible();
  });
});
