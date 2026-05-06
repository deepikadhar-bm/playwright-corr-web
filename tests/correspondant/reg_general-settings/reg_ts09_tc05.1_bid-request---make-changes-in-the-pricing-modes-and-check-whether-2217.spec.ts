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
import { CorrPortalPage } from '../../../src/pages/correspondant/CorrPortalPage';

const TC_ID = 'REG_TS09_TC05_1';
const TC_TITLE = 'Bid Request - Make Changes in the Pricing Modes, and check whether it is get reflected in the Upload bid Request Module.';
let reg_ts09_tc05_1_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let earlyConfigPage: EarlyConfigPage;
  let spinnerPage: SpinnerPage;
  let corrPortalPage: CorrPortalPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    earlyConfigPage = new EarlyConfigPage(page);
    spinnerPage = new SpinnerPage(page);
    corrPortalPage = new CorrPortalPage(page);
  });

  test('REG_TS09_TC05_1_Bid Request - Make Changes in the Pricing Modes, and check whether it is get reflected in the Upload bid Request Module.', async ({ page }) => {
    
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

      // ── Conditional Save Changes Button check ──────────────────────────────
      if (true) /* Element Save Changes Button is enabled */ {
        log.step('Clicking Save Changes Button');
        try {
          if (await bidRequestConfigPage.Save_Changes_Button.isEnabled()) {
            await bidRequestConfigPage.Save_Changes_Button.click();
            log.info('Clicked Save Changes Button');
            log.stepPass('Save Changes Button clicked successfully');
          }
          else{
            log.info('Save Changes Button is disabled, skipping click action');
          }
        } catch (e) {
          await log.stepFail(page, 'Failed to click Save Changes Button');
          throw e;
        }
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

      // ── Uploading Bid Request ────────────────────────────────────────────
      log.step('Uploading Bid Request');
      try {
        await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
        log.info('Uploaded Bid Request');
        log.stepPass('Successfully uploaded Bid Request');
      } catch (e) {
        await log.stepFail(page, 'Failed to upload Bid Request');
        throw e;
      }

      // ── Upload Bid Process from Batch time Selection to Bid Upload ────────
      log.step('Processing Upload Bid from Batch time Selection to Bid Upload');
      try {
        await stepGroups.stepGroup_Upload_Bid_Process_from_Batch_time_Selection_to_Bid_Upload_P(page, vars);
        log.info('Processed Upload Bid through entire workflow');
        log.stepPass('Successfully processed Upload Bid workflow');
      } catch (e) {
        await log.stepFail(page, 'Failed to process Upload Bid workflow');
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

      // ── Verify Submit for Pricing Enabled is enabled ────────────────────
      log.step('Verifying Submit for Pricing Enabled is enabled');
      try {
        await expect(bidRequestDetailsPage.Submit_for_PricingEnabled).toBeEnabled();
        log.info('Submit for Pricing Enabled is enabled');
        log.stepPass('Submit for Pricing Enabled enabled verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Submit for Pricing Enabled is enabled');
        throw e;
      }

      // ── Click Submit for Pricing Enabled Button ──────────────────────────
      log.step('Clicking Submit for Pricing Enabled Button');
      try {
        await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
        log.info('Clicked Submit for Pricing Enabled Button');
        log.stepPass('Submit for Pricing Enabled Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Submit for Pricing Enabled Button');
        throw e;
      }

      // ── Wait for spinner to disappear ────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - submission processed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Click Yes Submit Button ──────────────────────────────────────────
      log.step('Clicking Yes Submit Button');
      try {
        await bidRequestDetailsPage.Yes_Submit_Button.click();
        log.info('Clicked Yes Submit Button');
        log.stepPass('Yes Submit Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Yes Submit Button');
        throw e;
      }

      // ── Wait for spinner to disappear ────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - confirmation submitted');
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

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts09_tc05_1_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });

});