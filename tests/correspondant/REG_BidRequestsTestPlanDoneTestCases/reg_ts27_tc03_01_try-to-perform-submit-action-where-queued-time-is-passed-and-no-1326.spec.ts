// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let reg_ts27_tc03_01_testFailed = false;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  const TC_ID = 'REG_TS27_TC03_01';
  const TC_TITLE = 'Try to perform submit action where, Queued time is passed, and no further batch exists for the day';

  test('REG_TS27_TC03_01_Try to perform submit action where, Queued time is passed, and no further batch exists for the day', async ({ page }) => {
    try {
      log.tcStart(TC_ID, TC_TITLE);

      // ── Step 1: Initialize Credentials ─────────────────────────────────────
      log.step('Initializing credentials and test variables');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
       
        vars["Time Interval"] = "4";
        log.info(`Time Interval set to: ${vars["Time Interval"]}`);

        vars["NO of Batches"] = "2";
        log.info(`NO of Batches set to: ${vars["NO of Batches"]}`);
        const profile1 = testDataManager.getProfileByName("Bid Requests");
        if (profile1 && profile1.data) {
          const CompanyName = profile1.data[0]['Company Name'];
          vars["CompanyName"] = CompanyName;
          log.info(`Loaded Company Name: ${vars["CompanyName"]}`);

          const BidMappingID = profile1.data[0]['BidMappingID'];
          vars["BidMappingID"] = BidMappingID;
          log.info(`Loaded Bid Mapping ID: ${vars["BidMappingID"]}`);

          const Ccodeforfreedom = profile1.data[0]['Ccode for freedom'];
          vars["Ccode for freedom"] = Ccodeforfreedom;
          log.info(`Loaded Ccode for freedom: ${vars["Ccode for freedom"]}`);
        } else {
          log.warn('Bid Requests profile not found');
        }

        log.stepPass('Credentials and test variables initialized successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to initialize credentials and test variables');
        throw e;
      }

      // ── Step 2: Login to Portal ────────────────────────────────────────────
      log.step('Logging into Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.info('Successfully logged into Correspondent Portal');
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to Correspondent Portal');
        throw e;
      }

      // ── Step 3: Navigate to Bulk Batch Timing ──────────────────────────────
      log.step('Navigating to Bulk Batch Timing');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        log.info('Successfully navigated to Bulk Batch Timing');
        log.stepPass('Navigation successful');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing');
        throw e;
      }

      // ── Step 4: Extract Buffer Time ────────────────────────────────────────
      log.step('Extracting Pricing Return Time Buffer');
      try {
        vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
        log.info(`Buffer Time extracted: ${vars["BufferTime"]}`);
        log.stepPass('Buffer Time extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract Buffer Time');
        throw e;
      }

      // ── Step 5: Modify Batch Intervals ─────────────────────────────────────
      log.step('Modifying batch intervals with current EST time');
      try {
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
        log.info('Successfully modified batch intervals with current EST time');
        log.stepPass('Batch intervals modified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to modify batch intervals');
        throw e;
      }

      // ── Step 6: Navigate to Upload New Bid Request ─────────────────────────
      log.step('Navigating to Upload New Bid Request');
      try {
        await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        log.info('Successfully navigated to Upload New Bid Request');
        log.stepPass('Navigation successful');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Upload New Bid Request');
        throw e;
      }

      // ── Step 7: Upload Bid Request ──────────────────────────────────────────
      log.step('Uploading Bid Request');
      try {

        await stepGroups.stepGroup_Uploading_Bid_RequestNew(page, vars);
        log.info('Successfully uploaded File for Bid Request');
        log.stepPass('File uploaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to upload Bid Request File');
        throw e;
      }
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      page.waitForTimeout(3000);
      // ── Step 8: Verify Spinner and Continue ────────────────────────────────
      log.step('Waiting for spinner and clicking continue button');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
      await page.waitForTimeout(5000);
      await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.waitForLoadState('load');
      await page.waitForTimeout(5000);
        log.stepPass('Continue action completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed during continue button action');
        throw e;
      }

      // ── Step 9: Extract Queued For Date and Time ───────────────────────────
      log.step('Extracting Queued For Date and calculating time differences');
      try {
        vars["FooterQueuedDate"] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
        log.info(`Footer Queued Date extracted: ${vars["FooterQueuedDate"]}`);

        vars["QueuedForTime"] = String(vars["FooterQueuedDate"]).substring(23, String(vars["FooterQueuedDate"]).length - 6);
        log.info(`Queued For Time extracted: ${vars["QueuedForTime"]}`);

        vars["CurrentEstTime"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "hh:mm";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
        })();
        log.info(`Current EST Time calculated: ${vars["CurrentEstTime"]}`);

        vars["TimeDiff"] = Math.abs(new Date('2000-01-01 ' + String(vars["CurrentEstTime"])).getTime() - new Date('2000-01-01 ' + String(vars["QueuedForTime"])).getTime()) / 60000 + '';
        log.info(`Time difference from current time: ${vars["TimeDiff"]} minutes`);

        log.stepPass('Queued For Date and time differences calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract Queued For Date and calculate time differences');
        throw e;
      }

      // ── Step 10: Verify Red Color Text is Not Visible ───────────────────────
      log.step('Verifying Passed Queued For Time Red Colour Text is not visible');
      try {
        log.info('Checking if Passed_Queued_For_TimeRed_Colour_Text is not visible');
        await expect(bidRequestDetailsPage.Passed_Queued_For_TimeRed_Colour_Text).not.toBeVisible();
        log.info('Red Colour Text is not visible as expected');
        log.stepPass('Red Colour Text visibility verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Red Colour Text is not visible');
        throw e;
      }

      // ── Step 11: Calculate Time Difference in Seconds ───────────────────────
      log.step('Calculating time difference in seconds');
      try {
        vars["TimeDifferenceInSeconds"] = (parseFloat(String(vars["TimeDiff"])) * parseFloat(String("60"))).toFixed(0);
        log.info(`Time difference in seconds: ${vars["TimeDifferenceInSeconds"]}`);
        log.stepPass('Time difference in seconds calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate time difference in seconds');
        throw e;
      }

      // [DISABLED] Click on the Refresh button in the browser
      // await page.reload();

      // ── Step 12: Click on Bid Request Details ──────────────────────────────
      log.step('Clicking on Bid Request Details');
      try {
        log.info('Clicking Bid_Request_Details_Text');
        await bidRequestDetailsPage.Bid_Request_Details_Text.first().click();
        log.info('Bid Request Details clicked');
        log.stepPass('Bid Request Details clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click on Bid Request Details');
        throw e;
      }

      //await page.waitForTimeout(parseInt(vars["TimeDifferenceInSeconds"]) * 1000);
      // ── Step 13: Wait for Queued Time to Pass ──────────────────────────────
      log.step('Waiting for time difference to reduce to 4 minutes or less');
      try {
        while (parseFloat(String(vars["TimeDiff"])) > parseFloat(String("4"))) {
          log.info(`TimeDiff (${vars["TimeDiff"]} min) > 4 min - waiting 240 seconds before re-check`);
          await page.waitForTimeout(240000);
          await correspondentPortalPage.Bid_Requested_Date.first().click();
          vars["TimeDiff"] = (parseFloat(String(vars["TimeDiff"])) - parseFloat(String("4"))).toFixed(0);
          vars["TimeDifferenceInSeconds"] = (parseFloat(String(vars["TimeDiff"])) * parseFloat(String("60"))).toFixed(0);
          log.info(`Updated TimeDiff: ${vars["TimeDiff"]} min | TimeDifferenceInSeconds: ${vars["TimeDifferenceInSeconds"]}`);
        }

        log.info(`TimeDiff is within 4 minutes - waiting final ${vars["TimeDifferenceInSeconds"]} seconds for time to elapse`);
        await page.waitForTimeout(parseInt(vars["TimeDifferenceInSeconds"]) * 1000);
        log.info('Final wait completed - selected batch time has now passed');

        log.stepPass('Queued time expiration wait completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed during queued time wait');
        throw e;
      }

      // ── Step 14: Click on Bid Request Details Again ─────────────────────────
      log.step('Clicking on Bid Request Details after time has passed');
      try {
        log.info('Clicking Bid_Request_Details_Text');
        await bidRequestDetailsPage.Bid_Request_Details_Text.click();
        log.info('Bid Request Details clicked');
        log.stepPass('Bid Request Details clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click on Bid Request Details');
        throw e;
      }

      // [DISABLED] Click on the Refresh button in the browser
      // await page.reload();

      // ── Step 15: Verify Submit for Pricing Button ──────────────────────────
      log.step('Verifying Submit for Pricing button and waiting for visibility');
      try {
        log.info('Waiting for spinner to be hidden');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner is hidden');

        log.info('Waiting for Submit_for_PricingEnabled to be visible');
        await bidRequestDetailsPage.Submit_for_PricingEnabled.waitFor({ state: 'visible' });
        log.info('Submit for Pricing button is visible');

        log.stepPass('Submit for Pricing button is ready');
      } catch (e) {
        await log.stepFail(page, 'Failed during Submit for Pricing button verification');
        throw e;
      }

      // ── Step 16: Click Submit for Pricing ──────────────────────────────────
      log.step('Clicking Submit for Pricing button');
      try {
        log.info('Clicking Submit_for_PricingEnabled button');
        await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
        log.info('Submit for Pricing button clicked');

        log.info('Waiting for Yes_Submit_Button to be visible');
        await bidRequestDetailsPage.Yes_Submit_Button.waitFor({ state: 'visible' });
        log.info('Yes Submit button is visible');

        log.info('Clicking Yes_Submit_Button');
        await bidRequestDetailsPage.Yes_Submit_Button.click();
        log.info('Yes Submit button clicked');

        log.stepPass('Submit for Pricing action completed');
      } catch (e) {
        await log.stepFail(page, 'Failed during Submit for Pricing action');
        throw e;
      }

      // ── Step 17: Verify Error Message ──────────────────────────────────────
      log.step('Verifying error message appears');
      try {
        log.info('Waiting for error message to appear');
        await expect(page.getByText("Cannot submit for pricing as last batch for pricing missed")).toBeVisible();
        log.info('Error message appeared: "Cannot submit for pricing as last batch for pricing missed"');

        log.info('Clicking Ok_Button');
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        log.info('Ok button clicked');

        log.stepPass('Error message verified and closed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify and handle error message');
        throw e;
      }

      // ── Step 18: Reload Page and Verify Upload Expired Status ───────────────
      log.step('Reloading page and verifying status is Upload Expired');
      try {
        log.info('Reloading page');
        await page.reload();
        log.info('Page reloaded');

        log.info('Verifying status is "Upload Expired"');
        await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Upload Expired");
        log.info('Status verified as "Upload Expired"');

        log.stepPass('Page reload and status verification completed');
      } catch (e) {
        await log.stepFail(page, 'Failed during page reload and status verification');
        throw e;
      }

      // ── Step 19: Extract Request ID ────────────────────────────────────────
      log.step('Extracting Request ID from Details');
      try {
        vars["RequestIdFromDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
        vars["RequestIdFromDetails"] = String(vars["RequestIdFromDetails"]).trim();
        log.info(`Request ID from Details extracted: ${vars["RequestIdFromDetails"]}`);

        log.stepPass('Request ID extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract Request ID');
        throw e;
      }

      // ── Step 20: Navigate to Bid Requests Side Menu ─────────────────────────
      log.step('Navigating to Bid Requests side menu');
      try {
        log.info('Clicking Bid_Requests_Side_Menu');
        await correspondentPortalPage.Bid_Requests_Side_Menu.click();
        log.info('Bid Requests side menu clicked');

        log.info('Waiting for spinner to be hidden');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner is hidden');

        log.stepPass('Navigation to Bid Requests menu completed');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Requests side menu');
        throw e;
      }

      // ── Step 21: Verify Status in Bid Requests List ────────────────────────
      log.step('Verifying status in Bid Requests list');
      try {
        log.info('Verifying Status_Of_Request_Id contains "Upload Expired"');
        await expect(bidRequestDetailsPage.Status_Of_Request_Id(vars["RequestIdFromDetails"])).toContainText("Upload Expired");
        log.info('Status verified as "Upload Expired" in list');

        log.stepPass('Status in Bid Requests list verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify status in Bid Requests list');
        throw e;
      }

      // ── Step 22: Navigate to Bulk Batch Timing for Cleanup ───────────────────
      log.step('Navigating to Bulk Batch Timing for cleanup');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        log.info('Successfully navigated to Bulk Batch Timing');

        log.stepPass('Navigation to Bulk Batch Timing completed');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing');
        throw e;
      }

      // ── Step 23: Modify Batches with 5 Min Prior ───────────────────────────
      log.step('Modifying batches with 5 minutes prior');
      try {
        vars["Time Interval"] = '5';
        vars["NO of Batches"] = '5';
        await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
        log.info('Successfully modified batches with 5 minutes prior');

        log.stepPass('Batch modification completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to modify batches with 5 minutes prior');
        throw e;
      }

      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      reg_ts27_tc03_01_testFailed = true;
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, reg_ts27_tc03_01_testFailed);
    if (reg_ts27_tc03_01_testFailed) {
      try {
        await page.reload();
        await page.waitForLoadState('load');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["Time Interval"] = '5';
        vars["NO of Batches"] = '5';
        log.info('Test failed, executing after-test steps to reset state');
        log.info('Navigating to Bulk Batch Timing for cleanup');
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        log.info('Modifying batches with 5 minutes prior');
        await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
        log.pass("After-test steps executed successfully");
      } catch (e) {
        await log.stepFail(page, 'After-test steps failed to execute');
        throw e;
      }
    }
  });
});