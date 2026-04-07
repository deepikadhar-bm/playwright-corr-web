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
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = 'REG_TS24_TC01';
const TC_TITLE = 'Verify that if a bid is created with having atleast one success loan, but not submitted for pricing, its status is displayed as \\"Ready for Pricing\\". Note: Verfification should be done';

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

      // ── Step 1: Load Credentials and Test Data ────────────────────────────
      const CorrPortalElem = new CorrPortalPage(page);
      log.step('Loading credentials and test data');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;

        const profileName = 'Bid Requests';
        const profile = testDataManager.getProfileByName(profileName);
        if (profile && profile.data) {
          const CompanyName = profile.data[0]['Company Name'];
          vars["CompanyName"] = CompanyName;
          const BidMappingID = profile.data[0]['BidMappingID'];
          vars["BidMappingID"] = BidMappingID;
        }

        const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
        if (profile2 && profile2.data) {
          const TimeInterval = profile2.data[0]['Time Interval'];
          vars["Time Interval"] = TimeInterval;
          const NoOfBatches = profile2.data[0]['NO of Batches'];
          vars["NO of Batches"] = NoOfBatches;
        }

        log.stepPass('Credentials and test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials and test data failed');
        throw e;
      }

      // ── Step 2: Login and Initial Navigation ─────────────────────────────
      log.step('Login and initial navigation');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        await stepGroups.stepGroup_Uploading_Bid_Request_For_Next_Buisiness_day(page, vars);
        // [DISABLED] Uploading Bid Request
        // await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
        log.stepPass('Login and initial navigation successful');
      } catch (e) {
        await log.stepFail(page, 'Login or initial navigation failed');
        throw e;
      }

      // ── Step 3: Batch Time Handling ──────────────────────────────────────
      log.step('Handling batch time selection');
      try {
        if (await CorrPortalElem.Second_Enabled_Time.isVisible()) /* Element Second Enabled Time is visible */ {
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          // [DISABLED] Scroll to the element Enabled Date into view
          // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
          // [DISABLED] Click on Enabled Date
          // await bidRequestPage.Enabled_Time.click();
        } else {
          await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
          // [DISABLED] Modifying The Batch Intervals For one Hour Prior.
          // await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page, vars);
          await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
          await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
          await stepGroups.stepGroup_Uploading_Bid_Request_For_Next_Buisiness_day(page, vars);
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          // [DISABLED] Uploading Bid Request
          // await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
          // [DISABLED] Scroll to the element Enabled Date into view
          // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
          // [DISABLED] Scroll inside an element Enabled Time to bottom
          // await bidRequestPage.Enabled_Time.evaluate(el => { (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight; });
          // [DISABLED] Click on Enabled Date
          // await bidRequestPage.Enabled_Time.click();
        }
        log.stepPass('Batch time handled successfully');
      } catch (e) {
        await log.stepFail(page, 'Batch time handling failed');
        throw e;
      }

      // ── Step 4: Upload File and Validate Upload Progress ─────────────────
      log.step('Uploading file and validating upload progress');
      try {
        await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "Bid_file_success_error_newfile1.xlsx"));
        await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
        await correspondentPortalPage.UploadBid_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        await bidRequestDetailsPage.Bid_Upload_Progress_Header.waitFor({ state: 'visible' });
        await expect(bidRequestDetailsPage.Bid_Upload_Progress_Header).toContainText("Bid Upload Progress");
        await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
        await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeVisible();
        await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeEnabled();
        //await expect(bidRequestPage.Rows_above_Loan_Field_validation).toContainText("Success");
        const rows = await bidRequestPage.Rows_above_Loan_Field_validation.all();
        log.info(`Total rows above loan field validation: ${rows.length}`);

        for (const row of rows) {
          await expect(row).toContainText("Success");
          log.info(`Row validation successful: ${await row.textContent()}`);
        }
        await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
        log.stepPass('File upload and progress validation successful');
      } catch (e) {
        await log.stepFail(page, 'File upload or progress validation failed');
        throw e;
      }

      // ── Step 5: Verify Bid Request Status and Loan Count ─────────────────
      log.step('Verifying bid request status and loan success count');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('load');
        vars["RequestIDDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
        vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
        log.info(`Request ID: ${vars["RequestIDDetails"]}`);
        await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Ready for Pricing");
        vars["LoanSucessCount"] = String(await bidRequestDetailsPage.LoanStatusCount.count());
        log.info(`Loan success count: ${vars["LoanSucessCount"]}`);
        expect(Number(vars["LoanSucessCount"])).toBeGreaterThanOrEqual(1);
        log.stepPass('Bid request status and loan count verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Bid request status or loan count verification failed');
        throw e;
      }

      // ── Step 6: Search Bid Request and Verify Status in List ─────────────
      log.step('Searching bid request and verifying status in list');
      try {
        await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestListPage.BidStatus_From_List(vars["RequestIDDetails"])).toContainText("Ready for Pricing");
        log.info(`Bid request status in list verified for ID: ${vars["RequestIDDetails"]}`);
        log.stepPass('Bid request search and status verification in list successful');
      } catch (e) {
        await log.stepFail(page, 'Bid request search or status verification in list failed');
        throw e;
      }

      // ── Step 7: Verify Total Loans Greater Than Error Count ───────────────
      log.step('Verifying total loans count is greater than error count');
      try {
        vars["LoansErrors(bid requests)"] = await bidRequestsPage.Loans_Errors_From_Bid_Requests_List.first().textContent() || '';
        vars["LoansErrors(bid requests)"] = String(vars["LoansErrors(bid requests)"]).trim();
        vars["TotalLoansDetails"] = String(vars["LoansErrors(bid requests)"]).split("/")["0"] || '';
        vars["ErrorCountDetails"] = String(vars["LoansErrors(bid requests)"]).split("/")["1"] || '';
        log.info(`Loans/Errors raw value: ${vars["LoansErrors(bid requests)"]}`);
        log.info(`Total Loans: ${vars["TotalLoansDetails"]}, Error Count: ${vars["ErrorCountDetails"]}`);
        // expect(String(vars["TotalLoansDetails"])).toBeGreaterThan(vars["ErrorCountDetails"]);
        expect(Number(vars["TotalLoansDetails"])).toBeGreaterThan(Number(vars["ErrorCountDetails"]));
        log.stepPass('Total loans count verified to be greater than error count');
      } catch (e) {
        await log.stepFail(page, 'Total loans vs error count verification failed');
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