// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EarlyConfigPage } from '../../../src/pages/correspondant/early-config';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';

const TC_ID = 'REG_TS09_TC06';
const TC_TITLE = 'Bid Request - Disable both the pricing Modes, (OFF) and verify the Upload Bid request Button is get Visible in the Bid request screen.';
let reg_ts09_tc06_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let earlyConfigPage: EarlyConfigPage;
  let spinnerPage: SpinnerPage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    earlyConfigPage = new EarlyConfigPage(page);
    spinnerPage = new SpinnerPage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
  });

  test('REG_TS09_TC06_Bid Request - Disable both the pricing Modes, (OFF) and verify the Upload Bid request Button is get Visible in the Bid request screen.', async ({ page }) => {
    
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

      // ── Check Real Time Off Radio Button ────────────────────────────────
      log.step('Checking Real Time Off Radio Button');
      try {
        await bidRequestConfigPage.Real_Time_Off_Radio_Button.check();
        log.info('Checked Real Time Off Radio Button');
        log.stepPass('Real Time Off Radio Button checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to check Real Time Off Radio Button');
        throw e;
      }

      // ── Check Deferred Off Radio Button ────────────────────────────────
      log.step('Checking Deferred Off Radio Button');
      try {
        await bidRequestConfigPage.Deffered_Off_Radio_Button.check();
        log.info('Checked Deferred Off Radio Button');
        log.stepPass('Deferred Off Radio Button checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to check Deferred Off Radio Button');
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

      // ── Click Bid Requests Side Menu ────────────────────────────────────
      log.step('Clicking Bid Requests Side Menu');
      try {
        await correspondentPortalPage.Bid_Requests_Side_Menu.click();
        log.info('Clicked Bid Requests Side Menu');
        log.stepPass('Successfully clicked Bid Requests Side Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Bid Requests Side Menu');
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

      // ── Verify Upload New Bid Request Button is visible ────────────────
      log.step('Verifying Upload New Bid Request Button is notvisible');
      try {
        await expect(uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button).not.toBeVisible();
        log.info('Upload New Bid Request Button is not visible');
        log.stepPass('Upload New Bid Request Button visibility verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Upload New Bid Request Button visibility');
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

      // ── [DISABLED] Check Real Time On Radio Button ──────────────────────
      log.step('[DISABLED] Check Real Time On Radio Button');
      log.info('This step is disabled and will be skipped');
      // await earlyConfigPage.Real_time_On_Radio_Button.check();

      // ── Check Real Time Off Radio Button ────────────────────────────────
      log.step('Checking Real Time Off Radio Button');
      try {
        await bidRequestConfigPage.Real_Time_Off_Radio_Button.check();
        log.info('Checked Real Time Off Radio Button');
        log.stepPass('Real Time Off Radio Button checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to check Real Time Off Radio Button');
        throw e;
      }

      // ── Check Deferred On Radio Button ──────────────────────────────────
      log.step('Checking Deferred On Radio Button');
      try {
        await earlyConfigPage.Deffered_On_Radio_Button.check();
        log.info('Checked Deferred On Radio Button');
        log.stepPass('Deferred On Radio Button checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to check Deferred On Radio Button');
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

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts09_tc06_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });

  test.afterEach(async ({ page }) => {
    // ── Cleanup: Navigating to Bid Request Config ───────────────────────────
    log.step('[AfterEach] Navigating to Bid Request Config');
    try {
      await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
      log.info('[AfterEach] Navigated to Bid Request Config');
      log.stepPass('[AfterEach] Successfully navigated to Bid Request Config');
    } catch (e) {
      await log.stepFail(page, '[AfterEach] Failed to navigate to Bid Request Config');
    }

    // ── Cleanup: [DISABLED] Check Real Time On Radio Button ────────────────
    log.step('[AfterEach] [DISABLED] Check Real Time On Radio Button');
    log.info('[AfterEach] This step is disabled and will be skipped');
    // await earlyConfigPage.Real_time_On_Radio_Button.check();

    // ── Cleanup: Check Real Time Off Radio Button ───────────────────────────
    log.step('[AfterEach] Checking Real Time Off Radio Button');
    try {
      await bidRequestConfigPage.Real_Time_Off_Radio_Button.check();
      log.info('[AfterEach] Checked Real Time Off Radio Button');
      log.stepPass('[AfterEach] Real Time Off Radio Button checked successfully');
    } catch (e) {
      await log.stepFail(page, '[AfterEach] Failed to check Real Time Off Radio Button');
    }

    // ── Cleanup: Check Deferred On Radio Button ─────────────────────────────
    log.step('[AfterEach] Checking Deferred On Radio Button');
    try {
      await earlyConfigPage.Deffered_On_Radio_Button.check();
      log.info('[AfterEach] Checked Deferred On Radio Button');
      log.stepPass('[AfterEach] Deferred On Radio Button checked successfully');
    } catch (e) {
      await log.stepFail(page, '[AfterEach] Failed to check Deferred On Radio Button');
    }

    // ── Cleanup: Check if Save Changes Button is enabled ────────────────────
    log.step('[AfterEach] Checking if Save Changes Button is enabled');
    try {
      if (await bidRequestConfigPage.Save_Changes_Button.isEnabled()) {
        // ── Cleanup: Click Save Changes Button ──────────────────────────────
        log.step('[AfterEach] Clicking Save Changes Button');
        try {
          await bidRequestConfigPage.Save_Changes_Button.click();
          log.info('[AfterEach] Clicked Save Changes Button');
          log.stepPass('[AfterEach] Save Changes Button clicked successfully');

          // ── Cleanup: Wait for spinner to disappear ────────────────────────
          log.step('[AfterEach] Waiting for spinner to disappear');
          try {
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            log.info('[AfterEach] Spinner disappeared - cleanup completed');
            log.stepPass('[AfterEach] Page loaded successfully');
          } catch (e) {
            await log.stepFail(page, '[AfterEach] Failed to wait for spinner to disappear');
          }
        } catch (e) {
          await log.stepFail(page, '[AfterEach] Failed to click Save Changes Button');
        }
      } else {
        log.info('[AfterEach] Save Changes Button is not enabled, skipping click');
      }
    } catch (e) {
      await log.stepFail(page, '[AfterEach] Failed to check Save Changes Button status');
    }

    // ── Cleanup: Wait for spinner to disappear ────────────────────────────
    log.step('[AfterEach] Waiting for spinner to disappear');
    try {
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.info('[AfterEach] Spinner disappeared - cleanup finalized');
      log.stepPass('[AfterEach] Cleanup finalized successfully');
    } catch (e) {
      await log.stepFail(page, '[AfterEach] Failed to wait for spinner to disappear');
    }
  });

});