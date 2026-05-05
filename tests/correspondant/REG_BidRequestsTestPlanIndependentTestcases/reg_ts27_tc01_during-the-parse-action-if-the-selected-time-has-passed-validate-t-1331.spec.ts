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
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { stepGroup_selecting_time_unit_bulk_batch, stepGroup_Separating_Hours_and_minutes_In_time_Current_EST_time } from '../../../src/helpers/step-groups';
//import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { ENV } from '../../../src/config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { BidrequestCreationPage } from '../../../src/pages/correspondant/bidrequest-creation';
import { BidRequestCreationPage } from '@pages/correspondant/bid-request-creation';


test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let bidrequestCreationPage: BidrequestCreationPage;
  let bidRequestCreationPage: BidRequestCreationPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    bidrequestCreationPage = new BidrequestCreationPage(page);
    bidRequestCreationPage = new BidRequestCreationPage(page);
  });

  test('REG_TS27_TC01_During the parse action, if the selected time has passed, validate the proper alert message, Once the parse is complete, verify that the queued batch updated accordingly', async ({ page }) => {

    // ── Step 1: Load credentials and test data ────────────────────────────────
    log.step('Loading credentials and test data');
    try {
      const credentials = ENV.getCredentials('internal');
      vars["Username"] = credentials.username;
      vars["Password"] = credentials.password;
      log.info('Fetched credentials for internal user');

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

    // ── Step 2: Login and initial navigation ─────────────────────────────────
    log.step('Logging into Correspondent Portal');
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    log.info('Login to Correspondent Portal completed');

    log.step('Deleting early config report if present');
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    log.info('Early config report deletion step completed');

    log.step('Navigating to Bulk Batch Timing');
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    log.info('Navigated to Bulk Batch Timing page');

    // ── Step 3: Read buffer time ──────────────────────────────────────────────
    vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
    log.info(`Read Pricing Return Time Buffer value: ${vars["BufferTime"]}`);

    // ── Step 4: Modify batch intervals with current EST time ──────────────────
    log.step('Modifying batch intervals with current EST time');
    const Methods = new AddonHelpers(page);
    const CorrPortalElem = new CorrPortalPage(page);

    await CorrPortalElem.Modify_Batch_Intervals_Button.click();
    log.info('Clicked Modify Batch Intervals button');

    await expect(page.getByText("Edit Batch Timing")).toBeVisible();
    log.info('Edit Batch Timing dialog is visible');

    const now = new Date();
    vars["CurrentTime"] = now.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    log.info(`Current EST time captured: ${vars["CurrentTime"]}`);

    await stepGroup_Separating_Hours_and_minutes_In_time_Current_EST_time(page, vars);
    log.info(`Separated time - Hour: ${vars["Time_Hour"]}, Minutes: ${vars["Time_Min"]}`);

    await CorrPortalElem.StartTime_In_Hour.fill(vars["Time_Hour"]);
    log.info(`Filled Start Time Hour: ${vars["Time_Hour"]}`);

    await CorrPortalElem.StartTime_In_Minutes.click({ clickCount: 3 });
    await CorrPortalElem.StartTime_In_Minutes.type(vars["Time_Min"]);
    log.info(`Filled Start Time Minutes: ${vars["Time_Min"]}`);

    await stepGroup_selecting_time_unit_bulk_batch(page, vars);
    log.info('Time unit selected for bulk batch');

    await CorrPortalElem.Time_Interval.fill('4');
    log.info('Filled Time Interval with value: 4');

    await CorrPortalElem.No_Of_Batches.fill(vars["NO of Batches"]);
    log.info(`Filled No Of Batches: ${vars["NO of Batches"]}`);

    await expect(CorrPortalElem.On_Radio_button_in_Bid_Request).toBeEnabled();
    log.info('On Radio button in Bid Request is enabled');

    await CorrPortalElem.Modify_Batch_Button.click();
    log.info('Clicked Modify Batch button');

    await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
    log.info('Spinner hidden - batch modification in progress');

    await expect(CorrPortalElem.Modified_batch_timings_successfully_Message).toBeVisible();
    log.info('Verified: Modified batch timings successfully message is visible');

    await CorrPortalElem.Ok_Button.click();
    log.info('Clicked OK button on batch timing success message');

    // ── Step 5: Navigate to Bid Requests ─────────────────────────────────────
    log.step('Navigating to Bid Requests menu');
    await CorrPortalElem.BidRequests_Menu.click();
    log.info('Clicked Bid Requests menu');

    await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
    log.info('Spinner hidden - Bid Requests page loading');

    await expect(page.getByText("Bid Requests").first()).toBeVisible();
    log.info('Bid Requests page title is visible');

    // ── Step 6: Upload bid request ────────────────────────────────────────────
    log.step('Uploading Bid Request');
    await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    log.info('Bid Request upload step group completed');
    page.waitForTimeout(3000);
    // ── Step 7: Select first enabled time and compute time difference ─────────
    log.step('Selecting first enabled batch time and computing time difference');
    //await bidRequestPage.Enabled_Time.first().scrollIntoViewIfNeeded();
    //await bidRequestPage.Enabled_Time.first().click();
    //await CorrPortalElem.Pricing_Return_Time.locator('option[aria-disabled="false"]').first().click();
    const labelToSelect = await CorrPortalElem.Pricing_Return_Time
      .locator('option[aria-disabled="false"]')
      .first()
      .innerText();

    if (labelToSelect) {
      await CorrPortalElem.Pricing_Return_Time.selectOption({ label: labelToSelect.trim() });
    }
    log.info('Scrolled to and clicked first enabled time slot');

    vars["SelectedBatchTime"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => {
      const s = el as HTMLSelectElement;
      return s.options[s.selectedIndex]?.text || '';
    });
    log.info(`Selected Batch Time from dropdown: ${vars["SelectedBatchTime"]}`);

    vars["SelectedHourMin"] = String(vars["SelectedBatchTime"]).substring(0, String(vars["SelectedBatchTime"]).length - 3);
    log.info(`Extracted SelectedHourMin (without AM/PM): ${vars["SelectedHourMin"]}`);

    vars["CurrentEstTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
      const fmt = "hh:mm";
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
    })();
    log.info(`Current EST time (hh:mm): ${vars["CurrentEstTime"]}`);

    vars["TimeDiff"] = Math.abs(
      new Date('2000-01-01 ' + String(vars["SelectedHourMin"])).getTime() -
      new Date('2000-01-01 ' + String(vars["CurrentEstTime"])).getTime()
    ) / 60000 + '';
    log.info(`Computed TimeDiff (minutes): ${vars["TimeDiff"]}`);

    vars["TimeDifferenceSeconds"] = (parseFloat(String(vars["TimeDiff"])) * parseFloat(String("60"))).toFixed(0);
    log.info(`Computed TimeDifferenceSeconds: ${vars["TimeDifferenceSeconds"]}`);

    // ── Step 8: Wait loop until time difference <= 4 minutes ─────────────────
    log.step('Waiting for time difference to reduce to 4 minutes or less');
    while (parseFloat(String(vars["TimeDiff"])) > parseFloat(String("4"))) {
      log.info(`TimeDiff (${vars["TimeDiff"]} min) > 4 min - waiting 240 seconds before re-check`);
      await page.waitForTimeout(240000);
      await correspondentPortalPage.Bid_Requested_Date.click();
      vars["TimeDiff"] = (parseFloat(String(vars["TimeDiff"])) - parseFloat(String("4"))).toFixed(0);
      vars["TimeDifferenceSeconds"] = (parseFloat(String(vars["TimeDiff"])) * parseFloat(String("60"))).toFixed(0);
      log.info(`Updated TimeDiff: ${vars["TimeDiff"]} min | TimeDifferenceSeconds: ${vars["TimeDifferenceSeconds"]}`);
    }

    log.info(`TimeDiff is within 4 minutes - waiting final ${vars["TimeDifferenceSeconds"]} seconds for time to elapse`);
    await page.waitForTimeout(parseInt(vars["TimeDifferenceSeconds"]) * 1000);
    log.info('Final wait completed - selected batch time has now passed');

    // ── Step 9: Upload bid file after time elapsed (expect alert) ─────────────
    log.step('Uploading bid file after selected time has passed - expecting alert');
    await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "Bid_file_success_error_newfile1.xlsx"));
    log.info('Set input file: Bid_file_success_error_newfile.xlsx');

    await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
    log.info('Upload Bid button is visible');

    await correspondentPortalPage.UploadBid_Button.click();
    log.info('Clicked Upload Bid button');

    // ── Step 10: Verify alert for passed pricing return time ──────────────────
    log.step('Verifying alert message for passed pricing return time');
    await bidRequestDetailsPage.Pricing_Return_Time_elapsed_page.waitFor({ state: 'visible' });
    log.info('Pricing Return Time elapsed alert is visible');

    await expect(bidRequestDetailsPage.Pricing_Return_Time_elapsed_page).toContainText("Selected pricing return time is already passed, please select a valid pricing return time");
    log.info('Verified: Alert message correctly states that selected pricing return time has passed');

    await okButtonPage.Ok_Button.click();
    log.info('Clicked OK button to dismiss the alert');

    // ── Step 11: Re-select pricing return time after dismissing alert ─────────
    log.step('Re-selecting pricing return time after alert dismissal');
    await expect(correspondentPortalPage.Pricing_Return_Time).toBeVisible();
    log.info('Pricing Return Time dropdown is visible');
    await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.hover();
    await correspondentPortalPage.Pricing_Return_Time.click({ force: true });
    log.info('Clicked Pricing Return Time dropdown (force)');

    const labelToSelect1 = await CorrPortalElem.Pricing_Return_Time
      .locator('option[aria-disabled="false"]')
      .first()
      .innerText();

    if (labelToSelect1) {
      await CorrPortalElem.Pricing_Return_Time.selectOption({ label: labelToSelect1.trim() });
    }
    log.info('Scrolled to and clicked first enabled time slot after alert dismissal');

    vars["ExtractedTimeAfterTimeLapsed"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => {
      const s = el as HTMLSelectElement;
      return s.options[s.selectedIndex]?.text || '';
    });
    log.info(`Extracted Time After Time Lapsed: ${vars["ExtractedTimeAfterTimeLapsed"]}`);

    // vars["ExtractedTimeAfterLapsed(Buffer time substracted)"] = (() => {
    //   const d = new Date('2000-01-01 ' + String(vars["ExtractedTimeAfterTimeLapsed"]));
    //   d.setMinutes(d.getMinutes() - parseInt(String(vars["BufferTime"])));
    //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    // })();
    // log.info(`Extracted Time After Lapsed with Buffer subtracted (${vars["BufferTime"]} min): ${vars["ExtractedTimeAfterLapsed(Buffer time substracted)"]}`);
    await bidRequestCreationPage.Delete_File_Button.click();
    await correspondentPortalPage.Yes_proceed_Button_BidRequest.click();
    log.info('Deleted previously uploaded file to allow for new upload');
//log.step('Uploading bid file after selected time has passed - expecting alert');
    await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "Bid_file_success_error_newfile1.xlsx"));
    log.info('Set input file: Bid_file_success_error_newfile.xlsx');
    // ── Step 12: Upload bid file with valid time ───────────────────────────────
    log.step('Uploading bid file with newly selected valid pricing return time');
     await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
      await expect(correspondentPortalPage.UploadBid_Button).toBeEnabled();
    await correspondentPortalPage.UploadBid_Button.click();
    log.info('Clicked Upload Bid button');

    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    log.info('Spinner hidden - bid upload processing');
    vars["ExtractedTimeAfterLapsed(Buffer time substracted)"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["ExtractedTimeAfterTimeLapsed"]));
      d.setMinutes(d.getMinutes() - parseInt(String(vars["BufferTime"])));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    })();
    log.info(`Extracted Time After Lapsed with Buffer subtracted (${vars["BufferTime"]} min): ${vars["ExtractedTimeAfterLapsed(Buffer time substracted)"]}`);

  
      //await correspondentPortalPage.UploadBid_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
      await page.waitForTimeout(5000);
      await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.waitForLoadState('load');
      await page.waitForTimeout(5000);

    // ── Step 13: Extract and validate footer queued date ──────────────────────
    log.step('Extracting and validating footer queued date');
    vars["ActualFooterQueuedExtractedDate"] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
    log.info(`Actual Footer Queued Date extracted: ${vars["ActualFooterQueuedExtractedDate"]}`);

    vars["currentDate"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
      const fmt = "MM/dd/yyyy";
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
    })();
    log.info(`Current date (MM/dd/yyyy in America/New_York): ${vars["currentDate"]}`);

    vars["ExpectedFooterQueuedDate"] = String(vars["currentDate"]) + ' ' + String(vars["ExtractedTimeAfterLapsed(Buffer time substracted)"]);
    log.info(`Expected Footer Queued Date (without ET): ${vars["ExpectedFooterQueuedDate"]}`);

    vars["ExpectedFooterQueuedDate(with ET)"] = String(vars["ExpectedFooterQueuedDate"]) + ' ' + String("ET");
    log.info(`Expected Footer Queued Date (with ET): ${vars["ExpectedFooterQueuedDate(with ET)"]}`);

    expect(String(vars["ActualFooterQueuedExtractedDate"])).toContain(vars["ExpectedFooterQueuedDate(with ET)"]);
    log.info(`Verified: Actual Footer Queued Date "${vars["ActualFooterQueuedExtractedDate"]}" contains expected "${vars["ExpectedFooterQueuedDate(with ET)"]}"`);

    log.stepPass('Test completed: Alert message validated and queued batch date verified successfully');
  });
});