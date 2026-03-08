// [POM-APPLIED]
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { HeadingMappingsPage } from '../../../src/pages/correspondant/heading-mappings';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { P15ActivePage } from '../../../src/pages/correspondant/p-15-active';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS01_TC02";
const TC_TITLE = "Verify that the user can select the required clients/execution type and upload a file with the necessary headers for map creation.";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let headerMappingPage: HeaderMappingPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let headingMappingsPage: HeadingMappingsPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let p15ActivePage: P15ActivePage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let spinnerPage: SpinnerPage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;
  let helpers: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    headingMappingsPage = new HeadingMappingsPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    p15ActivePage = new P15ActivePage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
    helpers = new AddonHelpers(page, vars);
  });



  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
    //     const testData: Record<string, string> = {
    //   "Company name 1": "Freedom",
    //   "Execution Type": "CHASE_DIRECT",
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
        const executionType = profile.data[0]['Execution Type'];
        console.log("Upload verification text from tdp:", uploadText);
        vars["Upload File Text Verification"] = uploadText;
        console.log("Upload verification text from tdp 1:", vars["Upload File Text Verification"]);
        vars["Execution Type"] = executionType;
      }

      log.step("Step 1: Login to CORR Portal and verify dashboard");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Heading_Dashboard).toBeVisible();
        log.stepPass("Step 1 passed: Logged in to CORR Portal successfully and dashboard is visible");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Failed to login to CORR Portal");
        throw error;
      }
      log.step("Step 2: Navigate to Customer Permission for Chase Direct and perform edit actions");
      try {
        await stepGroups.stepGroup_Navigating_to_Customer_Permission_For_the_Chase_Direct_Compa(page, vars);
        await stepGroups.stepGroup_EditActions_In_CustomerPermission(page, vars);
        log.stepPass("Step 2 passed: Navigated to Customer Permission and edit actions completed successfully");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Failed to navigate to Customer Permission or perform edit actions");
        throw error;
      }
      log.step("Step 3: Navigate to Administration menu and select Bid Maps");
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(headingMappingsPage.Mappings).toBeVisible();
        log.stepPass("Step 3 passed: Navigated to Bid Maps menu successfully");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Failed to navigate to Bid Maps menu");
        throw error;
      }
      log.step("Step 4: Create new Bid Map with timestamp");
      try {
        await correspondentPortalPage.Add_New_Mapping_Button.click();
        await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();
        helpers.getCurrentTimestamp('dd/MM/yyyy/HH:mm:ss', 'CurrentDate');
        helpers.concatenate('Testsigma_', vars['CurrentDate'], 'Create New Map');
        await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
        await correspondentPortalPage.Create_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(p2142530YrFreddieMacFixedDropdownPage.Bid_Maps_Name).toContainText(vars["Create New Map"]);
        log.stepPass("Step 4 passed: New Bid Map created successfully with name: " + vars["Create New Map"]);
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Failed to create new Bid Map");
        throw error;
      }
      log.step("Step 5: Select company and execution type from dropdowns");
      try {
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await p15ActivePage.Select_Company_Names(vars["Company name 1"]).first().click();
        await correspondentPortalPage.Apply_Selected.click();
        await correspondentPortalPage.Dropdown_selection_2.selectOption({ label: vars["Execution Type"] });
        log.stepPass("Step 5 passed: Company and execution type selected successfully");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Failed to select company or execution type");
        throw error;
      }

      log.step("Step 6: Verify upload file field and upload Bid Maps file");
      try {
        await expect(correspondentPortalPage.Upload_File).toHaveValue('');
        await expect(page.getByText(vars["Upload File Text Verification"])).toBeVisible();
        await uploadFile(page, correspondentPortalPage.Upload_File, "Bid_Maps_File.xlsx");
        log.stepPass("Step 6 passed: File uploaded successfully");
      } catch (error) {
        log.stepFail(page, "Step 6 failed: Failed to upload file");
        throw error;
      }
      log.step("Step 7: Map headers and proceed to next page");
      try {
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1.waitFor({ state: 'visible' });
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["Create New Map"])).toBeVisible();
        await headerMappingPage.Header_Mapping.waitFor({ state: 'visible' });
        log.stepPass("Step 7 passed: Headers mapped and navigated to next page successfully");
      } catch (error) {
        log.stepFail(page, "Step 7 failed: Failed to map headers and proceed to next page");
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