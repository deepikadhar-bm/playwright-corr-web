// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS22_TC01_Verify that when the bid has only the Standard execution type and Standard is disabled, the system blocks the submission.', async ({ page }) => {
    const testData: Record<string, string> = {
  "Resubmit Pricing Error Standard": "Execution type 'Standard' not permitted for client",
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

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Navigating_to_Customer_Permission_Page_and_disabling_the_sta(page, vars);
    // [DISABLED] Navigating to Customer Permission Page and disabling the standard type in freedom company 
    // await stepGroups.stepGroup_Navigating_to_Customer_Permission_Page_and_disabling_the_sta(page, vars);
    vars["ExecutionType"] = "Standard";
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String("3"))) {
      if (String(vars["count"]) === String("1")) {
        vars["StatusToBeSelected"] = "Price Offered";
      } else if (String(vars["count"]) === String("2")) {
        vars["StatusToBeSelected"] = "Upload Expired";
      } else {
        vars["StatusToBeSelected"] = "Expired";
      }
      await correspondentPortalPage.Bid_Requests_Side_Menu.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      if (true) /* Element Clear all Button1 is visible */ {
        await correspondentPortalPage.Clear_all_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      }
      await priceOfferedPage.Filter_Dropdown1.click();
      await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
      await bidRequestListPage.Required_Company_Checkbox_filter.check();
      await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
      await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
      await bidRequestPage.Status_checkbox_Filter.check();
      await expect(correspondentPortalPage.Apply_Selected_1_button_in_Rule).toBeVisible();
      await bidRequestDetailsPage.Apply_Selected_Button_2_filter.click();
      await applyFiltersButtonPage.Apply_Filters_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      if (true) /* Element Filtered Status BidRequest ID is not visible */ {
        await correspondentPortalPage.Show_20.click();
        await correspondentPortalPage.Set_page_size_to_50_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        if (true) /* Element Filtered Status BidRequest ID is not visible */ {
          while (!(await bidrequestPage.Filtered_Status_BidRequest_ID.isVisible())) {
            await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
          }
        }
      }
      await expect(correspondentPortalPage.Status).toContainText(vars["StatusToBeSelected"]);
      await bidrequestPage.Filtered_Status_BidRequest_ID.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
      await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeVisible();
      await correspondentPortalPage.Dropdown_selection_2.click();
      await page.waitForTimeout(5000);
      if (true) /* Element Second Enabled Time is visible */ {
        await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
        // [DISABLED] Scroll to the element Enabled Time into view
        // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
        // [DISABLED] Click on Enabled Time
        // await bidRequestPage.Enabled_Time.click();
      } else {
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page, vars);
        await stepGroups.stepGroup_Filtering_Status_and_Navigating_to_Filtered_Status_Bid_Reque(page, vars);
        await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
        await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeVisible();
        await correspondentPortalPage.Dropdown_selection_2.click();
        await bidRequestPage.Enabled_Time.click();
      }
      await bidRequestDetailsPage.Submit_Button_On_pop_up.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.getByText(testData["Resubmit Pricing Error Standard"]).waitFor({ state: 'visible' });
      await page.getByText(testData["Resubmit Pricing Error Standard"]).waitFor({ state: 'hidden' });
      await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
      await correspondentPortalPage.bidRequestDate_Next_Bussiness_Radio_Button.check();
      await expect(correspondentPortalPage.bidRequestDate_Next_Bussiness_Radio_Button).toBeVisible();
      await correspondentPortalPage.Dropdown_selection_2.click();
      await bidRequestPage.Enabled_Time.click();
      await bidRequestDetailsPage.Submit_Button_On_pop_up.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.getByText(testData["Resubmit Pricing Error Standard"]).waitFor({ state: 'visible' });
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await stepGroups.stepGroup_Navigating_to_Customer_Permission_and_enabling_the_Standard_(page, vars);
    // [DISABLED] Navigating to Customer Permission Page and disabling the standard type in freedom company (New)
    // await stepGroups.stepGroup_Navigating_to_Customer_Permission_Page_and_disabling_the_sta(page, vars);
  });
});
