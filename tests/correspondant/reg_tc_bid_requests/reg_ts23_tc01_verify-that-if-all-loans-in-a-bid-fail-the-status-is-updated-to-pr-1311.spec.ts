// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS23_TC01';
const TC_TITLE = 'Verify that if all loans in a bid fail, the status is updated to \\\"Processing Failed,\\\" and the bid cannot be submitted for pricing.';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {
      const CorrPortalElem = new CorrPortalPage(page);

      // ── Step 1: Load Credentials ──────────────────────────────────────────
      log.step('Loading credentials');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        log.stepPass('Credentials loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials failed');
        throw e;
      }

      // ── Step 2: Login to Correspondent Portal ─────────────────────────────
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }

      // ── Step 3: Delete Early Config Report If Present ─────────────────────
      log.step('Deleting early config report if present');
      try {
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        log.stepPass('Early config report deletion step completed');
      } catch (e) {
        await log.stepFail(page, 'Deleting early config report failed');
        throw e;
      }

      // ── Step 4: Navigate to Upload New Bid Request ────────────────────────
      log.step('Navigating to Upload New Bid Request');
      try {
        await CorrPortalElem.BidRequests_Menu.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Requests").first()).toBeVisible();
        log.stepPass('Navigated to Upload New Bid Request successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Upload New Bid Request failed');
        throw e;
      }

      // ── Step 5: Upload Bid Request and Select Batch Time ──────────────────
      log.step('Uploading Bid Request and selecting batch time');
      try {
        await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);

        let isVisible = false;
        try {
          await page.locator('app-single-select-dropdown#pricingReturnTimeDropdown').waitFor({ state: 'visible', timeout: 10000 });
          const count = await CorrPortalElem.Second_Enabled_Time.count();
          log.info(`Second_Enabled_Time element count: ${count}`);
          isVisible = count > 0;
        } catch {
          isVisible = false;
        }
        log.info(`Is the second enabled batch time visible? ${isVisible}`);

        if (isVisible) {
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          log.info('Bid Request uploaded and enabled batch time selected successfully without modifying batch intervals');
          // [DISABLED] Scroll to the element Enabled Date into view
          // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
          // [DISABLED] Click on Enabled Date
          // await bidRequestPage.Enabled_Time.click();
        } else {
          await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
          await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
          await CorrPortalElem.BidRequests_Menu.click();
          await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
          await expect(page.getByText("Bid Requests").first()).toBeVisible();
          await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          log.info('Bid Request uploaded and enabled batch time selected successfully after modifying batch intervals');
          // [DISABLED] Scroll to the element Enabled Time into view
          // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
          // [DISABLED] Click on Enabled Date
          // await bidRequestPage.Enabled_Time.click();
        }
        log.stepPass('Bid Request uploaded and batch time selected successfully');
      } catch (e) {
        await log.stepFail(page, 'Uploading Bid Request or selecting batch time failed');
        throw e;
      }

      // ── Step 6: Upload Bid File and Verify Upload Progress Popup ─────────
      log.step('Uploading bid file and verifying upload progress popup');
      try {
        await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '..', '..', '..', 'uploads', "Bid_file_success_error_loans_popup_updated (3).xlsx"));
        await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
        await expect(correspondentPortalPage.UploadBid_Button).toBeEnabled();
        await correspondentPortalPage.UploadBid_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestDetailsPage.Bid_Upload_Progress_Header.waitFor({ state: 'visible' });
        //await expect(bidRequestDetailsPage.Bid_Upload_Progress_Header).toBeVisible();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
        //await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeVisible();
        const rows = await bidRequestPage.Rows_above_Loan_Field_validation.all();
        log.info(`Total rows above loan field validation: ${rows.length}`);
        for (const row of rows) {
          await expect(row).toContainText("Success");
        }
        page.waitForTimeout(5000);
        await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('load');
        page.waitForTimeout(5000);
        log.stepPass('Bid file uploaded and upload progress popup verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Uploading bid file or verifying upload progress popup failed');
        throw e;
      }

      // ── Step 7: Verify Processing Failed status and loan details ──────────
      log.step('Verifying Processing Failed status and errored loan details in Bid Request Details');
      try {
        vars["RequestIDDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
        vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
        vars["BidStatusFromDetails"] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
        await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Processing Failed");
        const loanStatusRows = await bidRequestDetailsPage.Loan_Status_ColumnCommon.all();
        log.info(`Total loan status rows: ${loanStatusRows.length}`);
        for (const row of loanStatusRows) {
          await expect(row).toContainText("Error");
        }
        vars["TotalLoansDetails"] = await bidRequestDetailsPage.Total_Loans_From_Details.textContent() || '';
        vars["ErroredLoansDetails"] = await bidRequestDetailsPage.Errored_Loans_From_Details.textContent() || '';
        expect(String(vars["ErroredLoansDetails"])).toBe(vars["TotalLoansDetails"]);
        vars["LoansErrors(Bid request details)"] = String(vars["TotalLoansDetails"]) + "/" + String(vars["ErroredLoansDetails"]);
        vars["LoansErrors(Bid request details)"] = String(vars["LoansErrors(Bid request details)"]).trim();
        await expect(bidRequestDetailsPage.Submit_For_Pricingdisabled).toBeDisabled();
        log.stepPass(`Processing Failed status and loan details verified - Request ID: ${vars["RequestIDDetails"]}, Loans/Errors: ${vars["LoansErrors(Bid request details)"]}`);
      } catch (e) {
        await log.stepFail(page, 'Verifying Processing Failed status or loan details failed');
        throw e;
      }

      // ── Step 8: Verify status and loan details in Bid Requests List ───────
      log.step('Navigating to Bid Requests list and verifying status and loan details');
      try {
        await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestListPage.Request_Id_From_list(vars["RequestIDDetails"])).toContainText(vars["RequestIDDetails"]);
        await expect(bidRequestListPage.BidStatus_From_List(vars["RequestIDDetails"])).toContainText("Processing Failed");
        vars["LoansErrors(bid requests list)"] = await bidRequestsPage.Loans_Errors_From_Bid_Requests_List.first().textContent() || '';
        vars["LoansErrors(bid requests list)"] = String(vars["LoansErrors(bid requests list)"]).trim();
        expect(String(vars["LoansErrors(Bid request details)"])).toBe(vars["LoansErrors(bid requests list)"]);
        log.stepPass(`Bid Requests list verified - Status: Processing Failed, Loans/Errors match: ${vars["LoansErrors(bid requests list)"]}`);
      } catch (e) {
        await log.stepFail(page, 'Verifying status or loan details in Bid Requests list failed');
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