// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '../../../src/config/environments';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS32_TC03_Verify Export Functionality by searching through request ID', async ({ page }) => {

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

    // ── Step 4: Navigate to Bid Requests and go to next page ─────────────
    log.step('Navigating to Bid Requests and going to next page');
    try {
      await correspondentPortalPage.Bid_Requests.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Navigated to Bid Requests and moved to next page successfully');
    } catch (e) {
      await log.stepFail(page, 'Navigating to Bid Requests and going to next page failed');
      throw e;
    }

    // ── Step 5: Generate random number and capture random request ID ──────
    log.step('Generating random number and capturing random Bid Request ID');
    try {
      vars["RandomNumber"] = String(Math.floor(Math.random() * (10 - 1 + 1)) + 1);
      vars["RandomRequestID"] = await correspondentPortalPage.Random_BidRequest(vars["RandomNumber"]).textContent() || '';
      vars["RandomRequestID"] = String(vars["RandomRequestID"]).trim();
      log.stepPass(`Random number generated: "${vars["RandomNumber"]}", Random Request ID captured: "${vars["RandomRequestID"]}"`);
    } catch (e) {
      await log.stepFail(page, 'Generating random number and capturing random Bid Request ID failed');
      throw e;
    }

    // ── Step 6: Search by Bid Request ID and verify result ────────────────
    log.step(`Searching by Bid Request ID: "${vars["RandomRequestID"]}"`);
    try {
      await correspondentPortalPage.Search_By_Bid_Request_ID_Input.pressSequentially(vars["RandomRequestID"]);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await bidRequestPage.Searched_BidRequest.first().waitFor({ state: 'visible' });
      await expect(correspondentPortalPage.Export_Selected_Button_Bid_Request).toBeVisible();
      await expect(bidRequestPage.Searched_BidRequest).toContainText(vars["RandomRequestID"]);
      log.stepPass(`Search result verified — contains Request ID: "${vars["RandomRequestID"]}"`);
    } catch (e) {
      await log.stepFail(page, `Searching by Bid Request ID "${vars["RandomRequestID"]}" failed`);
      throw e;
    }

    // ── Step 7: Select first record and capture UI count ──────────────────
    log.step('Selecting first record and capturing UI record count');
    try {
      await correspondentPortalPage.First_Checkbox_Bid_Request.check();
      await expect(correspondentPortalPage.First_Checkbox_Bid_Request).toBeVisible();
      await expect(correspondentPortalPage.Export_Selected_Button_Bid_Request).toBeVisible();
      vars["CountOfRequestsUI"] = await correspondentPortalPage.Export_Records_Count.textContent() || '';
      vars["CountOfRequestsUI"] = String(vars["CountOfRequestsUI"]).trim();
      vars["CountOfRequestsUI"] = String(vars["CountOfRequestsUI"]).substring(1, String(vars["CountOfRequestsUI"]).length - 1);
      log.info(`CountOfRequestsUI after cleanup: "${vars["CountOfRequestsUI"]}"`);
      log.stepPass(`First record selected, UI count captured: "${vars["CountOfRequestsUI"]}"`);
    } catch (e) {
      await log.stepFail(page, 'Selecting first record and capturing UI record count failed');
      throw e;
    }

    // ── Step 8: Trigger export and download file ──────────────────────────
    log.step('Triggering export and downloading file');
    try {
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
    } catch (e) {
      await log.stepFail(page, 'Triggering export and downloading file failed');
      throw e;
    }

    // ── Step 9: Verify row count matches between UI and Excel ─────────────
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

    // ── Step 10: Verify Request ID in Excel matches the searched ID ───────
    log.step('Verifying Request ID in Excel matches the searched Bid Request ID');
    try {
      vars["RequestIDExcel"] = excelHelper.readCellByColAndRowIndex(vars["File"], 0, 1, 1);
      expect(String(vars["RandomRequestID"])).toBe(vars["RequestIDExcel"]);
      log.stepPass(`Request ID matched — UI: "${vars["RandomRequestID"]}", Excel: "${vars["RequestIDExcel"]}"`);
    } catch (e) {
      await log.stepFail(page, `Request ID verification failed - UI: "${vars["RandomRequestID"]}" - Excel: "${vars["RequestIDExcel"]}"`);
      throw e;
    }

    // ── Step 11: Verify column count and column names ─────────────────────
    await stepGroups.stepGroup_Verification_of_Column_Headers_Count_and_Column_Names_From_U(page, vars);

  });
});