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
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = 'REG_TS13_TC01';
const TC_TITLE = 'Create a bid request by selecting next business date and verify the uploaded should be current date, but the requested date should be the next buisness day\'s date. and also verify other';

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

      // ── Load credentials and login ────────────────────────────────────────
      log.step('Loading credentials and logging in');
      try {
        const CorrPortalElem = new CorrPortalPage(page);
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
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

        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        await stepGroups.stepGroup_Uploading_Bid_Request_For_Next_Buisiness_day(page, vars);
        log.stepPass('Credentials loaded, login and navigation to Upload New Bid Request successful');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials or logging in failed');
        throw e;
      }

      // ── Check second enabled batch time and select / configure accordingly ─
      log.step('Checking second enabled batch time visibility and selecting batch time');
      try {
        const CorrPortalElem = new CorrPortalPage(page);
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
          // [DISABLED] Scroll to the element Enabled Date into view
          // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
          // [DISABLED] Click on Enabled Date
          // await bidRequestPage.Enabled_Time.click();
        } else {
          await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
          // [DISABLED] Modifying The Batch Intervals For Next bussiness day with one hour prior
          // await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page, vars);
          await stepGroups.stepGroup_Modifying_Batch_Intervals_For_next_bussiness_day(page, vars);
          await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
          await stepGroups.stepGroup_Uploading_Bid_Request_For_Next_Buisiness_day(page, vars);
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

      // ── Capture and compute next business date from details ───────────────
      log.step('Capturing and computing next business date from bid request details');
      
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      //   vars["NextBusinessDate"] = await bidRequestPage.Qued_for_date_from_details.textContent() || '';
      //   vars["NextBusinessDate"] = String(vars["NextBusinessDate"]).substring(11);

      //   vars["NextBusinessDate"] = String(vars["NextBusinessDate"]).replace(/ET/g, '');
      //   vars["NextBusinessDate"] = String(vars["NextBusinessDate"]).trim();
      //   vars[""] = (() => {
      //     const d = new Date(String(''));
      //     d.setMinutes(d.getMinutes() + parseInt(String('')));
      //     return d.toLocaleString('en-US');
      //   })();
      //   vars["NextBusinessDate"] = (() => {
      //     const d = new Date(String(vars["NextBusinessDate"]));
      //     const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      //     return "MM/dd/yyyy".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
      //   })();
      //   log.info(`Computed NextBusinessDate: "${vars["NextBusinessDate"]}"`);
      //   log.stepPass('Next business date captured and computed successfully');
      // } catch (e) {
      //   await log.stepFail(page, 'Capturing or computing next business date failed');
      //   throw e;
      // }
        try {
  // Step 1: Get text
  vars["NextBusinessDate"] = await bidRequestPage.Qued_for_date_from_details.textContent() || '';
  log.info(`Raw NextBusinessDate: ${vars["NextBusinessDate"]}`);

  // Step 2: Remove first 11 chars
  vars["NextBusinessDate"] = String(vars["NextBusinessDate"]).substring(11);

  // Step 3: Remove ET and trim
  vars["NextBusinessDate"] = String(vars["NextBusinessDate"])
    .replace(/ET/g, '')
    .trim();

  log.info(`Cleaned NextBusinessDate: ${vars["NextBusinessDate"]}`);

  // Step 4: Convert to Date
  let d = new Date(vars["NextBusinessDate"]);

  if (isNaN(d.getTime())) {
    throw new Error(`Invalid Date after parsing: ${vars["NextBusinessDate"]}`);
  }

  // Step 5: Add 5 minutes
  d.setMinutes(d.getMinutes() + 5);

  // Step 6: Format to MM/dd/yyyy
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();

  vars["NextBusinessDate"] = `${mm}/${dd}/${yyyy}`;

  log.info(`Computed NextBusinessDate: "${vars["NextBusinessDate"]}"`);
  log.stepPass('Next business date captured and computed successfully');

} catch (e) {
  await log.stepFail(page, 'Capturing or computing next business date failed');
  throw e;
}
      // ── Capture values from bid request details ───────────────────────────
      log.step('Capturing values from bid request details page');
      try {
        vars["CCodeValuesFromDetails"] = await correspondentPortalPage.CCode_Valuebid_request_details.textContent() || '';
        vars["CompanyValueFromDetails"] = await bidRequestDetailsPage.Company_ValueBid_Request_Details.textContent() || '';
        vars["RequestIDDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
        vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
        vars["BidStatusFromDetails"] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
        vars["BidValueFromDetails"] = await bidRequestDetailsPage.Bid_Value_parsed_row.textContent() || '';
        vars["ExecutionTypeFromDetailsTable1"] = await bidRequestDetailsPage.Execution_Type_from_Details_table1.textContent() || '';
        vars["ExecutionTypeFromDetailsTable2"] = await bidRequestDetailsPage.Execution_Type_from_detailstable2.textContent() || '';
        vars["TotalLoansDetails"] = await bidRequestDetailsPage.Total_Loans_From_Details.textContent() || '';
        vars["ErroredLoansDetails"] = await bidRequestDetailsPage.Errored_Loans_From_Details.textContent() || '';
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
        await expect(bidRequestListPage.Company_Name_From_List((vars["RequestIDDetails"]))).toContainText(vars["CompanyValueFromDetails"]);
        await expect(bidRequestDetailsPage.Bid_Value_From_list(vars["RequestIDDetails"])).toContainText(vars["BidValueFromDetails"]);
        log.stepPass('Bid request list values verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to bid requests list or verifying values failed');
        throw e;
      }

      // ── Verify loans, errors and execution type counts ────────────────────
      log.step('Verifying loans, errored loans and execution type counts');
      try {
        vars["LoansErrorsCount"] = await bidRequestsPage.LoansErrorStatus_From_List(vars["RequestIDDetails"]).textContent() || '';
        vars["TotalLoansList"] = String(vars["LoansErrorsCount"]).split("/")["0"] || '';
        vars["ErroredLoanList"] = String(vars["LoansErrorsCount"]).split("/")["1"] || '';
        expect(String(vars["TotalLoansDetails"])).toBe(vars["TotalLoansList"]);
        expect(String(vars["ErroredLoansDetails"])).toBe(vars["ErroredLoanList"]);
        vars["ExecutionTypeList"] = (await bidRequestListPage.Execution_type_from_List((vars["RequestIDDetails"])).textContent() || '').trim();
        vars["ExecutionType1List"] = (String(vars["ExecutionTypeList"]).split(",")["0"] || '').trim();
        vars["ExecutionType2List"] = (String(vars["ExecutionTypeList"]).split(",")["1"] || '').trim();
        expect(String(vars["ExecutionTypeFromDetailsTable1"])).toBe(vars["ExecutionType1List"]);
        expect(String(vars["ExecutionTypeFromDetailsTable2"])).toBe(vars["ExecutionType2List"]);
        await expect(bidRequestListPage.BidStatus_From_List(vars["RequestIDDetails"])).toContainText(vars["BidStatusFromDetails"]);
        log.stepPass('Loans, errored loans and execution type counts verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Verifying loans, errored loans or execution type counts failed');
        throw e;
      }

      // ── Verify today's date and next business date on list ────────────────
      log.step('Verifying today\'s date on uploaded date and next business date on requested date');
      try {
        vars["TodaysDate"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
          const fmt = "MM/dd/yyyy";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        // [DISABLED] Getting Next Bussiness day by handling weekend
        // await stepGroups.stepGroup_Getting_Next_Bussiness_day_by_handling_weekend(page, vars);
        await expect(bidRequestListPage.Requested_date_from_List(vars["RequestIDDetails"])).toContainText(vars["NextBusinessDate"]);
        await expect(bidRequestListPage.Uploaded_date_from_list(vars["RequestIDDetails"])).toContainText(vars["TodaysDate"]);
        log.stepPass(`Requested date verified as "${vars["NextBusinessDate"]}" and uploaded date verified as "${vars["TodaysDate"]}"`);
      } catch (e) {
        await log.stepFail(page, 'Verifying today\'s date or next business date on list failed');
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