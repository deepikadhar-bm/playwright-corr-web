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
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = 'REG_TS12_TC01';
const TC_TITLE = 'Create a bid request by selecting today\'s date and verify the requested date and the uploaded data should be current date and also verify other fields.';

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
      // ── Load credentials ──────────────────────────────────────────────────
      log.step('Loading credentials and test data');
      try {
        // Load credentials
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        log.info(`Credentials loaded for user: ${vars["Username"]}`);

        const CorrPortalElem = new CorrPortalPage(page);

        // Load test data - profile 1
        const profileName = 'Bid Requests';
        const profile = testDataManager.getProfileByName(profileName);
        if (profile && profile.data) {
          const CompanyName = profile.data[0]['Company Name'];
          vars["CompanyName"] = CompanyName;
          log.info(`Loaded Company Name: ${vars["CompanyName"]}`);

          const BidMappingID = profile.data[0]['BidMappingID'];
          vars["BidMappingID"] = BidMappingID;
          log.info(`Loaded BidMappingID: ${vars["BidMappingID"]}`);
        }

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

        log.stepPass('Credentials and test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials and test data failed');
        throw e;
      }

      // ── Login and navigate to Upload New Bid Request ───────────────────────
      log.step('Logging in and navigating to Upload New Bid Request');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        //await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);
        await CorrPortalElem.BidRequests_Menu.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Requests").first()).toBeVisible();
        await stepGroups.stepGroup_Uploading_Bid_Request_copy(page, vars);

        //await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);

        log.stepPass('Login and navigation to Upload New Bid Request successful');
      } catch (e) {
        await log.stepFail(page, 'Login or navigation to Upload New Bid Request failed');
        throw e;
      }

      // ── Check second enabled batch time and select / configure accordingly ─
      log.step('Checking second enabled batch time visibility and selecting batch time');
      try {
        // Check if second enabled batch time is visible
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
          log.info("Enabled Time is Visible")
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          
        } else {
          log.info("Enabled Time is not visible, modifying the batches ")
          await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
          await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
          //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
          const CorrPortalElem = new CorrPortalPage(page);
          await CorrPortalElem.BidRequests_Menu.click();
          await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
          await expect(page.getByText("Bid Requests").first()).toBeVisible();
          await stepGroups.stepGroup_Uploading_Bid_Request_copy(page, vars);
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          // [DISABLED] Scroll to the element Enabled Date into view
          // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
          // [DISABLED] Click on Enabled Date
          // await bidRequestPage.Enabled_Time.click();
        }
        log.stepPass('Batch time selected successfully');
      } catch (e) {
        await log.stepFail(page, 'Checking or selecting batch time failed');
        throw e;
      }

      // ── Upload bid request file and proceed ───────────────────────────────
      log.step('Uploading bid request file and proceeding through upload popup');
      try {
        await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "Eligibility_check_UploadProgress (3).xlsx"));
        //vars["LoanNumberFromExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Eligibility_check.xlsx,Eligibility_check.xlsx"), "2", "1");
        await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
      await expect(correspondentPortalPage.UploadBid_Button).toBeEnabled();
      await correspondentPortalPage.UploadBid_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
      await page.waitForTimeout(5000);
      await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.waitForLoadState('load');
      await page.waitForTimeout(5000);
        log.stepPass('File uploaded and upload popup dismissed successfully');
      } catch (e) {
        await log.stepFail(page, 'Uploading bid request file or proceeding through upload popup failed');
        throw e;
      }

      // ── Capture values from bid request details ───────────────────────────
      log.step('Capturing values from bid request details page');
      try {
        // vars["CCodeValuesFromDetails"] = await correspondentPortalPage.CCode_Valuebid_request_details.textContent() || '';
        // vars["CompanyValueFromDetails"] = await bidRequestDetailsPage.Company_ValueBid_Request_Details.textContent() || '';
        // vars["RequestIDDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
        // vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
        // vars["BidStatusFromDetails"] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
        // vars["BidValueFromDetails"] = await bidRequestDetailsPage.Bid_Value_parsed_row.textContent() || '';
        // vars["ExecutionTypeFromDetails"] = await bidRequestDetailsPage.Execution_Type_From_Details.textContent() || '';
        // vars["TotalLoansDetails"] = await bidRequestDetailsPage.Total_Loans_From_Details.textContent() || '';
        // vars["ErroredLoansDetails"] = await bidRequestDetailsPage.Errored_Loans_From_Details.textContent() || '';
        vars["CCodeValuesFromDetails"] = await correspondentPortalPage.CCode_Valuebid_request_details.textContent() || '';
log.info(`CCodeValuesFromDetails: ${vars["CCodeValuesFromDetails"]}`);

vars["CompanyValueFromDetails"] = await bidRequestDetailsPage.Company_ValueBid_Request_Details.textContent() || '';
log.info(`CompanyValueFromDetails: ${vars["CompanyValueFromDetails"]}`);

vars["RequestIDDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
log.info(`RequestIDDetails: ${vars["RequestIDDetails"]}`);

vars["BidStatusFromDetails"] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
log.info(`BidStatusFromDetails: ${vars["BidStatusFromDetails"]}`);

vars["BidValueFromDetails"] = await bidRequestDetailsPage.Bid_Value_parsed_row.textContent() || '';
log.info(`BidValueFromDetails: ${vars["BidValueFromDetails"]}`);

vars["ExecutionTypeFromDetails"] = (await bidRequestDetailsPage.Execution_Type_From_Details.textContent() || '').trim();
log.info(`ExecutionTypeFromDetails: ${vars["ExecutionTypeFromDetails"]}`);

vars["TotalLoansDetails"] = await bidRequestDetailsPage.Total_Loans_From_Details.textContent() || '';
log.info(`TotalLoansDetails: ${vars["TotalLoansDetails"]}`);

vars["ErroredLoansDetails"] = await bidRequestDetailsPage.Errored_Loans_From_Details.textContent() || '';
log.info(`ErroredLoansDetails: ${vars["ErroredLoansDetails"]}`);
        log.info(`RequestIDDetails: "${vars["RequestIDDetails"]}"`);
        log.stepPass('Bid request details captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Capturing values from bid request details failed');
        throw e;
      }

      // ── Navigate to bid requests list and verify values ───────────────────
      log.step('Navigating to bid requests list and verifying values');
      try {
        await correspondentPortalPage.Bid_Requests_Side_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestDetailsPage.Ccode_From_List(vars["RequestIDDetails"])).toContainText(vars["CCodeValuesFromDetails"]);
        await expect(bidRequestListPage.Request_Id_From_list(vars["RequestIDDetails"])).toContainText(vars["RequestIDDetails"]);
        await expect(bidRequestListPage.Company_Name_From_List(vars["RequestIDDetails"])).toContainText(vars["CompanyValueFromDetails"]);
        await expect(bidRequestDetailsPage.Bid_Value_From_list(vars["RequestIDDetails"])).toContainText(vars["BidValueFromDetails"]);
        log.stepPass('Bid request list values verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to bid requests list or verifying values failed');
        throw e;
      }

      // ── Verify loans, errors and execution type counts ────────────────────
      log.step('Verifying loans, errored loans and execution type counts');
      try {
        // vars["LoansErrorsCount"] = await bidRequestsPage.LoansErrorStatus_From_List(vars["RequestIDDetails"]).textContent() || '';
        // vars["TotalLoansList"] = String(vars["LoansErrorsCount"]).split("/")["1"] || '';
        // vars["ErroredLoanList"] = String(vars["LoansErrorsCount"]).split("/")["2"] || '';
        vars["LoansErrorsCount"] = await bidRequestsPage.LoansErrorStatus_From_List(vars["RequestIDDetails"]).textContent() || '';
log.info(`LoansErrorsCount: ${vars["LoansErrorsCount"]}`);

const loanParts = String(vars["LoansErrorsCount"]).split("/");

vars["TotalLoansList"] = loanParts[0] || '';
log.info(`TotalLoansList: ${vars["TotalLoansList"]}`);

vars["ErroredLoanList"] = loanParts[1] || '';
log.info(`ErroredLoanList: ${vars["ErroredLoanList"]}`);
        log.info(`TotalLoansList : ${vars["TotalLoansList"]}  is equal to TotalLoansDetails : ${vars["TotalLoansDetails"]}`);
        expect(String(vars["TotalLoansDetails"])).toBe(vars["TotalLoansList"]);
        expect(String(vars["ErroredLoansDetails"])).toBe(vars["ErroredLoanList"]);
        log.info(`TotalLoansList : ${vars["TotalLoansList"]}  is equal to TotalLoansDetails : ${vars["TotalLoansDetails"]}`);

        vars["ExecutionTypeList"] = (await bidRequestListPage.Execution_type_from_List(vars["RequestIDDetails"]).textContent() || '').trim();
        expect(String(vars["ExecutionTypeFromDetails"])).toBe(vars["ExecutionTypeList"]);
        await expect(bidRequestListPage.BidStatus_From_List(vars["RequestIDDetails"])).toContainText(vars["BidStatusFromDetails"]);
        log.stepPass('Loans, errored loans and execution type counts verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Verifying loans, errored loans or execution type counts failed');
        throw e;
      }

      // ── Verify today's date on requested and uploaded date fields ─────────
      log.step('Verifying today\'s date on requested date and uploaded date fields');
      try {
        vars["TodaysDate"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
          const fmt = "MM/dd/yyyy";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return (fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')))).trim();
        })();
        await expect(bidRequestListPage.Requested_date_from_List(vars["RequestIDDetails"])).toContainText(vars["TodaysDate"]);
        await expect(bidRequestListPage.Uploaded_date_from_list(vars["RequestIDDetails"])).toContainText(vars["TodaysDate"]);
        log.stepPass(`Today's date "${vars["TodaysDate"]}" verified on requested and uploaded date fields`);
      } catch (e) {
        await log.stepFail(page, 'Verifying today\'s date on requested or uploaded date fields failed');
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