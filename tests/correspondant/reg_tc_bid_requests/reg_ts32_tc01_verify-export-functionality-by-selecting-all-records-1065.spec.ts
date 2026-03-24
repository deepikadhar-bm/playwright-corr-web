// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '../../../src/config/environments';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS32_TC01_Verify Export Functionality by selecting all records', async ({ page }) => {

    // ── Step 1: Load Credentials and Test Data ───────────────────────────
    log.step('Loading credentials and test data');
    try {
      const profileName = 'Bid Requests';
      const profile = testDataManager.getProfileByName(profileName);
      if (profile && profile.data) {
        const ExecutionTypeHeader = profile.data[0]['Execution Type Header'];
        vars["Execution Type Header"] = ExecutionTypeHeader;
        const CCodeHeader = profile.data[0]['CCode Header'];
        vars["CCode Header"] = CCodeHeader;
        const BidRequestIDHeader = profile.data[0]['Bid Request ID Header'];
        vars["Bid Request ID Header"] = BidRequestIDHeader;
      }
      const credentials = ENV.getCredentials('internal');
      vars["Username"] = credentials.username;
      vars["Password"] = credentials.password;
      log.stepPass('Credentials and test data loaded successfully');
    } catch (e) {
      await log.stepFail(page, 'Loading credentials and test data failed');
      throw e;
    }

    // ── Step 2: Set up download handler ──────────────────────────────────
    log.step('Setting up download handler');
    try {
      page.on('download', async (download) => {
        const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
        await download.saveAs(filePath);
        vars['_lastDownloadPath'] = filePath;
      });
      log.stepPass('Download handler set up successfully');
    } catch (e) {
      await log.stepFail(page, 'Setting up download handler failed');
      throw e;
    }

    // ── Step 3: Login to Correspondent Portal ────────────────────────────
    log.step('Logging in to Correspondent Portal');
    try {
      await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
      log.stepPass('Logged in to Correspondent Portal successfully');
    } catch (e) {
      await log.stepFail(page, 'Login to Correspondent Portal failed');
      throw e;
    }

    // ── Step 4: Navigate to Bid Requests and apply filters ───────────────
    log.step('Navigating to Bid Requests and applying Last One Month filter');
    try {
      await correspondentPortalPage.Bid_Requests.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.Filter_Dropdown1.click();
      await correspondentPortalPage.Select_Date_Range_Dropdown.click();
      await correspondentPortalPage.Last_One_Month_Button.click();
      vars["LastMonth"] = await correspondentPortalPage.Last_One_Month_Button.textContent() || '';
      await expect(correspondentPortalPage.Date_Input_Box).toContainText(vars["LastMonth"]);
      await applyFiltersButtonPage.Apply_Filters_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass(`Navigated to Bid Requests and applied filter: "${vars["LastMonth"]}"`);
    } catch (e) {
      await log.stepFail(page, 'Navigating to Bid Requests and applying filter failed');
      throw e;
    }

    // ── Step 5: Select all records ───────────────────────────────────────
    log.step('Selecting all records');
    try {
      await expect(correspondentPortalPage.Export_Selected_Button_Bid_Request).toBeVisible();
      await priceOfferedPage.Select_All_Loan_Num.check();
      await expect(priceOfferedPage.Select_All_Loan_Num).toBeChecked();
      await expect(correspondentPortalPage.First_Checkbox_Bid_Request).toBeChecked();
      log.stepPass('All records selected successfully');
    } catch (e) {
      await log.stepFail(page, 'Selecting all records failed');
      throw e;
    }

    // ── Step 6: Capture UI record count and export ───────────────────────
    log.step('Capturing UI record count and triggering export');
    try {
      vars["CountOfRequestsUI"] = await correspondentPortalPage.Export_Records_Count.textContent() || '';
      //vars["CountOfRequestsUI"] = String(vars["CountOfRequestsUI"]).trim().substring(1, String(vars["CountOfRequestsUI"]).length-1);
      vars["CountOfRequestsUI"] = String(vars["CountOfRequestsUI"]).trim();                                                                          // remove whitespace first
      vars["CountOfRequestsUI"] = String(vars["CountOfRequestsUI"]).substring(1, String(vars["CountOfRequestsUI"]).length - 1);  // then remove brackets

log.step(`CountOfRequestsUI after cleanup: "${vars["CountOfRequestsUI"]}"`);
     // vars["CountOfRequestsUI"] = String(vars["CountOfRequestsUI"]).substring(1, String(vars["CountOfRequestsUI"]).length - 1);
      await expect(correspondentPortalPage.Export_Selected_Button_Bid_Request).toBeEnabled();
      await correspondentPortalPage.Export_Selected_Button_Bid_Request.click();
      await page.waitForTimeout(2000);
      //vars["File"] = vars['_lastDownloadPath'] || '';
      await correspondentPortalPage.Export_Selected_1_Button.waitFor({ state: 'visible' });
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        correspondentPortalPage.Export_Selected_1_Button.click(),
      ]);
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
      vars["File"] = filePath
      log.stepPass(`Export action completed and file downloaded successfully: "${filePath}"`);
      log.stepPass(`UI record count captured: "${vars["CountOfRequestsUI"]}", file downloaded: "${filePath}"`);
    } catch (e) {
      await log.stepFail(page, 'Capturing UI record count and exporting failed');
      throw e;
    }

    // ── Step 7: Verify row count matches between UI and Excel ────────────
    log.step('Verifying row count matches between UI and Excel');
    try {
      vars["CountOfRequestsExcel"] = String(excelHelper.getRowCount(vars["File"], "0"));
      //vars["CountOfRequestsExcel"] = (parseFloat(String(vars["CountOfRequestsExcel"])) - parseFloat(String("1"))).toFixed(0);
      expect(String(vars["CountOfRequestsUI"])).toBe(vars["CountOfRequestsExcel"]);
      log.stepPass(`Row count matched — UI: "${vars["CountOfRequestsUI"]}", Excel: "${vars["CountOfRequestsExcel"]}"`);
    } catch (e) {
      await log.stepFail(page, `Row count verification between UI and Excel failed - UI Count - ${vars["CountOfRequestsUI"]} - Excel Count - ${vars["CountOfRequestsExcel"]}`);
      throw e;
    }

    // ── Step 8: Verify column count matches between UI and Excel ─────────
    log.step('Verifying column count matches between UI and Excel');
    try {
      vars["CountOfColumnsUI"] = String(await bidRequestsPage.Count_of_Columns_Request_list.count());
      vars["CountOfColumnsExcel"] = String(excelHelper.getColumnCount(vars["File"], "0"));
      log.info(`Column Count UI: ${vars["CountOfColumnsUI"]} Column Count Excel: ${vars["CountOfColumnsExcel"]}`);
      expect(String(vars["CountOfColumnsUI"])).toBe(vars["CountOfColumnsExcel"]);
      //log.info(`Column Count Excel: ${vars["CountOfColumnsUI"]} Column Count UI: ${vars["CountOfColumnsExcel"]}`);
      log.stepPass(`Column count matched — UI: "${vars["CountOfColumnsUI"]}", Excel: "${vars["CountOfColumnsExcel"]}"`);
    } catch (e) {
      await log.stepFail(page, 'Column count verification between UI and Excel failed');
      throw e;
    }

    // ── Step 9: Verify each column name matches between UI and Excel ─────
    log.step('Verifying each column name matches between UI and Excel');
    try {
      vars["count1"] = "0";
      vars["count"] = "1";
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountOfColumnsUI"]))) {
        log.info(`In While Loop: Column count -  ${vars["count"]}`)
        vars["ColumnNameUI"] = await bidRequestPage.Individual_Column_Name(vars["count"]).textContent() || '';
        vars["ColumnNameUI"] = String(vars["ColumnNameUI"]).replace(/\s+/g, '').trim();
        vars["ColumnNameExcel"] = excelHelper.readCellByColAndRowIndex(vars["File"], 0, 0, vars["count1"]);
        //vars["ColumnNameExcel"] = String(vars["ColumnNameExcel"]).replace(/\s+/g, ' ').trim();
        vars["ColumnNameExcel"] = String(vars["ColumnNameExcel"]).replace(/\s+/g, '').trim();
        log.info(`UI - ${vars["ColumnNameUI"]} / Excel - ${vars["ColumnNameExcel"]}`)
        if (String(vars["count"]) === String("6")) {
          log.info(`Excuting If condition for column ${vars["count"]}`);
          expect(String(vars["ColumnNameExcel"])).toBe(vars["Execution Type Header"]);
        } else if (String(vars["count"]) === String("1")) {
          log.info(`Excuting If condition for column ${vars["count"]}`);
          expect(String(vars["ColumnNameExcel"])).toBe(vars["CCode Header"]);
        } else if (String(vars["count"]) === String("2")) {
          log.info(`Excuting If condition for column ${vars["count"]}`);
          expect(String(vars["ColumnNameExcel"])).toBe(vars["Bid Request ID Header"]);
        } else {
          expect(String(vars["ColumnNameUI"])).toBe(vars["ColumnNameExcel"]);
        }
        log.info(`Verification Successfull ${vars["ColumnNameUI"]} == ${vars["ColumnNameExcel"]}`)
        vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
      }
      log.stepPass('All column names matched between UI and Excel');
    } catch (e) {
      await log.stepFail(page, 'Column name verification between UI and Excel failed');
      throw e;
    }

  });
});