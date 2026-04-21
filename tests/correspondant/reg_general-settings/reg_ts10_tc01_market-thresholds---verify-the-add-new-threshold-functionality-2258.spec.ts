// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { MarketThresholdPage } from '../../../src/pages/correspondant/market-threshold';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { APP_CONSTANTS } from 'src/constants/app-constants';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS10_TC01';
const TC_TITLE = 'Market Thresholds - Verify the Add New Threshold Functionality';
let reg_ts10_tc01_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let marketThresholdPage: MarketThresholdPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    marketThresholdPage = new MarketThresholdPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS10_TC01_Market Thresholds - Verify the Add New Threshold Functionality', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login and initial navigation ──────────────────────────────────────
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

      // ── Navigate to Market Thresholds ──────────────────────────────────────
      log.step('Navigating to Administration > General Settings > Market Thresholds');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        log.info('Clicked Administration Menu');
        await correspondentPortalPage.GeneralSettings_Menu.click();
        log.info('Clicked General Settings Menu');
        await correspondentPortalPage.Market_Thresholds.click();
        log.info('Clicked Market Thresholds');
        log.stepPass('Successfully navigated to Market Thresholds page');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Market Thresholds');
        throw e;
      }

      // ── Add new market threshold entry ────────────────────────────────────
      log.step('Adding new market threshold entry for verification');
      try {
        await correspondentPortalPage.Add_New_Thresholds_Button.click();
        log.info('Clicked Add New Thresholds button');
        await commitmentListPage.Enter_minimum_display_value_in_percentage.waitFor({ state: 'visible' });
        log.info('Threshold input dialog appeared');
        vars["ExpectedProductCode"] = APP_CONSTANTS.ExpectedProductCode;
        await correspondentPortalPage.Username_Field.fill(vars["ExpectedProductCode"]);
        log.info(`Filled Product Code field with: ${vars["ExpectedProductCode"]}`);
        vars["MinDisplayValue"] = APP_CONSTANTS.MinDisplayValue;
        await commitmentListPage.Enter_minimum_display_value_in_percentage.fill(vars["MinDisplayValue"]);
        log.info(`Filled Min Display Value with: ${vars["MinDisplayValue"]}`);
        vars["MaxDisplayValue"] = APP_CONSTANTS.MaxDisplayValue;
        await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill(vars["MaxDisplayValue"]);
        log.info(`Filled Max Display Value with: ${vars["MaxDisplayValue"]}`);
        vars["ExpectedMinBPSValue"] = await correspondentPortalPage.Enter_minimum_value_in_BPS_Input.inputValue() || '';
        log.info(`Captured Min BPS Value: ${vars["ExpectedMinBPSValue"]}`);
        vars["MaxBPSValue"] = await correspondentPortalPage.Enter_maximum_value_in_BPS_Input.inputValue() || '';
        log.info(`Captured Max BPS Value: ${vars["MaxBPSValue"]}`);
        await correspondentPortalPage.Add_Threshold_Button.click();
        log.info('Clicked Add Threshold button');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - market threshold added');
        log.stepPass('New market threshold entry added successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add new market threshold entry');
        throw e;
      }

      // ── Verify threshold added displays in UI ────────────────────────────
      log.step('Verifying market threshold displays in the UI');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - ready for verification');
        // [DISABLED] Verify that the element Last Min Display Value displays text contains 1 % and With Scrollable FALSE
        await expect(marketThresholdPage.Required_Min_Display_Value(vars["ExpectedProductCode"])).toContainText(vars["MinDisplayValue"] + " %");
        log.info(`Verified Min Display Value contains: ${vars["MinDisplayValue"]} %`);
        // [DISABLED] Verify that the element Last Max Display Value(market thresholds) displays text contains 120 % and With Scrollable FALSE
        await expect(marketThresholdPage.Required_Max_Display_Value(vars["ExpectedProductCode"])).toContainText(vars["MaxDisplayValue"] + " %");
        log.info(`Verified Max Display Value contains: ${vars["MaxDisplayValue"]} %`);
        // [DISABLED] Verify that the element Last Product Code Value displays text contains ExpectedProductCode and With Scrollable FALSE
        await expect(correspondentPortalPage.Required_Product_Code_Value(vars["ExpectedProductCode"])).toContainText(vars["ExpectedProductCode"]);
        log.info(`Verified Product Code contains: ${vars["ExpectedProductCode"]}`);
        // [DISABLED] Verify that the element Last Min Value (BPS) displays text contains ExpectedMinBPSValue and With Scrollable FALSE
        await expect(marketThresholdPage.Required_Min_Value_BPS(vars["ExpectedProductCode"])).toContainText(vars["ExpectedMinBPSValue"]);
        log.info(`Verified Min Value (BPS) contains: ${vars["ExpectedMinBPSValue"]}`);
        // [DISABLED] Verify that the element Last Max Value(BPS) displays text contains MaxBPSValue and With Scrollable FALSE
        await expect(marketThresholdPage.Required_Max_ValueBPS(vars["ExpectedProductCode"])).toContainText(vars["MaxBPSValue"]);
        log.info(`Verified Max Value (BPS) contains: ${vars["MaxBPSValue"]}`);
        log.stepPass('Market threshold verified in UI successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify market threshold in UI');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts10_tc01_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, reg_ts10_tc01_testFailed);
    
      try {
        await page.reload();
        await page.waitForLoadState('load');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Test failed, executing after-test steps to reset state for next tests');
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Market_Thresholds.click();
        if (await marketThresholdPage.Required_Threshold_Delete_Button(vars["ExpectedProductCode"]).isVisible()) {
        log.info('Unwanted market threshold record found - removing it');
        await marketThresholdPage.Required_Threshold_Delete_Button(vars["ExpectedProductCode"]).click();
        await correspondentPortalPage.Yes_Go_ahead_Buttondelete.nth(1).waitFor({ state: 'visible' });
        await correspondentPortalPage.Yes_Go_ahead_Buttondelete.nth(1).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(marketThresholdPage.Required_Threshold_Delete_Button(vars["ExpectedProductCode"])).not.toBeVisible();
        log.info('Unwanted market threshold record removed in after-test steps');
        log.pass("After-test steps executed successfully");
      }
      } catch (e) {
        await log.stepFail(page, 'After-test steps failed to execute');
        throw e;
      }
    
    
  });
});