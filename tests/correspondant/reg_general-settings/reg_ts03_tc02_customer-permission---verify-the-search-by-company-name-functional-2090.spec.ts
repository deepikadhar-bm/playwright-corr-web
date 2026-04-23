// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { AddonHelpers as ADDON } from '../../../src/helpers/AddonHelpers';
import { APP_CONSTANTS } from 'src/constants/app-constants';  

const TC_ID = 'REG_TS03_TC02';
const TC_TITLE = 'Customer Permission - Verify the search by Company name functionality';
let reg_ts03_tc02_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let generalSettingPage: GeneralSettingPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS03_TC02_Customer Permission - Verify the search by Company name functionality', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login and credentials setup ────────────────────────────────────
      log.step('Logging in to Correspondent Portal');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Successfully logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      // ── Navigate to Administration Menu ──────────────────────────────
      log.step('Navigating to Administration Menu');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        log.info('Clicked Administration Menu');
        log.stepPass('Successfully navigated to Administration Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Administration Menu');
        throw e;
      }

      // ── Navigate to General Settings Menu ───────────────────────────
      log.step('Navigating to General Settings Menu');
      try {
        await correspondentPortalPage.GeneralSettings_Menu.click();
        log.info('Clicked General Settings Menu');
        log.stepPass('Successfully navigated to General Settings Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to General Settings Menu');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for page load');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
        throw e;
      }

      // ── Navigate to Customer Permission Menu ──────────────────────────
      log.step('Navigating to Customer Permission Menu');
      try {
        await customerPermissionPage.CustomerPermission_Menu.click();
        log.info('Clicked Customer Permission Menu');
        log.stepPass('Successfully navigated to Customer Permission Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Customer Permission Menu');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for Customer Permission page load');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - Customer Permission page loaded');
        log.stepPass('Customer Permission page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Customer Permission page load');
        throw e;
      }

      // ── Search for "Freedom" company ───────────────────────────────────
      log.step('Searching for "Freedom" company');
      try {
        await customerPermissionPage.Search_Filter_Input.fill(APP_CONSTANTS.CompanyName1);
        log.info('Filled Search Filter Input with: Freedom');
        await page.keyboard.press('Enter');
        log.info('Pressed Enter to search');
        log.stepPass('Successfully searched for Freedom company');
      } catch (e) {
        await log.stepFail(page, 'Failed to search for Freedom company');
        throw e;
      }

      // ── Wait for search results ────────────────────────────────────────
      log.step('Waiting for search results');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - search results loaded');
        log.stepPass('Search results loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for search results');
        throw e;
      }

      // ── Extract company name ──────────────────────────────────────────
      log.step('Extracting first company name');
      try {
        vars["FirstCompanyName"] = await generalSettingPage.First_Company_Namecustomer_permission.textContent() || '';
        log.info(`First Company Name extracted: ${vars["FirstCompanyName"]}`);
        log.stepPass('First company name extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract first company name');
        throw e;
      }

      // ── Extract company name from substring ────────────────────────────
      log.step('Processing company name substring');
      try {
        vars["FirstCompanyName"] = String(vars["FirstCompanyName"]).substring(1, String(vars["FirstCompanyName"]).length - 1);
        log.info(`Company name after substring processing: ${vars["FirstCompanyName"]}`);
        log.stepPass('Company name substring processed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to process company name substring');
        throw e;
      }

      // ── Search by Company Name ─────────────────────────────────────────
      log.step(`Searching by Company Name: ${vars["FirstCompanyName"]}`);
      try {
        await customerPermissionPage.Search_Filter_Input.clear();
        log.info('Cleared Search Filter Input');
        await customerPermissionPage.Search_Filter_Input.fill(String(vars["FirstCompanyName"]));
        log.info(`Filled Search Filter Input with: ${vars["FirstCompanyName"]}`);
        await page.keyboard.press('Enter');
        log.info('Pressed Enter to search by Company Name');
        log.stepPass('Successfully searched by Company Name');
      } catch (e) {
        await log.stepFail(page, 'Failed to search by Company Name');
        throw e;
      }

      // ── Wait for search results ────────────────────────────────────────
      log.step('Waiting for search results after Company Name search');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - search results loaded');
        log.stepPass('Search results loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for search results');
        throw e;
      }

      // ── Set expected company name ──────────────────────────────────────
      log.step('Setting expected company name variable');
      try {
        vars["ExpectedCompanyName"] = vars["FirstCompanyName"];
        log.info(`Expected Company Name set to: ${vars["ExpectedCompanyName"]}`);
        log.stepPass('Expected company name set successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to set expected company name');
        throw e;
      }

      // ── Verify company name in results ────────────────────────────────
      log.step(`Verifying Company Name appears in results: ${vars["ExpectedCompanyName"]}`);
      try {
        await expect(statusInactivePage.Company_Names).toContainText(vars["ExpectedCompanyName"]);
        log.info(`Verified Company Name is visible in results: ${vars["ExpectedCompanyName"]}`);
        log.stepPass('Company Name successfully verified in search results');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Company Name in results');
        throw e;
      }

      // ── Verify row count before clear ──────────────────────────────────
      log.step('Verifying row count matches expected result (1 row)');
      try {
        vars["RowsCountBeforeClear"] = String(await priceOfferedPage.RowCount.count());
        log.info(`Row count before clear: ${vars["RowsCountBeforeClear"]}`);
        expect(String(vars["RowsCountBeforeClear"])).toBe("1");
        log.info('Verified row count is exactly 1');
        log.stepPass('Row count before clear verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify row count before clear');
        throw e;
      }

      // ── Clear search filter ────────────────────────────────────────────
      log.step('Clearing search filter');
      try {
        await generalSettingPage.Clear_buttonUsername_Search_Bar.click();
        log.info('Clicked Clear button');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - results refreshed');
        log.stepPass('Search filter cleared successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to clear search filter');
        throw e;
      }

      // ── Verify row count after clear ───────────────────────────────────
      log.step('Verifying row count after clearing filter (should be greater than 1)');
      try {
        vars["RowsCountAfterClear"] = String(await priceOfferedPage.RowCount.count());
        log.info(`Row count after clear: ${vars["RowsCountAfterClear"]}`);
        expect(Number(vars["RowsCountAfterClear"])).toBeGreaterThan(1);
        log.info('Verified row count is greater than 1 after clearing filter');
        log.stepPass('Row count after clear verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify row count after clear');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts03_tc02_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });


});