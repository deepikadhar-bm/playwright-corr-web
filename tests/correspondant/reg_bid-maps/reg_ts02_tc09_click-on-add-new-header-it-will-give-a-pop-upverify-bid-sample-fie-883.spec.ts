// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortal4Page } from '../../../src/pages/correspondant/correspondent-portal-4';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { NameCantBeEmptyPage } from '../../../src/pages/correspondant/name-cant-be-empty';
import { P1morePage } from '../../../src/pages/correspondant/p-1more';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { YouHaveSelectedToDeleteMappingDoYouWantPage } from '../../../src/pages/correspondant/you-have-selected-to-delete-mapping-do-you-want';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortal4Page: CorrespondentPortal4Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let nameCantBeEmptyPage: NameCantBeEmptyPage;
  let p1morePage: P1morePage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let youHaveSelectedToDeleteMappingDoYouWantPage: YouHaveSelectedToDeleteMappingDoYouWantPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortal4Page = new CorrespondentPortal4Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    nameCantBeEmptyPage = new NameCantBeEmptyPage(page);
    p1morePage = new P1morePage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    youHaveSelectedToDeleteMappingDoYouWantPage = new YouHaveSelectedToDeleteMappingDoYouWantPage(page);
  });

  test('REG_TS02_TC09_Click on \\\"Add New Header\\\" it will give a pop up.Verify Bid Sample Field Name cannot be blank. It should display error message.Verify add row functionality.Upon Edit.Verify CLM Field Na', async ({ page }) => {
    const testData: Record<string, string> = {
  "Chase Field Name": "Amortization Type",
  "Custom Header": "Header01",
  "ChaseFieldNames": "Aus List",
  "BidFields": "CLTV",
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
  "Loan Purpose": "Refinance (R&T)",
  "Advanced Search": "Fico",
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
    await expect(correspondentPortalPage.Add_New_Header_Button).toBeVisible();
    await correspondentPortalPage.Add_New_Header_Button.click();
    await expect(correspondentPortalPage.Insert_Header_Button).toBeVisible();
    await expect(correspondentPortal4Page.Custom_Header).toHaveValue('');
    await correspondentPortalPage.Insert_Header_Button.click();
    await expect(nameCantBeEmptyPage.Name_cant_be_empty).toBeVisible();
    await expect(correspondentPortalPage.Add_Row).toBeVisible();
    await expect(correspondentPortalPage.Chase_Field_Name.locator('option', { hasText: testData["Chase Field Name"] })).toBeVisible();
    await correspondentPortalPage.Custom_Header_Field.fill(testData["Custom Header"]);
    await correspondentPortalPage.Chase_Field_Name.selectOption({ label: testData["Chase Field Name"] });
    await correspondentPortalPage.Add_Row.click();
    await expect(correspondentPortalPage.Add_Row_Field).toBeVisible();
    await expect(correspondentPortalPage.SelectAmortizationType_a_div).toBeVisible();
    await correspondentPortalPage.SelectAmortizationType_a_div.click();
    await expect(youHaveSelectedToDeleteMappingDoYouWantPage.You_have_selected_to_delete_mapping_Do_you_want).toBeVisible();
    await expect(correspondentPortalPage.Cross_Button_in_Header_Mapping).toBeVisible();
    await correspondentPortalPage.Cross_Button_in_Header_Mapping.click();
    await expect(correspondentPortalPage.Cross_Button_in_Header_Mapping).toBeVisible();
    await correspondentPortalPage.SelectAmortizationType_a_div.click();
    await expect(youHaveSelectedToDeleteMappingDoYouWantPage.You_have_selected_to_delete_mapping_Do_you_want).toBeVisible();
    await expect(correspondentPortal18Page.Yes_Proceed_Button).toBeVisible();
    await correspondentPortal18Page.Yes_Proceed_Button.click();
    await page.waitForLoadState('networkidle');
    await expect(correspondentPortalPage.Added_CLM_Field).toBeVisible();
    await expect(correspondentPortalPage.Insert_Header_Button).toBeVisible();
    await correspondentPortalPage.Insert_Header_Button.click();
    vars["RGB_Yellow_Color"] = "rgba(255, 245, 192, 1)";
    vars[""] = await correspondentPortalPage.Inserted_Header_Data.evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor);
    expect(String(vars["RGB_Yellow_Color"])).toBe(vars["InsertedHeaderColor"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText(testData["Custom Header"])).toBeVisible();
    await expect(correspondentPortalPage.Inserted_Data_ChaseField_Name).toContainText(testData["Chase Field Name"]);
    await correspondentPortalPage.Edit_Button.click();
    await correspondentPortalPage.Chase_Field_Name.selectOption({ label: testData["ChaseFieldNames"] });
    await correspondentPortalPage.Chase_Field_Name.selectOption({ label: testData["BidFields"] });
    await expect(page.getByText(testData["BidFields"])).toBeVisible();
    await correspondentPortalPage.Update_Header_Button.click();
    await expect(statusInactivePage.Updated_Bid_Sample_Field_Name).toContainText(testData["BidFields"]);
    await expect(statusInactivePage.Updated_Bid_Sample_Field_Name).toBeVisible();
    await correspondentPortalPage.Editting_Chase_Field_Name.click();
    vars["Chase Field name"] = await p1morePage.Chase_Field_name_in_header_Mapping.textContent() || '';
    await correspondentPortalPage.Editting_Chase_Field_Name.selectOption({ index: parseInt("3") });
    await expect(correspondentPortalPage.Editting_Chase_Field_Name).toBeVisible();
    await expect(p1morePage.Chase_Field_name_in_header_Mapping).toContainText(vars["Chase Field name"]);
  });
});
