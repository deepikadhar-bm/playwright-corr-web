// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';
import { BidrequestCreationPage } from '../../../src/pages/correspondant/bidrequest-creation';
import { ENV } from '@config/environments';

const TC_ID = 'REG_TS01_TC16';
const TC_TITLE = 'Verify that the passed time value should be disbaled and user should not be allowed to select.';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;
  let bidrequestCreationPage: BidrequestCreationPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
    bidrequestCreationPage = new BidrequestCreationPage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {
    
    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {
      // ── Step: Setup and Data Loading ───────────────────────────────────
      log.step('Initializing credentials and loading administration profiles');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;

        // Load test data - profile 2
        const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
        if (profile2 && profile2.data) {
          const TimeInterval = profile2.data[0]['Time Interval'];
          vars["Time Interval"] = TimeInterval;
          log.info(`Loaded Time Interval: ${vars["Time Interval"]}`);

          const NoOfBatches = profile2.data[0]['NO of Batches'];
          vars["NO of Batches"] = NoOfBatches;
          log.info(`Loaded NO of Batches: ${vars["NO of Batches"]}`);
        }
        log.stepPass('Credentials and profile data loaded');
      } catch (e) {
        await log.stepFail(page, 'Failed to load credentials or profiles');
        throw e;
      }

      // ── Step: Login and Navigation ─────────────────────────────────────
      log.step('Logging in and navigating to Bulk Batch Timing');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Modifying_Batch_Intervals_For_Passed_Time(page, vars);
        //await stepGroups.stepGroup_Writing_past_time_into_tdp(page, vars);
        log.stepPass('Navigation and batch modification complete');
      } catch (e) {
        await log.stepFail(page, 'Login or navigation failed');
        throw e;
      }

      // ── Step: Batch Processing ─────────────────────────────────────────
      log.step('Updating batch times, computing buffered timings and writing to TDP');
      try {
        vars["BatchCount"] = String(await correspondentPortalPage.Batches_Count.count());
        log.info(`Total batch count: ${vars["BatchCount"]}`);
        vars["BatchNum"] = "1";

        for (let dataIdx = 1; dataIdx <= parseInt(vars["BatchCount"]); dataIdx++) {
          log.info(`Processing batch ${dataIdx} of ${vars["BatchCount"]}`);
          vars["BatchTime"] = await statusInactivePage.BatchTime(String(dataIdx)).textContent() || '';
          log.info(`BatchNum ${vars["BatchNum"]} -> BatchTime: ${vars["BatchTime"]}`);

          vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
          log.info(`PricingReturnTimeBuffer: ${vars["PricingReturnTimeBuffer"]}`);

          vars["BufferedBatchTiming"] = (() => {
            const d = new Date('2000-01-01 ' + String(vars["BatchTime"]));
            d.setMinutes(d.getMinutes() + parseInt(String(vars["PricingReturnTimeBuffer"])));
            return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          })();
          log.info(`BufferedBatchTiming: ${vars["BufferedBatchTiming"]}`);

          testDataManager.updatePartialProfileDataByDataIndex(
            'bulk batch to bid request',
            { 'batch time': vars["BufferedBatchTiming"] },
            dataIdx
          );
          log.info(`Written to TDP [bulk batch to bid request] row ${dataIdx} -> batch time: ${vars["BufferedBatchTiming"]}`);
          vars["BatchNum"] = (parseFloat(String("1")) + parseFloat(String(vars["BatchNum"]))).toFixed(0);
        }
        log.stepPass('Batch timings processed and written to TDP');
      } catch (e) {
        await log.stepFail(page, 'Batch processing or TDP update failed');
        throw e;
      }

      // ── Step: Bid Request Navigation ────────────────────────────────────
      log.step('Navigating to Bid Requests and opening Upload popup');
      try {
        await page.waitForLoadState('load');
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Requests").first()).toBeVisible();
        await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        //await stepGroups.stepGroup_Past_time_disable_verification_in_bidrequest_dropdown(page, vars);
        log.stepPass('Bid Requests screen and Upload popup loaded');
      } catch (e) {
        await log.stepFail(page, 'Navigation to Bid Requests failed');
        throw e;
      }

      // ── Step: Verification ─────────────────────────────────────────────
      log.step('Selecting Today Only radio button and verifying disabled dropdown options for today');
      try {
        await statusInactivePage.TodayOnly_Radio_Button.check();
        await expect(statusInactivePage.TodayOnly_Radio_Button).toBeChecked();
        log.info('Today Only radio button is checked');

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.hover();
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click({ force: true });
        log.info('Pricing return time dropdown reopened via hover and force click');

        // Logic preserved: using vars["BatchNum"] as the starting point for validation
        for (let dataIdx = parseInt(vars["BatchNum"]); dataIdx <= parseInt(vars["CountOfOptionsDropdown"]); dataIdx++) {
          log.info(`Processing dropdown option ${dataIdx} of ${vars["CountOfOptionsDropdown"]} for Today Only`);

          const profileName = 'bulk batch to bid request';
          const profile = testDataManager.getProfileByName(profileName);
          if (profile && profile.data) {
            const batchTime = profile.data[dataIdx - 1]['batch time'];
            vars["batch time"] = batchTime;
            log.info(`Loaded batch time: ${vars["batch time"]}`);
          }

          vars["BatchTime"] = vars["batch time"];
          //await expect(correspondentPortalPage.Pricing_Return_Time.locator(`option[value="${vars["BatchTime"]}"]`)).toBeAttached();
          await expect(correspondentPortalPage.Pricing_Return_Time.locator(`option[value="${vars["BatchTime"]}"]`)).toBeDisabled();
          log.info(`Dropdown option verified as disabled for batch time: ${vars["BatchTime"]}`);

          await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();
          log.info('Dropdown clicked for next iteration');

          // await expect(chaseFieldNamePage.Option_in_PricingReturn_Dropdown).toBeVisible();
          vars["BatchNum"] = (parseFloat(String("1")) + parseFloat(String(vars["BatchNum"]))).toFixed(0);
          log.info(`BatchNum incremented to: ${vars["BatchNum"]}`);
        }
        log.stepPass('Verification of disabled options complete');
      } catch (e) {
        await log.stepFail(page, 'Selection or verification failed');
        throw e;
      }

      // ── Step: Teardown/Return ──────────────────────────────────────────
      log.step('Returning to Administration settings to modify batch intervals back to current est values');
      try {
        await statusInactivePage.Back_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await page.waitForLoadState('load');
        await correspondentPortalPage.Bulk_Batch_Timing.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars)
        log.stepPass('Successfully returned to Bulk Batch Timing and Modified Batch Intervals');
      } catch (e) {
        await log.stepFail(page, 'Return navigation failed or batch interval modification failed');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});