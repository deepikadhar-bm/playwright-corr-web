// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';

const TC_ID = 'REG_TS09_TC01';
const TC_TITLE = 'Bid Request - Add POS Validation, the Validation is for Checking the Bid Uploaded, and for the Verification';
let reg_ts09_tc01_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS09_TC01_Bid Request - Add POS Validation, the Validation is for Checking the Bid Uploaded, and for the Verification', async ({ page }) => {
    
    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login and credentials setup ────────────────────────────────────
      log.step('Logging in to Correspondent Portal');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
                if (profile2 && profile2.data) {
                  const TimeInterval = profile2.data[0]['Time Interval'];
                  vars["Time Interval"] = TimeInterval;
                  log.info(`Loaded Time Interval: ${vars["Time Interval"]}`);
        
                  const NoOfBatches = profile2.data[0]['NO of Batches'];
                  vars["NO of Batches"] = NoOfBatches;
                  log.info(`Loaded NO of Batches: ${vars["NO of Batches"]}`);
                }

          const profileName = 'Bid Requests'; // TDP sheet name
                const profile = testDataManager.getProfileByName(profileName);
                if (profile && profile.data) {
                  
                  const CompanyName = profile.data[0]['Company Name'];
                  vars["CompanyName"] = CompanyName;
                  const BidMappingID = profile.data[0]['BidMappingID'];
                  vars["BidMappingID"] = BidMappingID;
                }
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

      // ── Wait for spinner to disappear ────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Navigate to Bid Request Config Menu ────────────────────────────
      log.step('Navigating to Bid Request Config Menu');
      try {
        await bidRequestPage.Bid_Request_Config_Menu.click();
        log.info('Clicked Bid Request Config Menu');
        log.stepPass('Successfully navigated to Bid Request Config Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Request Config Menu');
        throw e;
      }

      // ── Wait for spinner to disappear ────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Select option from Pricing Return Time dropdown ────────────────
      log.step('Selecting option from Pricing Return Time dropdown');
      try {
        await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: "Choice" });
        log.info('Selected "Choice" option from Pricing Return Time dropdown');
        log.stepPass('Option selected successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to select option from Pricing Return Time dropdown');
        throw e;
      }

      // ── Verify selected value in Pricing Return Time dropdown ────────────
      log.step('Verifying selected value in Pricing Return Time dropdown');
      try {
        await expect(correspondentPortalPage.Pricing_Return_Time).toHaveValue("Choice");
        log.info('Pricing Return Time dropdown has value: "Choice"');
        log.stepPass('Selected value verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify selected value in Pricing Return Time dropdown');
        throw e;
      }

      // ── Wait for Save Changes Button to be visible ─────────────────────
      log.step('Waiting for Save Changes Button to be visible');
      try {
        await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
        log.info('Save Changes Button is now visible');
        log.stepPass('Save Changes Button visibility confirmed');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Save Changes Button');
        throw e;
      }

      // ── Click Save Changes Button ──────────────────────────────────────
      log.step('Clicking Save Changes Button');
      try {
        await bidRequestConfigPage.Save_Changes_Button.click();
        log.info('Clicked Save Changes Button');
        log.stepPass('Save Changes Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Save Changes Button');
        throw e;
      }

      // ── Wait for spinner to disappear ────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - changes saved');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Navigating to Bulk Batch Timing ─────────────────────────────────
      log.step('Navigating to Bulk Batch Timing');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        log.info('Navigated to Bulk Batch Timing');
        log.stepPass('Successfully navigated to Bulk Batch Timing');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing');
        throw e;
      }

      // ── Modifying batch intervals with current est time ─────────────────
      log.step('Modifying batch intervals with current estimated time');
      try {
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
        log.info('Modified batch intervals with current estimated time');
        log.stepPass('Successfully modified batch intervals');
      } catch (e) {
        await log.stepFail(page, 'Failed to modify batch intervals');
        throw e;
      }

      // ── Navigating to Upload New Bid Request ──────────────────────────
      log.step('Navigating to Upload New Bid Request');
      try {
        //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);
          await CorrPortalElem.BidRequests_Menu.click();
          await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
          await expect(page.getByText("Bid Requests").first()).toBeVisible();
        log.info('Navigated to Upload New Bid Request');
        log.stepPass('Successfully navigated to Upload New Bid Request');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Upload New Bid Request');
        throw e;
      }

      // ── Uploading Bid Request ───────────────────────────────────────────
      log.step('Uploading Bid Request');
      try {
        await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
        log.info('Uploaded Bid Request');
        log.stepPass('Successfully uploaded Bid Request');
      } catch (e) {
        await log.stepFail(page, 'Failed to upload Bid Request');
        throw e;
      }

      // ── Upload Bid Request from batch time selection to continue button ──
      // [DISABLED] Upload Bid Request from batch time selection to continue button
      log.step('[DISABLED] Upload Bid Request from batch time selection to continue button');
      log.info('This step is disabled and will be skipped');
      // await stepGroups.stepGroup_Upload_Bid_Request_from_batch_time_selection_to_continue_but(page, vars);

      // ── Upload Bid Process from Batch time Selection to Bid Upload Page ──
      log.step('Uploading Bid Process from Batch time Selection to Bid Upload Page');
      try {
        await stepGroups.stepGroup_Upload_Bid_Process_from_Batch_time_Selection_to_Bid_Upload_P(page, vars);
        log.info('Uploaded Bid Process from Batch time Selection to Bid Upload Page');
        log.stepPass('Successfully uploaded Bid Process');
      } catch (e) {
        await log.stepFail(page, 'Failed to upload Bid Process');
        throw e;
      }

      // ── Get rows count from table ────────────────────────────────────────
      log.step('Getting rows count from table');
      try {
        vars["RowsCount"] = String(await bidRequestDetailsPage.Rows_Count_Table_1.count());
        log.info(`Extracted rows count: ${vars["RowsCount"]}`);
        log.stepPass('Successfully extracted rows count');
      } catch (e) {
        await log.stepFail(page, 'Failed to get rows count from table');
        throw e;
      }

      // ── Hovering over first error data ──────────────────────────────────
      log.step('Hovering over first error data');
      try {
        await bidRequestDetailsPage.First_error_data.first().hover();
        log.info('Hovered over first error data');
        log.stepPass('Successfully hovered over first error data');
      } catch (e) {
        await log.stepFail(page, 'Failed to hover over first error data');
        throw e;
      }

      // ── Get conventional error count ────────────────────────────────────
      log.step('Getting conventional error count');
      try {
        vars["ConventionalErrorCount"] = String(await bidRequestDetailsPage.Not_Approved_for_Conventional_Error_Description.count());
        log.info(`Extracted conventional error count: ${vars["ConventionalErrorCount"]}`);
        log.stepPass('Successfully extracted conventional error count');
      } catch (e) {
        await log.stepFail(page, 'Failed to get conventional error count');
        throw e;
      }

      // ── Verify rows count matches conventional error count ───────────────
      log.step('Verifying rows count matches conventional error count');
      try {
        expect(String(vars["RowsCount"])).toBe(vars["ConventionalErrorCount"]);
        log.info(`Rows count (${vars["RowsCount"]}) matches conventional error count (${vars["ConventionalErrorCount"]})`);
        log.stepPass('Rows count verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify rows count matches conventional error count');
        throw e;
      }

      // ── Navigating to Bid Request Config ────────────────────────────────
      log.step('Navigating to Bid Request Config');
      try {
        await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
        log.info('Navigated to Bid Request Config');
        log.stepPass('Successfully navigated to Bid Request Config');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Request Config');
        throw e;
      }

      // ── Select Conventional option from Pricing Return Time dropdown ─────
      log.step('Selecting Conventional option from Pricing Return Time dropdown');
      try {
        await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: "Conventional" });
        log.info('Selected "Conventional" option from Pricing Return Time dropdown');
        log.stepPass('Option selected successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to select Conventional option from Pricing Return Time dropdown');
        throw e;
      }

      // ── Wait for Save Changes Button to be visible ─────────────────────
      log.step('Waiting for Save Changes Button to be visible');
      try {
        await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
        log.info('Save Changes Button is now visible');
        log.stepPass('Save Changes Button visibility confirmed');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Save Changes Button');
        throw e;
      }

      // ── Click Save Changes Button ──────────────────────────────────────
      log.step('Clicking Save Changes Button');
      try {
        await bidRequestConfigPage.Save_Changes_Button.click();
        log.info('Clicked Save Changes Button');
        log.stepPass('Save Changes Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Save Changes Button');
        throw e;
      }

      // ── Wait for spinner to disappear ────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - changes saved');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Verify final value in Pricing Return Time dropdown ──────────────
      log.step('Verifying final value in Pricing Return Time dropdown');
      try {
        await expect(correspondentPortalPage.Pricing_Return_Time).toHaveValue("Conventional");
        log.info('Pricing Return Time dropdown has final value: "Conventional"');
        log.stepPass('Final value verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify final value in Pricing Return Time dropdown');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts09_tc01_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });

  test.afterEach(async ({ page }) => {
    if (reg_ts09_tc01_testFailed) {
    // ── Cleanup: Navigating to Bid Request Config ───────────────────────────
    log.step('[AfterEach] Navigating to Bid Request Config');
    try {
      await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
      log.info('[AfterEach] Navigated to Bid Request Config');
      log.stepPass('[AfterEach] Successfully navigated to Bid Request Config');
    } catch (e) {
      await log.stepFail(page, '[AfterEach] Failed to navigate to Bid Request Config');
    }

    // ── Cleanup: Select Conventional option ──────────────────────────────────
    log.step('[AfterEach] Selecting Conventional option from Pricing Return Time dropdown');
    try {
      await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: "Conventional" });
      log.info('[AfterEach] Selected "Conventional" option from Pricing Return Time dropdown');
      log.stepPass('[AfterEach] Option selected successfully');
    } catch (e) {
      await log.stepFail(page, '[AfterEach] Failed to select Conventional option from Pricing Return Time dropdown');
    }

    // ── Cleanup: Wait for Save Changes Button ────────────────────────────────
    log.step('[AfterEach] Waiting for Save Changes Button to be visible');
    try {
      await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
      log.info('[AfterEach] Save Changes Button is now visible');
      log.stepPass('[AfterEach] Save Changes Button visibility confirmed');
    } catch (e) {
      await log.stepFail(page, '[AfterEach] Failed to wait for Save Changes Button');
    }

    // ── Cleanup: Click Save Changes Button ───────────────────────────────────
    log.step('[AfterEach] Clicking Save Changes Button');
    try {
      if (await bidRequestConfigPage.Save_Changes_Button.isEnabled()) {
        await bidRequestConfigPage.Save_Changes_Button.click();
        log.info('[AfterEach] Clicked Save Changes Button');
        log.stepPass('[AfterEach] Save Changes Button clicked successfully');
        log.info('[AfterEach] Clicked Save Changes Button');
      log.stepPass('[AfterEach] Save Changes Button clicked successfully');
      }
      //await bidRequestConfigPage.Save_Changes_Button.click();
      // log.info('[AfterEach] Clicked Save Changes Button');
      // log.stepPass('[AfterEach] Save Changes Button clicked successfully');
    } catch (e) {
      await log.stepFail(page, '[AfterEach] Failed to click Save Changes Button');
    }

    // ── Cleanup: Verify final value ─────────────────────────────────────────
    log.step('[AfterEach] Verifying final value in Pricing Return Time dropdown');
    try {
      await expect(correspondentPortalPage.Pricing_Return_Time).toHaveValue("Conventional");
      log.info('[AfterEach] Pricing Return Time dropdown has final value: "Conventional"');
      log.stepPass('[AfterEach] Final value verified successfully');
    } catch (e) {
      await log.stepFail(page, '[AfterEach] Failed to verify final value in Pricing Return Time dropdown');
    }
  }
  else{
    log.info('Test passed, no cleanup needed in afterEach');
  }
  });

});