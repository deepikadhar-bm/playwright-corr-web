import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AdvanceSearchPage } from '../../../src/pages/correspondant/advance-search';
import { BidmapDashboardPage } from '../../../src/pages/correspondant/bidmap-dashboard';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { NoResultPage } from '../../../src/pages/correspondant/no-result';
import { ShowResultsButtonPage } from '../../../src/pages/correspondant/show-results-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID    = 'REG_TS32_TC02';
const TC_TITLE = 'Verify the advance search functionality, where the user should be able to perform search action based on the rules and actions.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let advanceSearchPage: AdvanceSearchPage;
  let bidmapDashboardPage: BidmapDashboardPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let noResultPage: NoResultPage;
  let showResultsButtonPage: ShowResultsButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;

  test.beforeEach(async ({ page }) => {
    vars = {};
    advanceSearchPage = new AdvanceSearchPage(page);
    bidmapDashboardPage = new BidmapDashboardPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    noResultPage = new NoResultPage(page);
    showResultsButtonPage = new ShowResultsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      const testData: Record<string, string> = {
        "Advanced Search": "Fico",
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
      };

      // ── Step 1: Load Credentials and Test Data ──────────────────────────
      log.step('Loading credentials and test data');
      try {
        const crederntials = ENV.getCredentials('internal');
        vars["Username"] = crederntials.username;
        vars["Password"] = crederntials.password;
        // console.log("Test Data: ", testData);
        const profileName = "Bid_Maps";
        const profile = testDataManager.getProfileByName(profileName);
        // Transfer data from JSON to the vars object used by the test
        if (profile && profile.data && profile.data.length > 0) {
          const dataRow = profile.data[0];
          console.log("Data row for '" + profileName + "': ", dataRow);
          vars["Advanced Search"] = dataRow["Advanced Search"];
          console.log("Value for 'Advanced Search': ", vars["Advanced Search"]);
          console.log("Advanced in caps " + vars["Advanced Search"].toUpperCase());
        }
        log.stepPass('Credentials and test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials and test data failed');
        throw e;
      }

      // ── Step 2: Login to Correspondent Portal ───────────────────────────
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await expect(page.locator("//h3[text()[normalize-space() = 'Dashboard']]")).toBeVisible();
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }

      // ── Step 3: Navigate to Bid Maps ────────────────────────────────────
      log.step('Navigating to Administration > Bid Maps');
      try {
        await page.locator("//span[text()[normalize-space() = 'Administration']]").click();
        await page.locator("//span[text()[normalize-space() = 'Bid Maps']]").click();
        await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Bid Maps successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigation to Bid Maps failed');
        throw e;
      }

      // ── Step 4: Open Advanced Search ────────────────────────────────────
      log.step('Opening Advanced Search and Filter option');
      try {
        await page.locator("//input[@placeholder='Search/Filter']").click();
        await page.locator("//a[text()[normalize-space() = 'Try Advanced Search and Filter option']]").click();
        await expect(page.locator("//*[text()[normalize-space() = 'Advanced Search/Filter']]")).toBeVisible();
        log.stepPass('Advanced Search panel opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Opening Advanced Search failed');
        throw e;
      }

      // ── Step 5: Select Bid Map Field from dropdown ──────────────────────
      log.step('Selecting Bid Map Field from dropdown: ' + vars["Advanced Search"].toUpperCase());
      try {
        const dropdown = page.locator('//app-single-select-dropdown[@aria-label="Bid Map Field"]//select');
        await dropdown.selectOption({ value: vars["Advanced Search"].toUpperCase() });
        await expect(dropdown).toHaveValue(vars["Advanced Search"].toUpperCase());
        console.log("Selected value for 'If Bid Field': ", vars["Advanced Search"].toUpperCase());
        //await page.locator("//label[text()='Chase value']/../..//*[@aria-label='LP Field Type']//select").selectOption({  value: vars["Advanced Search"].toUpperCase() });
        log.stepPass('Bid Map Field selected: ' + vars["Advanced Search"].toUpperCase());
      } catch (e) {
        await log.stepFail(page, 'Selecting Bid Map Field from dropdown failed');
        throw e;
      }

      // ── Step 6: Fill LP Field Value ──────────────────────────────────────
      log.step('Filling LP Field Value with random input');
      try {
        await page.locator("//div[@aria-labelledby='rulesGroup']/following-sibling::div//*[@aria-label='LP Field Value']//input").fill(Array.from({length: 5}, () => "ab".charAt(Math.floor(Math.random() * 2))).join(''));
        log.stepPass('LP Field Value filled successfully');
      } catch (e) {
        await log.stepFail(page, 'Filling LP Field Value failed');
        throw e;
      }

      // ── Step 7: Select LP Field Type from dropdown ───────────────────────
      log.step('Selecting LP Field Type from dropdown: ' + vars["Advanced Search"]);
      try {
        const dropdown1 = page.locator('//app-single-select-dropdown[@aria-label="LP Field Type"]//select');
        await dropdown1.selectOption({ label: vars["Advanced Search"] });
        console.log("Selected value for 'LP Field Type': ", vars["Advanced Search"]);
        log.stepPass('LP Field Type selected: ' + vars["Advanced Search"]);
      } catch (e) {
        await log.stepFail(page, 'Selecting LP Field Type from dropdown failed');
        throw e;
      }

      // ── Step 8: Fill Chase Value and Show Results ────────────────────────
      log.step('Filling Chase value and clicking Show Results');
      try {
        await page.locator("(//label[text()='Chase value'])[2]/../..//*[@aria-label='LP Field Value']//input").fill(Array.from({length: 5}, () => "ab".charAt(Math.floor(Math.random() * 2))).join(''));
        await page.locator("//span[text()[normalize-space() = 'Show Results']]").click();
        await page.waitForLoadState('networkidle');
        await expect(page.locator("//td[text()[normalize-space() = 'No result']]")).toBeVisible();
        log.stepPass('Show Results clicked and No result verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Filling Chase value or verifying No result failed');
        throw e;
      }

      // ─── TC End: PASS ────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }

  });

});