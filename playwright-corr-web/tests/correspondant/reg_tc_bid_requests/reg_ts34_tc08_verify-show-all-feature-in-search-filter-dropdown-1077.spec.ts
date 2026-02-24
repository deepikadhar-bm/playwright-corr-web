// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { FreedomA4187A4187CheckboxPage } from '../../../src/pages/correspondant/freedom-a4187-a4187-checkbox';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let freedomA4187A4187CheckboxPage: FreedomA4187A4187CheckboxPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestPage = new BidRequestPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    freedomA4187A4187CheckboxPage = new FreedomA4187A4187CheckboxPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS34_TC08_Verify show all feature In Search Filter Dropdown', async ({ page }) => {
    const testData: Record<string, string> = {
  "Selected Company Count": "2",
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

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    await freedomA4187A4187CheckboxPage.First_Company_Checkbox.check();
    await chaseFieldNamePage.Second_Company_Checkbox.check();
    vars["FirstCompanyName"] = await bidRequestPage.First_Company_Name_Text.textContent() || '';
    vars["SecondCompanyName"] = await correspondentPortalPage.Second_Company_Text.textContent() || '';
    await correspondentPortalPage.Show_Selected_Button.click();
    await expect(bidRequestPage.First_Company_Name_Text).toContainText(vars["FirstCompanyName"]);
    await expect(correspondentPortalPage.Second_Company_Text).toContainText(vars["SecondCompanyName"]);
    await expect(freedomA4187A4187CheckboxPage.First_Company_Checkbox).toBeVisible();
    await expect(chaseFieldNamePage.Second_Company_Checkbox).toBeVisible();
    vars["AllCompanyNameCount"] = String(await bidRequestPage.All_Company_Name.count());
    expect(String(vars["AllCompanyNameCount"])).toBe(testData["Selected Company Count"]);
    await correspondentPortalPage.Show_All_Button.click();
    vars["AllCompanyNameCount"] = String(await bidRequestPage.All_Company_Name.count());
    expect(String(vars["AllCompanyNameCount"])).toBe(testData["Selected Company Count"]);
    await correspondentPortalPage.Apply_Selected.click();
    // [DISABLED] Click on Select Bid Request Status Dropdown
    // await bidRequestPage.Select_Bid_Request_Status_Dropdown.click();
    // [DISABLED] Check the checkbox First Bid Request Checkbox
    // await correspondentPortalPage.First_Bid_Request_Checkbox.check();
    // [DISABLED] Check the checkbox Second Bid Request Checkbox
    // await bidRequestPage.Second_Bid_Request_Checkbox.check();
    // [DISABLED] Store text from the element First Bid Request Text into a variable FirstBidRequestText
    // vars["FirstBidRequestText"] = await correspondentPortalPage.First_Bid_Request_Text.textContent() || '';
    // [DISABLED] Store text from the element Second Bid Request Text into a variable SecondBidRequestText
    // vars["SecondBidRequestText"] = await correspondentPortalPage.Second_Bid_Request_Text.textContent() || '';
    // [DISABLED] Click on Show Selected
    // await bidRequestPage.Show_Selected.click();
    // [DISABLED] Verify that the element First Bid Request Text displays text FirstBidRequestText and With Scrollable FALSE
    // await expect(correspondentPortalPage.First_Bid_Request_Text).toContainText(vars["FirstBidRequestText"]);
    // [DISABLED] Verify that the element Second Bid Request Text displays text SecondBidRequestText and With Scrollable FALSE
    // await expect(correspondentPortalPage.Second_Bid_Request_Text).toContainText(vars["SecondBidRequestText"]);
    // [DISABLED] Verify that the element First Bid Request Checkbox is checked and With Scrollable FALSE
    // await expect(correspondentPortalPage.First_Bid_Request_Checkbox).toBeVisible();
    // [DISABLED] Verify that the element Second Bid Request Checkbox is checked and With Scrollable FALSE
    // await expect(bidRequestPage.Second_Bid_Request_Checkbox).toBeVisible();
    // [DISABLED] Store the count of elements identified by locator All Bid Request Status into a variable AllBidRequestStatus
    // vars["AllBidRequestStatus"] = String(await bidRequestPage.All_Bid_Request_Status.count());
    // [DISABLED] Click on Show All
    // await correspondentPortalPage.Show_All_Button.click();
    // [DISABLED] Store the count of elements identified by locator All Bid Request Status into a variable AllBidRequestStatus
    // vars["AllBidRequestStatus"] = String(await bidRequestPage.All_Bid_Request_Status.count());
    // [DISABLED] Verify if AllBidRequestStatus > 2
    // expect(String(vars["AllBidRequestStatus"])).toBe("2");
    // [DISABLED] Click on Apply Selected
    // await correspondentPortalPage.Apply_Selected.click();
  });
});
