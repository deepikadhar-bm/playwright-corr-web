// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { CorrespondentPortal10Page } from '../../../src/pages/correspondant/correspondent-portal-10';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { NameCantBeEmptyPage } from '../../../src/pages/correspondant/name-cant-be-empty';
import { P15ActivePage } from '../../../src/pages/correspondant/p-15-active';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let correspondentPortal10Page: CorrespondentPortal10Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let nameCantBeEmptyPage: NameCantBeEmptyPage;
  let p15ActivePage: P15ActivePage;
  let statusInactive2Page: StatusInactive2Page;

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionruleheaderPage = new ActionruleheaderPage(page);
    correspondentPortal10Page = new CorrespondentPortal10Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    nameCantBeEmptyPage = new NameCantBeEmptyPage(page);
    p15ActivePage = new P15ActivePage(page);
    statusInactive2Page = new StatusInactive2Page(page);
  });

  test('REG_TS02_TC02_Verify that the user is able to Update the Bid Sample Field Name and CLM Field Name.', async ({ page }) => {
    const testData: Record<string, string> = {
  "ChaseFieldName": "Appraised Value",
  "EmptyChaseFieldName": "Select",
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
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Edit_icon_in_Header_Mapping.click();
    await expect(correspondentPortalPage.Custom_Header_Field).toBeVisible();
    await correspondentPortalPage.Custom_Header_Field.clear();
    await correspondentPortalPage.Update_Header_Button.click();
    await expect(nameCantBeEmptyPage.Name_cant_be_empty).toBeVisible();
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
    await correspondentPortalPage.Edit_icon_in_Header_Mapping.click();
    await expect(correspondentPortalPage.Custom_Header_Field).toBeVisible();
    await correspondentPortalPage.Custom_Header_Field.clear();
    await correspondentPortalPage.Update_Header_Button.click();
    await expect(nameCantBeEmptyPage.Name_cant_be_empty).toBeVisible();
    vars["CustomHeader"] = Array.from({length: 5}, () => "abc".charAt(Math.floor(Math.random() * 3))).join('');
    await correspondentPortalPage.Custom_Header_Field.fill(vars["CustomHeader"]);
    await correspondentPortalPage.Chase_Field_Name.selectOption({ label: testData["ChaseFieldName"] });
    await expect(page.getByText(testData["ChaseFieldName"])).toBeVisible();
    await correspondentPortalPage.Update_Header_Button.click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(vars["CustomHeader"])).toBeVisible();
    await correspondentPortalPage.Chase_Field_Name.click();
    await correspondentPortalPage.Chase_Field_Name.selectOption({ label: testData["ChaseFieldName"] });
    await expect(page.getByText(testData["ChaseFieldName"])).toBeVisible();
    if (true) /* Element Header_Data_Mapping_Field is visible */ {
      await correspondentPortalPage.Header_Data_Mapping_Field.click();
      await correspondentPortalPage.Option_in_Chase_Field_Name.click();
      vars["UpdatedChaseFieldName"] = await correspondentPortalPage.Option_in_Chase_Field_Name.textContent() || '';
      await expect(statusInactive2Page.Custom_Header_Section).toContainText(vars["UpdatedChaseFieldName"]);
      vars["UpdatedchaseField"] = String(vars["UpdatedChaseFieldName"]).substring(1, String(vars["UpdatedChaseFieldName"]).length - 1);
      await expect(actionruleheaderPage.New_Bid_Sample_Field_Name_contains).toHaveValue(vars["UpdatedchaseField"]);
    }
    await p15ActivePage.Select_Chase_Field_Name.selectOption({ label: testData["EmptyChaseFieldName"] });
    await expect(p15ActivePage.Select_Chase_Field_Name).toContainText(testData["EmptyChaseFieldName"]);
  });
});
