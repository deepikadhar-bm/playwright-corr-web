// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { ContinueEditingButtonPage } from '../../../src/pages/correspondant/continue-editing-button';
import { CorrespondentPortal16Page } from '../../../src/pages/correspondant/correspondent-portal-16';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { Deepikaaugbidqa1csvButtonDivPage } from '../../../src/pages/correspondant/deepikaaugbidqa1csv-button-div';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { NoButtonPage } from '../../../src/pages/correspondant/no-button';
import { ProceedWithoutSavingButtonPage } from '../../../src/pages/correspondant/proceed-without-saving-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { YouHaveUnsavedChangesIfYouLeaveYourChangesPage } from '../../../src/pages/correspondant/you-have-unsaved-changes-if-you-leave-your-changes';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let backButtonPage: BackButtonPage;
  let continueEditingButtonPage: ContinueEditingButtonPage;
  let correspondentPortal16Page: CorrespondentPortal16Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let deepikaaugbidqa1csvButtonDivPage: Deepikaaugbidqa1csvButtonDivPage;
  let headerMappingPage: HeaderMappingPage;
  let noButtonPage: NoButtonPage;
  let proceedWithoutSavingButtonPage: ProceedWithoutSavingButtonPage;
  let spinnerPage: SpinnerPage;
  let youHaveUnsavedChangesIfYouLeaveYourChangesPage: YouHaveUnsavedChangesIfYouLeaveYourChangesPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    backButtonPage = new BackButtonPage(page);
    continueEditingButtonPage = new ContinueEditingButtonPage(page);
    correspondentPortal16Page = new CorrespondentPortal16Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deepikaaugbidqa1csvButtonDivPage = new Deepikaaugbidqa1csvButtonDivPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    noButtonPage = new NoButtonPage(page);
    proceedWithoutSavingButtonPage = new ProceedWithoutSavingButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    youHaveUnsavedChangesIfYouLeaveYourChangesPage = new YouHaveUnsavedChangesIfYouLeaveYourChangesPage(page);
  });

  test('REG_TS01_TC10_Verify that user should be able to view the uploaded file name (if it is short then the complete file name will be displayed, if it has more than like 22characters then upon hovering on ', async ({ page }) => {
    const testData: Record<string, string> = {
  "Upload File Text Verification": "Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt",
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
    await stepGroups.stepGroup_Creation_Of_New_Map(page, vars);
    await headerMappingPage.File_Input.setInputFiles(path.resolve(__dirname, 'test-data', "Bid Maps File QA(CSV).csv"));
    vars["File"] = await correspondentPortal16Page.File_Field.inputValue() || '';
    await correspondentPortal16Page.File_Field.hover();
    await expect(page.getByText(vars["File"])).toBeVisible();
    await expect(correspondentPortal16Page.File_Field).toBeVisible();
    await expect(deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps).toBeVisible();
    await deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps.click();
    await expect(correspondentPortalPage.Cross_button_in_Bid_Map).toBeVisible();
    await expect(correspondentPortalPage.Are_you_sure_you_want_to_delete_fixed_from_enumeration).toBeVisible();
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
    await expect(correspondentPortal16Page.File_Field).toBeVisible();
    await deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps.click();
    await expect(noButtonPage.No_Button).toBeVisible();
    await noButtonPage.No_Button.click();
    await expect(correspondentPortal16Page.File_Field).toBeVisible();
    await deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps.click();
    await expect(correspondentPortalPage.Yes_Proceed_Button).toBeVisible();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await page.waitForLoadState('networkidle');
    await headerMappingPage.File_Input.setInputFiles(path.resolve(__dirname, 'test-data', "Bid Maps File QAtfydrdydcesestrduytfydrtd(xlsx).xlsx"));
    vars["File"] = await correspondentPortal16Page.File_Field.inputValue() || '';
    await correspondentPortal16Page.File_Field.hover();
    await expect(page.getByText(vars["File"])).toBeVisible();
    await expect(correspondentPortal16Page.File_Field).toBeVisible();
    await page.waitForLoadState('networkidle');
    await expect(backButtonPage.BACK_Button).toBeVisible();
    await backButtonPage.BACK_Button.click();
    await expect(correspondentPortalPage.close_pop_up_bid_request_details).toBeVisible();
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
    await expect(youHaveUnsavedChangesIfYouLeaveYourChangesPage.You_have_unsaved_changes_If_you_leave_your_changes).toBeVisible();
    await backButtonPage.BACK_Button.click();
    await continueEditingButtonPage.Continue_Editing_Button.click();
    await expect(youHaveUnsavedChangesIfYouLeaveYourChangesPage.You_have_unsaved_changes_If_you_leave_your_changes).toBeVisible();
    await backButtonPage.BACK_Button.click();
    await expect(youHaveUnsavedChangesIfYouLeaveYourChangesPage.You_have_unsaved_changes_If_you_leave_your_changes).toBeVisible();
    await proceedWithoutSavingButtonPage.Proceed_without_Saving_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Status).toContainText("DRAFT");
    await correspondentPortalPage.Bid_Maps_name.filter({ hasText: vars["BidMap"] }).click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue('');
    await expect(correspondentPortalPage.Select_Clients_Dropdown_2).toBeVisible();
    await expect(page.getByText(testData["Upload File Text Verification"])).toBeVisible();
  });
});
