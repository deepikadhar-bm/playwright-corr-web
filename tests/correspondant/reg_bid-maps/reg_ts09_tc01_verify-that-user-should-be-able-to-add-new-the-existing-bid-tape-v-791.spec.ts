// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments'
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = "REG_TS09_TC01";
const TC_TITLE = "Verify that user should be able to Add new the existing bid tape value under the enum and also should be able to update the chase values";

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });


  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      const testData: Record<string, string> = {
      "Chase Value": "Fixed rate",
      "Bid Tape Value": "Fixed",
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

      log.step("Step 1: Login to CORR Portal and prepare Bid Map up to Header Mapping");
      try {
         if (profile && profile.data) {
        const chaseValue = profile.data[0]['Chase Value'];
        const bidTapeValue = profile.data[0]['Bid Tape Value'];
        vars["Chase Value"] = chaseValue;
        vars["Bid Tape Value"] = bidTapeValue;
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
            }
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
        log.stepPass("Step 1 passed: Logged in, enabled Smart Mapper, and navigated to Rules and Actions step.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Unable to login, enable Smart Mapper, or reach Rules and Actions step.");
        throw error;
      }

      log.step("Step 2: Navigate to Enumeration Mapping screen");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.waitFor({ state: 'visible' });
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1.waitFor({ state: 'visible' });
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
        log.stepPass("Step 2 passed: Navigated to Enumeration Mapping and returned to Rules and Actions step.");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Unable to navigate to Enumeration Mapping or return to Rules and Actions step.");
        throw error;
      }

      log.step("Step 3: Add new bid tape value under enum and save draft");
      try {
        await correspondentPortalPage.Add_Field_Button.click();
        await correspondentPortalPage.Chase_Value.selectOption({ label: vars["Chase Value"] });
        await correspondentPortalPage.Bid_Tape_Value.fill(vars["Bid Tape Value"]);
        await correspondentPortalPage.Save_Draft_Button_in_Enumeration_Mapping.click();
        await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
        log.stepPass("Step 3 passed: New bid tape value added and draft saved successfully.");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Unable to add new bid tape value or save draft.");
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
