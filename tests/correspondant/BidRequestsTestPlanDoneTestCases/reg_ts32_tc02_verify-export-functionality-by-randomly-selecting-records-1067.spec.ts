// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '../../../src/config/environments';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS32_TC02_Verify Export Functionality by randomly selecting records', async ({ page }) => {

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

    // ── Step 4: Navigate to Bid Requests ─────────────────────────────────
    log.step('Navigating to Bid Requests');
    try {
      await correspondentPortalPage.Bid_Requests.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(correspondentPortalPage.Export_Selected_Button_Bid_Request).toBeVisible();
      log.stepPass('Navigated to Bid Requests successfully');
    } catch (e) {
      await log.stepFail(page, 'Navigating to Bid Requests failed');
      throw e;
    }

    // ── Step 5: Randomly select 8 records ────────────────────────────────
    log.step('Randomly selecting 8 records');
    try {
      vars["count"] = "1";
      while (parseFloat(String(vars["count"])) <= parseFloat(String("8"))) {
        vars["RandomNumber"] = String(Math.floor(Math.random() * (10 - 1 + 1)) + 1);
        log.info(`Iteration ${vars["count"]} — Random number generated: ${vars["RandomNumber"]}`);
        await correspondentPortalPage.Random_BidRequest_Checkbox(vars["RandomNumber"]).check();
        //await (expect(correspondentPortalPage.Random_BidRequest_Checkbox)(vars["RandomNumber"])).toBeVisible();
        await expect(correspondentPortalPage.Random_BidRequest_Checkbox(vars["RandomNumber"])).toBeVisible();
        vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      }
      log.stepPass('8 records randomly selected successfully');
    } catch (e) {
      await log.stepFail(page, 'Randomly selecting records failed');
      throw e;
    }

    // ── Step 6: Capture UI record count and export ───────────────────────
    log.step('Capturing UI record count and triggering export');
    try {
      await expect(correspondentPortalPage.Export_Selected_Button_Bid_Request).toBeVisible();
      vars["CountOfRequestsUI"] = await correspondentPortalPage.Export_Records_Count.textContent() || '';
      vars["CountOfRequestsUI"] = String(vars["CountOfRequestsUI"]).trim();
      vars["CountOfRequestsUI"] = String(vars["CountOfRequestsUI"]).substring(1, String(vars["CountOfRequestsUI"]).length - 1);
      log.info(`CountOfRequestsUI after cleanup: "${vars["CountOfRequestsUI"]}"`);
      await correspondentPortalPage.Export_Selected_Button_Bid_Request.click();
      await page.waitForTimeout(2000);
      await correspondentPortalPage.Export_Selected_1_Button.waitFor({ state: 'visible' });
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        correspondentPortalPage.Export_Selected_1_Button.click(),
      ]);
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
      vars["File"] = filePath;
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

    // ── Step 8 & 9: Verify column count and column names ─────────────────
    await stepGroups.stepGroup_Verification_of_Column_Headers_Count_and_Column_Names_From_U(page, vars);

  });
});