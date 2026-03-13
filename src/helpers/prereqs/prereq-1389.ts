import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../pages/correspondant/bid-request-list';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1381 } from './prereq-1381';
import path from 'path';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';

export async function runPrereq_1389(page: Page, vars: Record<string, string>): Promise<void> {

  // ─── TC Start ─────────────────────────────────────────────────────────
  const TC_ID = 'PREREQ-1389';
  const TC_TITLE = 'Create a new Bid Request and submit for pricing to get the Price Offered status.';
  log.tcStart(TC_ID, TC_TITLE);
  const crederntials = ENV.getCredentials('internal'); // 2

  try {
    vars["Username"] = crederntials.username;// 3
    vars["Password"] = crederntials.password;// 4
    // console.log("Test Data: ", testData);
    console.log("Credentials: ", crederntials.username, crederntials.password);
    console.log("Credentials:==> ", vars["Username"], vars["Password"]);
    const profileName = 'Bid Requests';       // TDP sheet name
    const profile = testDataManager.getProfileByName(profileName);
    if (profile && profile.data) {
      const value = profile.data[0]['Company Name'];  // row 0, column name
      vars["CompanyName"] = value;
      const bidMappingID = profile.data[0]['BidMappingID'];
      vars["BidMappingID"] = bidMappingID;                  // store in vars
    }
    await runPrereq_1381(page, vars);

    const bidRequestDetailsPage = new BidRequestDetailsPage(page);
    const bidRequestListPage = new BidRequestListPage(page);
    const bidRequestPage = new BidRequestPage(page);
    const bidRequestsPage = new BidRequestsPage(page);
    const correspondentPortalPage = new CorrespondentPortalPage(page);
    const spinnerPage = new SpinnerPage(page);

    // ── Step 1: Login ──────────────────────────────────────────────────
    log.step('Login to Correspondent Portal');
    try {
      await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      log.stepPass('Login to Correspondent Portal successful');
    } catch (e) {
      await log.stepFail(page, 'Login to Correspondent Portal failed');
      throw e;
    }

    // ── Step 2: Delete Early Config Report ────────────────────────────
    log.step('Deleting Early Config Report if present');
    try {
      await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
      log.stepPass('Early Config Report deletion handled');
    } catch (e) {
      await log.stepFail(page, 'Deleting Early Config Report failed');
      throw e;
    }

    // ── Step 3: Navigate to Bulk Batch Timing ─────────────────────────
    log.step('Navigating to Bulk Batch Timing');
    try {
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      log.stepPass('Navigated to Bulk Batch Timing successfully');
    } catch (e) {
      await log.stepFail(page, 'Navigation to Bulk Batch Timing failed');
      throw e;
    }

    // ── Step 4: Modify Batch Intervals ────────────────────────────────
    log.step('Modifying Batch Intervals with current EST time');
    try {
      await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
      log.stepPass('Batch Intervals modified successfully');
    } catch (e) {
      await log.stepFail(page, 'Modifying Batch Intervals failed');
      throw e;
    }

    // ── Step 5: Navigate to Upload New Bid Request ────────────────────
    log.step('Navigating to Upload New Bid Request');
    try {
      await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
      log.stepPass('Navigated to Upload New Bid Request successfully');
    } catch (e) {
      await log.stepFail(page, 'Navigation to Upload New Bid Request failed');
      throw e;
    }

    // ── Step 6: Upload Bid Request ────────────────────────────────────
    log.step('Uploading Bid Request by selecting both Standard and Chase templates');
    try {
      await stepGroups.stepGroup_Uploading_Bid_Request_By_Selecting_both_standard_and_chase_t(page, vars);
      await correspondentPortalPage.Pricing_Return_Time.selectOption({ index: parseInt("2") });
      vars["ExtractedPrincingReturnTime"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
      await correspondentPortalPage.Upload_File.setInputFiles([path.resolve(__dirname, '..', '..', '..', 'uploads', 'Bid_file_success_error_newly_updated (10).xlsx')]);
      await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
      await expect(correspondentPortalPage.UploadBid_Button).toBeEnabled();
      await correspondentPortalPage.UploadBid_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
      await page.waitForTimeout(5000);

      //   page.once('response', response => {
      //   // Filter only your app's domain
      //   if (response.url().includes('lpcorrtest.com')) {
      //     console.log(`[${response.request().method()}] ${response.url()} - Status: ${response.status()}`);
      //   }
      // });

      await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.waitForLoadState('load');
      await page.waitForTimeout(5000);

      const currentUrl = page.url();
      console.log('Current URL:', currentUrl);
      log.stepPass('Bid Request file uploaded successfully');
    } catch (e) {
      await log.stepFail(page, 'Bid Request file upload failed');
      throw e;
    }

    // ── Step 7: Extract Request ID and verify status ───────────────────
    log.step('Extracting Request ID and verifying Ready for Pricing status');
    try {
      await bidRequestDetailsPage.Request_Id_From_Details.waitFor({ state: 'visible', timeout: 20000 });
      vars["RequestIDDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
      vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
      console.log("Extracted Request ID: " + vars["RequestIDDetails"]);
      await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Ready for Pricing");
      log.stepPass('Request ID extracted: ' + vars["RequestIDDetails"] + ' — Status is Ready for Pricing');
    } catch (e) {
      await log.stepFail(page, 'Extracting Request ID or verifying Ready for Pricing status failed');
      throw e;
    }

    // ── Step 8: Calculate Time Difference ────────────────────────────
    log.step('Calculating Queued Time and Current EST Time difference');
    try {
      vars["QueuedDateTime"] = await bidRequestDetailsPage.Queued_Forbid_request_details_text_dark.textContent() || '';
      vars["ExtractedDateTime"] = String('').split("")["3"] || '';
      vars["QueuedTime"] = vars["ExtractedDateTime"];
      vars["CurrentEstTime"] = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      vars["TimeDifference"] = Math.abs(new Date('2000-01-01 ' + String(vars["QueuedTime"])).getTime() - new Date('2000-01-01 ' + String(vars["CurrentEstTime"])).getTime()) / 60000 + '';
      log.stepPass('Time difference calculated successfully');
    } catch (e) {
      await log.stepFail(page, 'Time difference calculation failed');
      throw e;
    }

    // ── Step 9: Submit for Pricing ────────────────────────────────────
    log.step('Submitting Bid Request for Pricing');
    try {
      await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await bidRequestDetailsPage.Yes_Submit_Button.click();
      vars["CurrentEstTime"] = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      console.log("Current EST Time after submission: " + vars["CurrentEstTime"]);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Bid Request submitted for Pricing successfully');
    } catch (e) {
      await log.stepFail(page, 'Submitting Bid Request for Pricing failed');
      throw e;
    }

    // ── Step 10: Wait for Price Offered Status ────────────────────────
    log.step('Waiting for Price Offered status');
    try {
      await correspondentPortalPage.Bid_Requests_Side_Menu.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["index"] = "0";
      while (!(await bidRequestDetailsPage.Price_Offered_Status_of_searched_bid(vars["RequestIDDetails"]).isVisible())) {
        await page.reload();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["index"] = (parseInt(String(vars["index"])) + 1).toString();
        console.log("Current Attempt: " + vars["index"]);
      }
      console.log("Price Offered status is visible after " + vars["index"] + " attempts.");
      vars["CurrentEstTime"] = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      console.log("Current EST Time: " + vars["CurrentEstTime"]);
      log.stepPass('Price Offered status confirmed for Request ID: ' + vars["RequestIDDetails"]);
    } catch (e) {
      await log.stepFail(page, 'Price Offered status not achieved');
      throw e;
    }

    // ─── TC End: PASS ──────────────────────────────────────────────────
    log.tcEnd('PASS');

  } catch (e) {
    // ─── TC End: FAIL ──────────────────────────────────────────────────
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}