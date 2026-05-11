// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EarlyConfigPage } from '../../../src/pages/correspondant/early-config';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = 'REG_TS09_TC05';
const TC_TITLE = 'Bid Request - Make Changes in the Pricing Modes, and check whether it is get reflected in the Upload bid Request Module.';
let reg_ts09_tc05_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let earlyConfigPage: EarlyConfigPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    earlyConfigPage = new EarlyConfigPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS09_TC05_Bid Request - Make Changes in the Pricing Modes, and check whether it is get reflected in the Upload bid Request Module. ', async ({ page }) => {
    
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

      // ── Check Real Time On Radio Button ────────────────────────────────
      log.step('Checking Real Time On Radio Button');
      try {
        await earlyConfigPage.Real_time_On_Radio_Button.check();
        log.info('Checked Real Time On Radio Button');
        log.stepPass('Real Time On Radio Button checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to check Real Time On Radio Button');
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

      // ── Conditional Save Changes Button check (commented) ──────────────
      // if (true) /* Element Save Changes Button is enabled */ {
      //   await bidRequestConfigPage.Save_Changes_Button.click();
      // }

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

      // ── Verify Save Changes Button is enabled ────────────────────────
      log.step('Verifying Save Changes Button is enabled');
      try {
        await expect(bidRequestConfigPage.Save_Changes_Button).toBeEnabled();
        log.info('Save Changes Button is enabled');
        log.stepPass('Save Changes Button enabled verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Save Changes Button is enabled');
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
        await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        log.info('Navigated to Upload New Bid Request');
        log.stepPass('Successfully navigated to Upload New Bid Request');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Upload New Bid Request');
        throw e;
      }

      // ── Uploading Bid Request for Real Time On ────────────────────────
      log.step('Uploading Bid Request for Real Time On');
      try {
        await stepGroups.stepGroup_Uploading_Bid_Request_for_Real_Time_On(page, vars);
        log.info('Uploaded Bid Request for Real Time On');
        log.stepPass('Successfully uploaded Bid Request for Real Time On');
      } catch (e) {
        await log.stepFail(page, 'Failed to upload Bid Request for Real Time On');
        throw e;
      }

      // // ── Wait for Bid Upload Progress text ───────────────────────────────
      // log.step('Waiting for Bid Upload Progress text');
      // try {
      //   await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
      //   log.info('Bid Upload Progress text is visible');
      //   log.stepPass('Bid Upload Progress text visibility confirmed');
      // } catch (e) {
      //   await log.stepFail(page, 'Failed to wait for Bid Upload Progress text');
      //   throw e;
      // }

      // ── Verify Upload Bid Button is enabled ──────────────────────────
      log.step('Verifying Upload Bid Button is enabled');
      try {
        await expect(correspondentPortalPage.UploadBid_Button).toBeEnabled();
        log.info('Upload Bid Button is enabled');
        log.stepPass('Upload Bid Button enabled verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Upload Bid Button is enabled');
        throw e;
      }

      // ── Click Upload Bid Button ──────────────────────────────────────
      log.step('Clicking Upload Bid Button');
      try {
        await correspondentPortalPage.UploadBid_Button.click();
        log.info('Clicked Upload Bid Button');
        log.stepPass('Upload Bid Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Upload Bid Button');
        throw e;
      }

      // ── Wait for spinner to disappear ────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - upload processed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Wait for Bid Upload Progress text (second time) ────────────────
      log.step('Waiting for Bid Upload Progress text');
      try {
        await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
        log.info('Bid Upload Progress text is visible');
        log.stepPass('Bid Upload Progress text visibility confirmed');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Bid Upload Progress text');
        throw e;
      }

      // ── Wait for spinner to disappear ────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - upload progress completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Wait for Continue Button in Upload Pop up ────────────────────
      log.step('Waiting for Continue Button in Upload Pop up');
      try {
        await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
        log.info('Continue Button in Upload Pop up is visible');
        log.stepPass('Continue Button visibility confirmed');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Continue Button');
        throw e;
      }

      // ── Wait 5 seconds ───────────────────────────────────────────────
      log.step('Waiting 5 seconds');
      try {
        await page.waitForTimeout(5000);
        log.info('Waited 5 seconds');
        log.stepPass('Timeout completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait 5 seconds');
        throw e;
      }

      // ── Click Continue Button in Upload Pop up ──────────────────────
      log.step('Clicking Continue Button in Upload Pop up');
      try {
        await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
        log.info('Clicked Continue Button in Upload Pop up');
        log.stepPass('Continue Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Continue Button');
        throw e;
      }

      // ── Wait for spinner to disappear ────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - pop up closed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for page load');
      try {
        await page.waitForLoadState('load');
        log.info('Page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
        throw e;
      }

      // ── Wait 5 seconds ───────────────────────────────────────────────
      log.step('Waiting 5 seconds');
      try {
        await page.waitForTimeout(5000);
        log.info('Waited 5 seconds');
        log.stepPass('Timeout completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait 5 seconds');
        throw e;
      }

      // ── Verify Submit for Pricing Enabled is visible ──────────────────
      log.step('Verifying Submit for Pricing Enabled is visible');
      try {
        await expect(bidRequestDetailsPage.Submit_for_PricingEnabled).toBeVisible();
        log.info('Submit for Pricing Enabled is visible');
        log.stepPass('Submit for Pricing Enabled visibility verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Submit for Pricing Enabled visibility');
        throw e;
      }

      // ── Verify Submit for Pricing Enabled is disabled ────────────────
      log.step('Verifying Submit for Pricing Enabled is disabled');
      try {
        await expect(bidRequestDetailsPage.Submit_for_PricingEnabled).toBeDisabled();
        log.info('Submit for Pricing Enabled is disabled');
        log.stepPass('Submit for Pricing Enabled disabled verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Submit for Pricing Enabled is disabled');
        throw e;
      }

      // ── Extract Request ID from Details ──────────────────────────────
      log.step('Extracting Request ID from Details');
      try {
        vars["RequestIDDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
        log.info(`Extracted Request ID: ${vars["RequestIDDetails"]}`);
        log.stepPass('Successfully extracted Request ID');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract Request ID from Details');
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

      // ── Verify Status contains "Queued" ──────────────────────────────
      log.step('Verifying Status contains "Queued"');
      try {
        await expect(correspondentPortalPage.Status).toContainText("Queued");
        log.info('Status contains "Queued"');
        log.stepPass('Status verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Status contains "Queued"');
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
      reg_ts09_tc05_testFailed = true;
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