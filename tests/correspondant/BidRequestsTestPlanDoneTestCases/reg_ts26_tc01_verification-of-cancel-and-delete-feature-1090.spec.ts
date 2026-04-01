// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { testDataManager } from 'testdata/TestDataManager';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS26_TC01';
const TC_TITLE = 'Verification Of Cancel and Delete Feature';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials and Test Data ───────────────────────────
      log.step('Loading credentials and test data');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        const profileName = 'Bid Requests'; // TDP sheet name
        const profile = testDataManager.getProfileByName(profileName);
        if (profile && profile.data) {
          const reasonForCancellation = profile.data[0]['Reason For Cancellation'];
          const reasonForDeletion = profile.data[0]['Reason For Deletion'];
          vars["reasonForCancellation"] = reasonForCancellation;
          vars["reasonForDeletion"] = reasonForDeletion;
          const value = profile.data[0]['Company Name'];  // row 0, column name
          vars["CompanyName"] = value;
          const bidMappingID = profile.data[0]['BidMappingID'];
          vars["BidMappingID"] = bidMappingID;
        }
        const profileName2 = 'Administration_Bulk Batch Timing';
        const profile2 = testDataManager.getProfileByName(profileName2);
        if (profile2 && profile2.data) {
          const TimeInterval = profile2.data[0]['Time Interval'] || '';
          vars["Time_Interval"] = TimeInterval;
          const NoOfBatches = profile2.data[0]['NO of Batches'] || '';
          vars["NO of Batches"] = NoOfBatches;
          //log.info(`[${profileName2}] Loaded Time Interval: "${vars["Time_Interval"]}", NO of Batches: "${vars["NO of Batches"]}"`);
        }
        log.stepPass('Credentials and test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials and test data failed');
        throw e;
      }

      // ── Step 2: Login to Correspondent Portal ────────────────────────────
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }

      // ── Step 3: Upload First Bid Request and Submit for Pricing ──────────
      log.step('Uploading first Bid Request and submitting for pricing');
      try {
        //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        // [DISABLED] Uploading Bid Request
        // await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
        // [DISABLED] Uploading Bid Request(New)
        // await stepGroups.stepGroup_Uploading_Bid_RequestNew(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);
        await CorrPortalElem.BidRequests_Menu.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Uploading_New_Bid_Request_Bid_Request_Screen(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
        await page.waitForTimeout(5000);
        await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('load');
        await page.waitForTimeout(5000);
        await bidRequestDetailsPage.Submit_for_PricingEnabled.waitFor({ state: 'visible' });
        await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestDetailsPage.Yes_Submit_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('First Bid Request uploaded and submitted for pricing successfully');
      } catch (e) {
        await log.stepFail(page, 'Uploading first Bid Request or submitting for pricing failed');
        throw e;
      }

      // ── Step 4: Upload Second Bid Request and Submit for Pricing ─────────
      log.step('Uploading second Bid Request and submitting for pricing');
      try {
        //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);
        await CorrPortalElem.BidRequests_Menu.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        //await expect(page.getByText("Bid Requests").first()).toBeVisible();
        //await CorrPortalElem.Upload_New_Bid_Request_Button.click();
        //await CorrPortalElem.Spinner.first().waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Uploading_New_Bid_Request_Bid_Request_Screen(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
        await page.waitForTimeout(5000);
        await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('load');
        await page.waitForTimeout(5000);
        await bidRequestDetailsPage.Submit_for_PricingEnabled.waitFor({ state: 'visible' });
        await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestDetailsPage.Yes_Submit_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Second Bid Request uploaded and submitted for pricing successfully');
      } catch (e) {
        await log.stepFail(page, 'Uploading second Bid Request or submitting for pricing failed');
        throw e;
      }

      // ── Step 5: Filter by Queued for Next Batch status ───────────────────
      log.step('Navigating to Bid Requests and filtering by Queued for Next Batch status');
      try {
        await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Filter_Dropdown1.click();
        await bidRequestPage.Select_Bid_Request_Status_Dropdown.click();
        await bidRequestsPage.Queued_for_Next_Batchbid_requests.check();
        await expect(bidRequestsPage.Queued_for_Next_Batchbid_requests).toBeVisible();
        await correspondentPortalPage.Apply_Selected.nth(1).click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestPage.First_Status_In_Column).toContainText("Queued");
        log.stepPass('Filtered by Queued for Next Batch status and verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Filtering by Queued for Next Batch status failed');
        throw e;
      }

      // ── Step 6: Cancel first Bid Request ─────────────────────────────────
      log.step('Cancelling first Bid Request and verifying cancellation');
      try {
        vars["CanceledBidRequestID"] = await correspondentPortalPage.First_Bid_Request_ID.first().textContent() || '';
        await correspondentPortalPage.Cancel_Bid_Request_Button.click();
        await expect(correspondentPortalPage.Cancel_Bid_Request_PopUp).toBeVisible();
        await expect(correspondentPortalPage.Yes_Go_ahead_Button_Bid_Request_List).toBeVisible();
        await correspondentPortalPage.Reason_for_cancelling_bid_request_Input.fill(vars["reasonForCancellation"]);
        await correspondentPortalPage.Reason_for_cancelling_bid_request_Input.press("Enter");
        await correspondentPortalPage.Yes_Go_ahead_Button_Bid_Request_List.click();
        await page.waitForTimeout(4000);
        vars["FirstBidRequestIDAfterCancel"] = await correspondentPortalPage.First_Bid_Request_ID.first().textContent() || '';
        expect(String(vars["CanceledBidRequestID"])).not.toBe(vars["FirstBidRequestIDAfterCancel"]);
        log.stepPass('Bid Request cancelled successfully. ID: ' + vars["CanceledBidRequestID"]);
      } catch (e) {
        await log.stepFail(page, 'Cancelling Bid Request failed');
        throw e;
      }

      // ── Step 7: Delete first Bid Request ─────────────────────────────────
      log.step('Deleting first Bid Request and verifying deletion');
      try {
        vars["DeletedBidRequestId"] = await correspondentPortalPage.First_Bid_Request_ID.first().textContent() || '';
        await bidRequestPage.Delete_Bid_Request_Button.click();
        await expect(correspondentPortalPage.Yes_Go_ahead_Button_Bid_Request_List).toBeVisible();
        await correspondentPortalPage.Reason_for_deleting_bid_request_Input.fill(vars["reasonForDeletion"]);
        await correspondentPortalPage.Reason_for_deleting_bid_request_Input.press("Enter");
        await expect(correspondentPortalPage.Yes_Go_ahead_Button_Bid_Request_List).toBeEnabled();
        await correspondentPortalPage.Yes_Go_ahead_Button_Bid_Request_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["FirstBidRequestIdAfterDelete"] = await correspondentPortalPage.First_Bid_Request_ID.first().textContent() || '';
        expect(String(vars["DeletedBidRequestId"])).not.toBe(vars["FirstBidRequestIdAfterDelete"]);
        log.stepPass('Bid Request deleted successfully. ID: ' + vars["DeletedBidRequestId"]);
      } catch (e) {
        await log.stepFail(page, 'Deleting Bid Request failed');
        throw e;
      }

      // ── Step 8: Search and verify Cancelled Bid Request ──────────────────
      log.step('Searching for cancelled Bid Request and verifying Cancelled status and reason');
      try {
        await correspondentPortalPage.Clear_All_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["CanceledBidRequestID"] = String(vars["CanceledBidRequestID"]).trim();
        vars["DeletedBidRequestId"] = String(vars["DeletedBidRequestId"]).trim();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["CanceledBidRequestID"]);
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.press("Enter");
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('load');
        await page.waitForTimeout(3000);
        await expect(correspondentPortalPage.First_Bid_Request_ID.first()).toContainText(vars["CanceledBidRequestID"]);
        await expect(bidRequestPage.First_Status_In_Column.first()).toContainText("Cancelled");
        await bidRequestPage.First_Bid_Value.first().hover();
        await bidRequestPage.First_Status_In_Column.first().hover();
        await expect(page.getByText(vars["reasonForCancellation"])).toBeVisible();
        await expect(correspondentPortalPage.Cancel_Bid_Request_Button).toBeDisabled();
        log.stepPass('Cancelled Bid Request verified successfully with correct status and reason');
      } catch (e) {
        await log.stepFail(page, 'Verifying cancelled Bid Request failed');
        throw e;
      }

      // ── Step 9: Search and verify Deleted Bid Request ────────────────────
      log.step('Searching for deleted Bid Request and verifying Deleted status and reason');
      try {
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.clear();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["DeletedBidRequestId"]);
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.press("Enter");
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('load');
        await page.waitForTimeout(3000);
        await expect(correspondentPortalPage.First_Bid_Request_ID.first()).toContainText(vars["DeletedBidRequestId"]);
        await expect(bidRequestPage.First_Status_In_Column.first()).toContainText("Deleted by testsigma_internal");
        await bidRequestPage.First_Bid_Value.first().hover();
        await bidRequestPage.First_Status_In_Column.first().hover();
        await expect(page.getByText(vars["reasonForDeletion"])).toBeVisible();
        await expect(bidRequestPage.Delete_Bid_Request_Button).toBeDisabled();
        log.stepPass('Deleted Bid Request verified successfully with correct status and reason');
      } catch (e) {
        await log.stepFail(page, 'Verifying deleted Bid Request failed');
        throw e;
      }

      // ─── TC End: PASS ────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }

  });
});