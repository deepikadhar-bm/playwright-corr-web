// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactive3Page } from '../../../src/pages/correspondant/status-inactive--3';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactive3Page: StatusInactive3Page;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestPage = new BidRequestPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactive3Page = new StatusInactive3Page(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS01_TC11_Select Required Company Scenario', async ({ page }) => {
    const testData: Record<string, string> = {
  "All Company Name": "",
  "UniqueColHeader/Enum": "TsSearchUniqueColHeaderEnum",
  "Save and Move to Next Page": "Save and Move to Next Page",
  "CSS Attribute": "2px solid rgb(227, 82, 5)",
  "Used Headers": "Show Used Headers",
  "2-4 Unit": "2-4 Unit",
  "Search Map Input": "Deepika Aug1",
  "Chase_Field_Name1": "Mortgage Type",
  "Rule Name": "Rule 1",
  "Unidentified Headers": "Show Unidentified Headers",
  "Operations": "GREATER",
  "BidFields.": "DTI",
  "Search Fields": "hii",
  "Operator 2 Symbol": ">",
  "Time Interval": "05",
  "Unidentified Enumerations": "Show Unidentified Enumerations",
  "Show All Enumerations": "Show All Enumerations",
  "Unidentfied and Save Message": "You have unidentified fields.  This action will save the changes and Move to Next Page.",
  "BidField": "FICO Score",
  "Search_Map": "Deepika Aug",
  "CustomHeader": "Header 02",
  "New Rule Name": "New Rule",
  "Assigned Companies1": "Wik1C BeuLD MoJbr CoEmy LLpoJ",
  "Unique Chase Value1": "AndoverBirchDrive1",
  "Company name 2": "Wik1C BeuLD MoJbr CoEmy LLpoJ  - A2964",
  "Bid Field": "Base Loan Amount",
  "Chase  Values": "False",
  "ChaseValue": "Attached",
  "Unused Enumerations": "Show Unused Enumerations",
  "Reason For Cancellation": "To Be Cancelled",
  "Reason For Deletion": "To Be Deleted",
  "ChaseValues.": "False",
  "Chase_Field_Name": "Mortgage Limit",
  "Header Mapping": "Show All Headers",
  "Chase Field Name": "Amortization Type",
  "ChaseFieldName": "Appraised Value",
  "UniqueBidEnumTapeValue": "852345",
  "BidEnumeratedTapeValue": "800",
  "Chase Fields Name": "Amortization Type, Appraised Value, Attachment Type, Aus List, Borrower First Name, Borrower Last Name, Buy Down, CLTV, City, DTI, Fico, First Time Home Buyer, First Time Homebuyer Credit Fee Waiver, Impound Types, Income Ami Ratio, Ineligible, Interest Only, LTV, Loan Amount, Loan Number, Loan Purpose, Loan Term, Monthly Income, Mortgage Limit, Mortgage Types, Note Rate, Number Of Unit, Occupancy Type, Product Name, Property Type, Property Valuation Type, Purchase Price, State, Street, Subordinate Loan Amount, TPO, Total Loan Amount, Unpaid Principal Balance, Zip",
  "Unique Chase Field Name": "Street",
  "Chase Value": "Fixed rate",
  "Search_Input": "TS_SEARCHMAP21",
  "Unused Headers": "Show Unused Headers",
  "Upload File Text Verification": "Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt",
  "Bid Enumerated Tape Value": "80",
  "Search Field Company Name": "Wik1C",
  "Create Map": "Testsigma_04/03/2025/",
  "Custom Header": "Header01",
  "Investment (NOO)": "Investment (NOO)",
  "PropertyValuation": "1004Desktop",
  "ImportRuleName": "TEst",
  "Action Save message": "This action will save the changes and Move to Next Page",
  "SearchFields": "Hii",
  "Start Time in Minutes": "31",
  "Execution Type1": "STANDARD",
  "BidEnumeratedTapeValue - Block 2": "Fixed",
  "Execution Type": "CHASE_DIRECT",
  "UniqueColumnHeaderSearch": "TsSearchUniqueColumnHeader",
  "Start Time in Hour": "8",
  "UniqueWhenBidFieldSearch": "TsSearchWhenBidField",
  "WhenBidFieldName - Block 2": "Amortization Type",
  "EmptyChaseFieldName": "Select",
  "WhenBidFieldValue-3": "Appraised Value",
  "Unique Chase Value": "AndoverBirchDrive",
  "BidFields": "CLTV",
  "Loan Purpose": "Refinance (R&T)",
  "Advanced Search": "Fico",
  "ChaseFieldNames": "Aus List",
  "NO of Batches": "05",
  "CompanyName3": "American Pacific  - A4257",
  "Operator": "LESS_OR_EQUAL",
  "SelectingChaseFieldName": "7",
  "UpdatedBidEnumeratedTapeValue": "SAIKAT_18_FEB_002",
  "Search Input": "Test",
  "Company name 1": "Freedom",
  "Operator 3": "CONTAINS",
  "Expected Company Name": "Freedom",
  "Operation2": "GREATER",
  "Operation1": "LESS",
  "Operator - Block 2": "GREATER",
  "Bid Tape Value": "Fixed",
  "Search Field": "free",
  "Created Map Id": "Testsigma_05/07/2025/20:55:58",
  "Rule Name(Updated)": "UP Rule 1",
  "Operator 1 Symbol": "<",
  "UniqueChaseValueSearch": "TsSearchChaseValue",
  "Import Rule": "Testsigma_02/23/2026/01:02:39",
  "Duplicated Rule Name": "Rule 2",
  "Condition Bid Field": "FICO Score",
  "BidEnumeraedTapeValue - 3": "425000",
  "Chasevalues": "Variable rate",
  "DeleteId": "Testsigma_05/05/2025/16:23:13",
  "UpdatedWhenBidFieldName": "Correspondent Loan Number",
  "Unidentified fields Message": "You have unidentified fields do you want to proceed further.",
  "UniqueBidEnumTapeSearch": "TsSearchBidEnumTape",
  "Unidentified Fields Error Message": "You have unidentified fields.",
  "UniqueRuleNameSearch": "TsSearchUniqueRuleName"
}; // Profile: "Bid_Maps", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["count"] = "1";
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await customerPermissionPage.CustomerPermission_Menu.click();
    vars["CompanyNames"] = String(await statusInactivePage.Company_Names.count());
    for (let dataIdx = -1; dataIdx <= parseInt(vars["CompanyNames"]); dataIdx++) {
      vars["All_Company_Name"] = await chaseFieldNamePage.Individual_Company_in_Customer_permission.textContent() || '';
      // Write to test data profile: "All Company Name" = vars["All_Company_Name"]
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Mappings")).toBeVisible();
    await correspondentPortalPage.Add_New_Mapping_Button.click();
    vars["Create New Map"] = new Date().toLocaleDateString('en-US') /* format: dd/MM/yyyy/HH:mm:ss */;
    vars["Create New Map"] = "Testsigma_" + vars["Create New Map"];
    await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
    await correspondentPortalPage.Create_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Select_Companys_Dropdown.click();
    for (let dataIdx = -1; dataIdx <= parseInt(vars["CompanyNames"]); dataIdx++) {
      vars["Companyname"] = String(testData["All Company Name"]).split("-")["1"] || '';
      vars["Companyname"] = String(vars["Companyname"]).trim();
      await expect(chaseFieldNamePage.After_entering_Company_name_is_displayed).toContainText(vars["Companyname"]);
    }
    await expect(bidRequestPage.Bid_Mapping_IdSearch_Input_box).toBeVisible();
    vars["Companyname"] = await statusInactive2Page.Selecting_Companies_From_Dropdown.inputValue() || '';
    await bidRequestPage.Bid_Mapping_IdSearch_Input_box.fill(vars["Companyname"]);
    await expect(statusInactive3Page.Searched_Company_Name).toBeVisible();
    vars["After entering company name_count"] = String(await chaseFieldNamePage.Company_Names_In_DropdownBidRequest.count());
    await correspondentPortalPage.Cross_In_Search_Field.click();
    await expect(bidRequestPage.Bid_Mapping_IdSearch_Input_box).toHaveValue('');
    vars["After Clearing company name_count"] = String(await chaseFieldNamePage.Company_Names_In_DropdownBidRequest.count());
    expect(String(vars["After entering company name_count"])).toBe(vars["After Clearing company name_count"]);
    vars["Number"] = String(Math.floor(Math.random() * (20 - 1 + 1)) + 1);
    for (let dataIdx = parseInt(vars["Number"]); dataIdx <= parseInt(vars["Number"]); dataIdx++) {
      vars["Companyname"] = String(testData["All Company Name"]).trim();
      await bidRequestPage.Bid_Mapping_IdSearch_Input_box.fill(vars["Companyname"]);
      await chaseFieldNamePage.Company_name_for_Select_Companys.check();
      await correspondentPortalPage.Apply_Selected.click();
      await expect(statusInactivePage._1_Selected_for_Companys).toBeVisible();
      await expect(chaseFieldNamePage.After_entering_Company_name_is_displayed).toBeVisible();
    }
  });
});
