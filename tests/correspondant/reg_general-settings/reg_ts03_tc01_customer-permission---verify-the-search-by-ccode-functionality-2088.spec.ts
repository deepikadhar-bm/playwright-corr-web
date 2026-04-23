// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CcodePage } from '../../../src/pages/correspondant/ccode';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS } from 'src/constants/app-constants';

const TC_ID = 'REG_TS03_TC01';
const TC_TITLE = 'Customer Permission - Verify the search by CCode functionality';
let reg_ts03_tc01_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let ccodePage: CcodePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let generalSettingPage: GeneralSettingPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    ccodePage = new CcodePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS03_TC01_Customer Permission - Verify the search by CCode functionality', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login to Correspondent Portal ─────────────────────────────────
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

      // ── Extract company name and CCode ─────────────────────────────────
      log.step('Extracting first company name and CCode');
      try {
        vars["FirstCompanyName"] = await generalSettingPage.First_Company_Namecustomer_permission.textContent() || '';
        log.info(`First Company Name extracted: ${vars["FirstCompanyName"]}`);
        vars["ExpectedCCode"] = String(vars["FirstCompanyName"]).split("-")["1"] || '';
        log.info(`CCode before trim: ${vars["ExpectedCCode"]}`);
        vars["ExpectedCCode"] = String(vars["ExpectedCCode"]).trim();
        log.info(`Expected CCode after trim: ${vars["ExpectedCCode"]}`);
        log.stepPass('Company name and CCode extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract company name and CCode');
        throw e;
      }

      // ── Search by CCode ────────────────────────────────────────────────
      log.step(`Searching by CCode: ${vars["ExpectedCCode"]}`);
      try {
        await customerPermissionPage.Search_Filter_Input.clear();
        await customerPermissionPage.Search_Filter_Input.pressSequentially(String(vars["ExpectedCCode"]));
        log.info(`Pressed CCode sequentially: ${vars["ExpectedCCode"]}`);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - CCode search results loaded');
        log.stepPass('Successfully searched by CCode');
      } catch (e) {
        await log.stepFail(page, 'Failed to search by CCode');
        throw e;
      }

      // ── Verify CCode in results ────────────────────────────────────────
      log.step(`Verifying CCode appears in results: ${vars["ExpectedCCode"]}`);
      try {
        await expect(ccodePage.CCode).toContainText(vars["ExpectedCCode"]);
        log.info(`Verified CCode is visible in results: ${vars["ExpectedCCode"]}`);
        log.stepPass('CCode successfully verified in search results');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify CCode in results');
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
      reg_ts03_tc01_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });

});