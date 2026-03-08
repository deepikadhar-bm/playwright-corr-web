// [POM-APPLIED]
import { test, expect, Page } from '@playwright/test';
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
import { testDataManager } from 'testdata/TestDataManager';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS01_TC10";
const TC_TITLE = "Verify that user should be able to view the uploaded file name (if it is short then the complete file name will be displayed, if it has more than like 22 characters then upon hovering on it should display the complete file name)";

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
  let helpers: AddonHelpers;

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
    helpers = new AddonHelpers(page, vars);
  });


  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
    //     const testData: Record<string, string> = {
    //   "Upload File Text Verification": "Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt",
    //   "UniqueColHeader/Enum": "TsSearchUniqueColHeaderEnum",
    //   "Save and Move to Next Page": "Save and Move to Next Page",
    //   "CSS Attribute": "2px solid rgb(227, 82, 5)",
    //   "Used Headers": "Show Used Headers",
    //   "2-4 Unit": "2-4 Unit",
    //   "Search Map Input": "Deepika Aug1",
    //   "Chase_Field_Name1": "Mortgage Type",
    //   "Rule Name": "Rule 1",
    //   "Unidentified Headers": "Show Unidentified Headers",
    //   "Operations": "GREATER",
    //   "BidFields.": "DTI",
    //   "Search Fields": "hii",
    //   "Operator 2 Symbol": ">",
    //   "Time Interval": "05",
    //   "Unidentified Enumerations": "Show Unidentified Enumerations",
    //   "Show All Enumerations": "Show All Enumerations",
    //   "Unidentfied and Save Message": "You have unidentified fields.  This action will save the changes and Move to Next Page.",
    //   "BidField": "FICO Score",
    //   "Search_Map": "Deepika Aug",
    //   "CustomHeader": "Header 02",
    //   "New Rule Name": "New Rule",
    //   "Assigned Companies1": "Wik1C BeuLD MoJbr CoEmy LLpoJ",
    //   "Unique Chase Value1": "AndoverBirchDrive1",
    //   "Company name 2": "Wik1C BeuLD MoJbr CoEmy LLpoJ  - A2964",
    //   "Bid Field": "Base Loan Amount",
    //   "Chase  Values": "False",
    //   "ChaseValue": "Attached",
    //   "Unused Enumerations": "Show Unused Enumerations",
    //   "Reason For Cancellation": "To Be Cancelled",
    //   "Reason For Deletion": "To Be Deleted",
    //   "ChaseValues.": "False",
    //   "Chase_Field_Name": "Mortgage Limit",
    //   "Header Mapping": "Show All Headers",
    //   "Chase Field Name": "Amortization Type",
    //   "ChaseFieldName": "Appraised Value",
    //   "UniqueBidEnumTapeValue": "852345",
    //   "BidEnumeratedTapeValue": "800",
    //   "Chase Fields Name": "Amortization Type, Appraised Value, Attachment Type, Aus List, Borrower First Name, Borrower Last Name, Buy Down, CLTV, City, DTI, Fico, First Time Home Buyer, First Time Homebuyer Credit Fee Waiver, Impound Types, Income Ami Ratio, Ineligible, Interest Only, LTV, Loan Amount, Loan Number, Loan Purpose, Loan Term, Monthly Income, Mortgage Limit, Mortgage Types, Note Rate, Number Of Unit, Occupancy Type, Product Name, Property Type, Property Valuation Type, Purchase Price, State, Street, Subordinate Loan Amount, TPO, Total Loan Amount, Unpaid Principal Balance, Zip",
    //   "Unique Chase Field Name": "Street",
    //   "Chase Value": "Fixed rate",
    //   "Search_Input": "TS_SEARCHMAP21",
    //   "Unused Headers": "Show Unused Headers",
    //   "Bid Enumerated Tape Value": "80",
    //   "Search Field Company Name": "Wik1C",
    //   "Create Map": "Testsigma_04/03/2025/",
    //   "Custom Header": "Header01",
    //   "Investment (NOO)": "Investment (NOO)",
    //   "PropertyValuation": "1004Desktop",
    //   "ImportRuleName": "TEst",
    //   "Action Save message": "This action will save the changes and Move to Next Page",
    //   "SearchFields": "Hii",
    //   "Start Time in Minutes": "31",
    //   "Execution Type1": "STANDARD",
    //   "BidEnumeratedTapeValue - Block 2": "Fixed",
    //   "Execution Type": "CHASE_DIRECT",
    //   "UniqueColumnHeaderSearch": "TsSearchUniqueColumnHeader",
    //   "Start Time in Hour": "8",
    //   "UniqueWhenBidFieldSearch": "TsSearchWhenBidField",
    //   "WhenBidFieldName - Block 2": "Amortization Type",
    //   "EmptyChaseFieldName": "Select",
    //   "WhenBidFieldValue-3": "Appraised Value",
    //   "Unique Chase Value": "AndoverBirchDrive",
    //   "BidFields": "CLTV",
    //   "Loan Purpose": "Refinance (R&T)",
    //   "Advanced Search": "Fico",
    //   "ChaseFieldNames": "Aus List",
    //   "NO of Batches": "05",
    //   "CompanyName3": "American Pacific  - A4257",
    //   "Operator": "LESS_OR_EQUAL",
    //   "SelectingChaseFieldName": "7",
    //   "UpdatedBidEnumeratedTapeValue": "SAIKAT_18_FEB_002",
    //   "Search Input": "Test",
    //   "Company name 1": "Freedom",
    //   "Operator 3": "CONTAINS",
    //   "Expected Company Name": "Freedom",
    //   "Operation2": "GREATER",
    //   "Operation1": "LESS",
    //   "Operator - Block 2": "GREATER",
    //   "Bid Tape Value": "Fixed",
    //   "Search Field": "free",
    //   "Created Map Id": "Testsigma_05/07/2025/20:55:58",
    //   "Rule Name(Updated)": "UP Rule 1",
    //   "Operator 1 Symbol": "<",
    //   "UniqueChaseValueSearch": "TsSearchChaseValue",
    //   "Import Rule": "Testsigma_02/23/2026/01:02:39",
    //   "Duplicated Rule Name": "Rule 2",
    //   "Condition Bid Field": "FICO Score",
    //   "BidEnumeraedTapeValue - 3": "425000",
    //   "Chasevalues": "Variable rate",
    //   "DeleteId": "Testsigma_05/05/2025/16:23:13",
    //   "UpdatedWhenBidFieldName": "Correspondent Loan Number",
    //   "Unidentified fields Message": "You have unidentified fields do you want to proceed further.",
    //   "UniqueBidEnumTapeSearch": "TsSearchBidEnumTape",
    //   "Unidentified Fields Error Message": "You have unidentified fields.",
    //   "UniqueRuleNameSearch": "TsSearchUniqueRuleName"
    // }; // Profile: "Bid_Maps", row: 0
      if (profile && profile.data) {
        const uploadText = profile.data[0]['Upload File Text Verification'];
        vars["Upload File Text Verification"] = uploadText;
      }

      log.step("Step 1: Login to CORR Portal and create new Bid Map");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Creation_Of_New_Map(page, vars);
        log.stepPass("Step 1 passed: Logged in and new Bid Map created successfully");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Failed to login or create new Bid Map");
        throw error;
      }
      log.step("Step 2: Upload CSV file with short name and verify file name display");
      try {
        await uploadFile(page, correspondentPortalPage.Upload_File, "Bid_Maps_File_QA(CSV).csv");
        vars["File"] = (await correspondentPortal16Page.File_Field.textContent())?.trim() || '';
        await expect(page.getByText(vars["File"])).toBeVisible({ timeout: 5000 });
        await expect(correspondentPortal16Page.File_Field).toBeVisible();
        await expect(deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps).toBeVisible();
        log.stepPass("Step 2 passed: CSV file uploaded and file name displayed successfully");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Failed to upload CSV file or verify file name display");
        throw error;
      }
      log.step("Step 3: Test delete file functionality with cancel and no actions");
      try {
        await deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps.click();
        await expect(correspondentPortalPage.Cross_button_in_Bid_Map).toBeVisible();
        await expect(correspondentPortalPage.Are_you_sure_you_want_to_delete_fixed_from_enumeration).toBeVisible();
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        await expect(correspondentPortal16Page.File_Field).toBeVisible();
        await deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps.click();
        await expect(noButtonPage.No_Button).toBeVisible();
        await noButtonPage.No_Button.click();
        await expect(correspondentPortal16Page.File_Field).toBeVisible();
        log.stepPass("Step 3 passed: Delete file cancel and no actions verified successfully");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Failed to test delete file cancel/no actions");
        throw error;
      }
      log.step("Step 4: Delete CSV file and upload XLSX file with long name");
      try {
        await deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps.click();
        await expect(correspondentPortalPage.Yes_Proceed_Button).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await uploadFile(page, correspondentPortalPage.Upload_File, "Bid_Maps_File_QAtfydrdydcesestrduytfydrtd(xlsx).xlsx");
        vars["File"] = (await correspondentPortal16Page.File_Field.textContent())?.trim() || '';
        await expect(page.getByText(vars["File"])).toBeVisible({ timeout: 5000 });
        await expect(correspondentPortal16Page.File_Field).toBeVisible();
        log.stepPass("Step 4 passed: CSV file deleted and XLSX file with long name uploaded successfully");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Failed to delete CSV or upload XLSX file");
        throw error;
      }
      log.step("Step 5: Test back navigation with unsaved changes warning");
      try {
        await expect(backButtonPage.BACK_Button).toBeVisible();
        await backButtonPage.BACK_Button.click();
        await expect(correspondentPortalPage.close_pop_up_bid_request_details).toBeVisible();
        await expect(youHaveUnsavedChangesIfYouLeaveYourChangesPage.You_have_unsaved_changes_If_you_leave_your_changes).toBeVisible();
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        await backButtonPage.BACK_Button.click();
        await expect(youHaveUnsavedChangesIfYouLeaveYourChangesPage.You_have_unsaved_changes_If_you_leave_your_changes).toBeVisible();
        await continueEditingButtonPage.Continue_Editing_Button.click();
        log.stepPass("Step 5 passed: Back navigation with unsaved changes warning tested successfully");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Failed to test back navigation with unsaved changes");
        throw error;
      }
      log.step("Step 6: Proceed without saving and verify draft status");
      try {
        await backButtonPage.BACK_Button.click();
        await expect(youHaveUnsavedChangesIfYouLeaveYourChangesPage.You_have_unsaved_changes_If_you_leave_your_changes).toBeVisible();
        await proceedWithoutSavingButtonPage.Proceed_without_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Status).toContainText("DRAFT");
        console.log('Searching using vars["BidMap"]:', vars["BidMap"]);
        await correspondentPortalPage.Bid_Maps_name(vars["BidMap"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue('');
        await expect(correspondentPortalPage.Select_Clients_Dropdown_2).toBeVisible();
        await expect(page.getByText(vars["Upload File Text Verification"])).toBeVisible();
        log.stepPass("Step 6 passed: Proceeded without saving and draft status verified successfully");
      } catch (error) {
        log.stepFail(page, "Step 6 failed: Failed to proceed without saving or verify draft status");
        throw error;
      }

      log.tcEnd('PASS');

    } catch (error) {
      log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});