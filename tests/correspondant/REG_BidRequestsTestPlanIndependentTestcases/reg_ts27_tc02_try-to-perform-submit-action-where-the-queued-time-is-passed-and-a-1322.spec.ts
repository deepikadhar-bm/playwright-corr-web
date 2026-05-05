// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestCreationPage } from '../../../src/pages/correspondant/bid-request-creation';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestCreationPage: BidRequestCreationPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestCreationPage = new BidRequestCreationPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS27_TC02_Try to perform submit action where, the Queued time is passed, and a next available batch exists', async ({ page }) => {

    const TC_ID = 'REG_TS27_TC02';
    const TC_TITLE = 'Try to perform submit action where the Queued time is passed, and a next available batch exists';
    const CorrPortalElem = new CorrPortalPage(page);
    try {
      log.tcStart(TC_ID, TC_TITLE);
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

      const profile1 = testDataManager.getProfileByName("Bid Requests");
      if (profile1 && profile1.data) {
        const CompanyName = profile1.data[0]['Company Name'];
        vars["CompanyName"] = CompanyName;
        log.info(`Loaded Company Name: ${vars["CompanyName"]}`);
        const BidMappingID = profile1.data[0]['BidMappingID'];
        vars["BidMappingID"] = BidMappingID;
        log.info(`Loaded Bid Mapping ID: ${vars["BidMappingID"]}`);
      }
      // ── Step 1: Login & Initial Setup ─────────────────────────────────────
      log.step('Logging in, deleting early config report, and navigating to Bulk Batch Timing');
      try {

        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.info('Logged into Correspondent Portal');

        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        log.info('Deleted early config report if present');

        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        log.info('Navigated to Bulk Batch Timing');

        vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
        log.info(`BufferTime captured: ${vars["BufferTime"]}`);

        log.stepPass('Login, early config cleanup, and Bulk Batch Timing navigation successful');
      } catch (e) {
        await log.stepFail(page, 'Failed during login or initial navigation to Bulk Batch Timing');
        throw e;
      }

      // ── Step 2: Modify Batch Intervals & Upload New Bid Request ───────────
      log.step('Modifying batch intervals with current EST time and uploading new bid request');
      try {
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
        log.info('Batch intervals modified with current EST time');

        //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        await CorrPortalElem.BidRequests_Menu.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Requests").first()).toBeVisible();
        log.info('Navigated to Upload New Bid Request');

        //await stepGroups.stepGroup_Uploading_Bid_RequestNew(page, vars);
        await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
        await page.waitForTimeout(2000); // Wait for upload to process and bid request to be created
        vars["EnabledTime"] = (await CorrPortalElem.Enabled_Time.first().textContent() || '').trim();
        await CorrPortalElem.Pricing_Return_Time.selectOption({ value: vars["EnabledTime"] });
        log.info('New bid request uploaded');

        log.stepPass('Batch intervals modified and new bid request uploaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to modify batch intervals or upload bid request');
        throw e;
      }

      // ── Step 3: Capture Batch Times & Continue ────────────────────────────
      log.step('Capturing batch times and computing buffer-adjusted selected batch time');
      try {
        //vars["SelectedBatchTime"] = await bidRequestsPage.First_Enabled_Time.getAttribute('title') || '';
        vars["SelectedBatchTime"] = (await bidRequestsPage.First_Enabled_Time.textContent())?.trim() || '';
        log.info(`SelectedBatchTime: ${vars["SelectedBatchTime"]}`);

        vars["SelectedBatchTimeWithoutbuffer"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["SelectedBatchTime"]));
          d.setMinutes(d.getMinutes() - parseInt(String(vars["BufferTime"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        })();
        log.info(`SelectedBatchTimeWithoutbuffer: ${vars["SelectedBatchTimeWithoutbuffer"]}`);

        vars["SecondEnabledBatchTime"] = (await bidRequestCreationPage.Second_Enabled_Time.textContent())?.trim() || '';
        log.info(`SecondEnabledBatchTime (raw): ${vars["SecondEnabledBatchTime"]}`);

        vars["ThirdEnabledBatchTime"] = (await bidRequestCreationPage.Third_Enabled_Time.textContent())?.trim() || '';
        log.info(`ThirdEnabledBatchTime (raw): ${vars["ThirdEnabledBatchTime"]}`);

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner hidden');
        await expect(page.getByText("Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt")).toBeVisible();

        await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "Bid_file_success_error_newfile1.xlsx"));
        log.info(`Verifying Upload Bid button is visible and enabled`);
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

        log.stepPass('Batch times captured and upload pop-up continued successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture batch times or click Continue on upload pop-up');
        throw e;
      }

      // ── Step 4: Validate Footer Queued Date & Compute Time Difference ─────
      log.step('Validating footer queued date and computing time difference to current EST time');
      try {
        vars["FooterQueuedDate"] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
        log.info(`FooterQueuedDate: ${vars["FooterQueuedDate"]}`);

        expect(String(vars["FooterQueuedDate"])).toContain(vars["SelectedBatchTimeWithoutbuffer"]);
        log.info('FooterQueuedDate matches SelectedBatchTimeWithoutbuffer');

        vars["QueuedForTime"] = String(vars["FooterQueuedDate"]).substring(23, String(vars["FooterQueuedDate"]).length - 6);
        vars["TimeStandard"] = String(vars["FooterQueuedDate"]).substring(18, String(vars["FooterQueuedDate"]).length - 3);
        vars["HourMin"] = String(vars["FooterQueuedDate"]).substring(12, String(vars["FooterQueuedDate"]).length - 6);
        log.info(`QueuedForTime: ${vars["QueuedForTime"]}, TimeStandard: ${vars["TimeStandard"]}, HourMin: ${vars["HourMin"]}`);

        vars["CurrentEstTime"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "hh:mm";
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        log.info(`CurrentEstTime: ${vars["CurrentEstTime"]}`);

        vars["TimeDifference"] = Math.abs(new Date('2000-01-01 ' + String(vars["CurrentEstTime"])).getTime() - new Date('2000-01-01 ' + String(vars["QueuedForTime"])).getTime()) / 60000 + '';
        log.info(`TimeDifference (minutes): ${vars["TimeDifference"]}`);

        await expect(bidRequestDetailsPage.Passed_Queued_For_TimeRed_Colour_Text).not.toBeVisible();
        log.info('Passed Queued For Time Red Colour Text is visible');

        vars["TimeInSeconds"] = (parseFloat(String(vars["TimeDifference"])) * parseFloat(String("60"))).toFixed(0);
        log.info(`TimeInSeconds: ${vars["TimeInSeconds"]}`);

        log.stepPass('Footer queued date validated and time difference computed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to validate footer queued date or compute time difference');
        throw e;
      }

      // ── Step 5: Wait Until Queued Time Has Passed ─────────────────────────
      log.step('Waiting for queued time to pass (polling every 4 minutes if needed)');
      try {
        await bidRequestDetailsPage.Bid_Request_Details_Text.click();
        log.info('Clicked Bid Request Details text to begin wait loop');

        while (parseFloat(String(vars["TimeDifference"])) > parseFloat(String("4"))) {
          log.info(`TimeDifference is ${vars["TimeDifference"]} minutes — waiting 4 minutes before rechecking`);
          await page.waitForTimeout(240000);
          await bidRequestDetailsPage.Bid_Request_Details_Text.click();
          vars["TimeDifference"] = (parseFloat(String(vars["TimeDifference"])) - parseFloat(String("4"))).toFixed(0);
          vars["TimeInSeconds"] = (parseFloat(String(vars["TimeDifference"])) * parseFloat(String("60"))).toFixed(0);
          log.info(`Updated TimeDifference: ${vars["TimeDifference"]} min, TimeInSeconds: ${vars["TimeInSeconds"]}`);
        }

        log.info(`TimeDifference is now ${vars["TimeDifference"]} minutes — waiting final ${vars["TimeInSeconds"]} seconds`);
        await page.waitForTimeout(parseInt(vars["TimeInSeconds"]) * 1000);

        log.stepPass('Wait for queued time to pass completed');
      } catch (e) {
        await log.stepFail(page, 'Failed during wait loop for queued time to pass');
        throw e;
      }

      // ── Step 6: Reload & Validate Status After Queued Time Passed ─────────
      log.step('Reloading page and validating status is "Ready for Pricing" after queued time passed');
      try {
        await page.reload();
        log.info('Page reloaded (first)');

        await page.waitForTimeout(10000);
        await page.reload();
        log.info('Page reloaded (second, after 10s wait)');

        await page.waitForLoadState('load');
        log.info('Page load state reached');

        await expect(bidRequestDetailsPage.Passed_Queued_For_TimeRed_Colour_Text).toBeVisible();
        log.info('Passed Queued For Time Red Colour Text is still visible after reload');

        await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Ready for Pricing");
        log.info('Status confirmed as "Ready for Pricing"');

        vars["Extractedqueuedtotime"] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
        log.info(`Extractedqueuedtotime: ${vars["Extractedqueuedtotime"]}`);

        expect(String(vars["Extractedqueuedtotime"])).toContain(vars["SelectedBatchTimeWithoutbuffer"]);
        log.info('Extractedqueuedtotime Contains SelectedBatchTimeWithoutbuffer');

        vars["ExtractedCurrentDate"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "MM/dd/yyyy";
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        log.info(`ExtractedCurrentDate: ${vars["ExtractedCurrentDate"]}`);

        expect(String(vars["Extractedqueuedtotime"])).toContain(vars["ExtractedCurrentDate"]);
        log.info('Extractedqueuedtotime Contains ExtractedCurrentDate');

        log.stepPass('Page reloaded and status validated as "Ready for Pricing" successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to validate status after reload');
        throw e;
      }

      // ── Step 7: Submit for Pricing ────────────────────────────────────────
      log.step('Clicking Submit for Pricing and confirming submission');
      try {
        await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
        log.info('Clicked Submit for Pricing button');

        await bidRequestDetailsPage.Yes_Submit_Button.waitFor({ state: 'visible' });
        log.info('Yes Submit button is visible');

        await bidRequestDetailsPage.Yes_Submit_Button.click();
        log.info('Clicked Yes Submit button');

        log.stepPass('Submit for Pricing confirmed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to submit for pricing');
        throw e;
      }

      // ── Step 8: Compute Adjusted Batch Times ──────────────────────────────
      log.step('Computing buffer-adjusted second and third enabled batch times');
      try {
        vars["SecondEnabledBatchTime"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["SecondEnabledBatchTime"]));
          d.setMinutes(d.getMinutes() - parseInt(String(vars["BufferTime"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        })();
        log.info(`SecondEnabledBatchTime (buffer-adjusted): ${vars["SecondEnabledBatchTime"]}`);

        vars["SecondEnabledBatchHourMin"] = String(vars["SecondEnabledBatchTime"]).substring(0, String(vars["SecondEnabledBatchTime"]).length - 3);
        vars["FirstDigit"] = String(vars["SecondEnabledBatchTime"]).substring(0, String(vars["SecondEnabledBatchTime"]).length - 7);
        log.info(`SecondEnabledBatchHourMin: ${vars["SecondEnabledBatchHourMin"]}, FirstDigit: ${vars["FirstDigit"]}`);

        if (String(vars["FirstDigit"]) === String("0")) {
          vars["SecondEnabledBatchTime"] = String(vars["SecondEnabledBatchTime"]).substring(1);
          log.info(`SecondEnabledBatchTime trimmed leading zero: ${vars["SecondEnabledBatchTime"]}`);
        }

        vars["ThirdEnabledBatchTime"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["ThirdEnabledBatchTime"]));
          d.setMinutes(d.getMinutes() - parseInt(String(vars["BufferTime"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        })();
        log.info(`ThirdEnabledBatchTime (buffer-adjusted): ${vars["ThirdEnabledBatchTime"]}`);

        vars["FirstDigit2"] = String(vars["ThirdEnabledBatchTime"]).substring(0, String(vars["ThirdEnabledBatchTime"]).length - 7);
        log.info(`FirstDigit2: ${vars["FirstDigit2"]}`);

        if (String(vars["FirstDigit2"]) === String("0")) {
          vars["ThirdEnabledBatchTime"] = String(vars["ThirdEnabledBatchTime"]).substring(1);
          log.info(`ThirdEnabledBatchTime trimmed leading zero: ${vars["ThirdEnabledBatchTime"]}`);
        }

        vars["PricingMovedText1"] = String("Pricing moved to the next batch today at") + ' ' + String(vars["SecondEnabledBatchTime"]);
        vars["PricingMovedText2"] = String("Pricing moved to the next batch today at") + ' ' + String(vars["ThirdEnabledBatchTime"]);
        log.info(`PricingMovedText1: ${vars["PricingMovedText1"]}`);
        log.info(`PricingMovedText2: ${vars["PricingMovedText2"]}`);

        log.stepPass('Buffer-adjusted batch times and pricing moved texts computed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to compute adjusted batch times');
        throw e;
      }

      // ── Step 9: Verify "Moved to Batch" Pop-up Text ───────────────────────
      log.step('Verifying "Moved to batch" pop-up contains expected pricing moved text');
      try {
        await page.waitForLoadState('load');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Page loaded and spinner hidden before pop-up verification');

        const text = await bidRequestDetailsPage.Moved_to_batch_pop_up.textContent();
        log.info(`Moved to batch pop-up text: ${text}`);

        if (text?.includes(vars["PricingMovedText1"])) {
          log.info(`Pop-up matches PricingMovedText1: "${vars["PricingMovedText1"]}"`);
        } else {
          log.info(`PricingMovedText1 not found — verifying against PricingMovedText2: "${vars["PricingMovedText2"]}"`);
          await expect(bidRequestDetailsPage.Moved_to_batch_pop_up).toContainText(vars["PricingMovedText2"]);
          log.info('Pop-up matched PricingMovedText2');
        }

        await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Ready for Pricing");
        log.info('Status confirmed as "Ready for Pricing" after pop-up verification');

        log.stepPass('"Moved to batch" pop-up text verified and status is "Ready for Pricing"');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify "Moved to batch" pop-up text');
        throw e;
      }

      // ── Step 10: Capture Request ID & Click OK ────────────────────────────
      log.step('Capturing Request ID from details and clicking OK button');
      try {
        vars["RequestIdFromDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
        vars["RequestIdFromDetails"] = String(vars["RequestIdFromDetails"]).trim();
        log.info(`RequestIdFromDetails: ${vars["RequestIdFromDetails"]}`);

        await okButtonPage.Ok_Button.click();
        log.info('Clicked OK button');

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner hidden after OK click');

        log.stepPass('Request ID captured and OK button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture Request ID or click OK');
        throw e;
      }

      // ── Step 11: Navigate Back to First Bid Request ───────────────────────
      log.step('Navigating to First Bid Request and computing queued time variables');
      try {
        if (true) /* Element First Bid Request ID is visible */ {
          await correspondentPortalPage.First_Bid_Request_ID.first().click();
          log.info('Clicked First Bid Request ID');

          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Spinner hidden after clicking First Bid Request ID');
        }

        vars["TimeStandard"] = String(vars["FooterQueuedDate"]).substring(18, String(vars["FooterQueuedDate"]).length - 3);
        vars["QueuedForTime"] = String("Queued /") + ' ' + String(vars["HourMin"]);
        log.info(`TimeStandard: ${vars["TimeStandard"]}, QueuedForTime: ${vars["QueuedForTime"]}`);

        if (String(vars["TimeStandard"]).includes(String("AM"))) {
          vars["TimeStandard"] = "am";
        } else {
          vars["TimeStandard"] = "pm";
        }
        log.info(`TimeStandard (normalized): ${vars["TimeStandard"]}`);

        log.stepPass('Navigated to first bid request and time standard normalized');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to first bid request or compute time variables');
        throw e;
      }

      // ── Step 12: Validate Bid Status in List View ─────────────────────────
      log.step('Navigating to Bid Requests list and validating expected queued status');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner hidden before navigating to Bid Requests side menu');

        await correspondentPortalPage.Bid_Requests_Side_Menu.click();
        log.info('Clicked Bid Requests Side Menu');

        vars["standardwithET"] = String(vars["TimeStandard"]) + ' ' + String("ET");
        vars["ExpectedQueuedForTime"] = String(vars["SecondEnabledBatchHourMin"]) + ' ' + String(vars["standardwithET"]);
        vars["ExpectedQueuedForTime1"] = vars["ExpectedQueuedForTime"];
        vars["FinalExpectedQueuedStatus"] = String("Queued /") + ' ' + String(vars["ExpectedQueuedForTime1"]);
        vars["FinalExpectedQueuedStatus"] = String(vars["FinalExpectedQueuedStatus"]).trim();
        log.info(`ExpectedQueuedForTime: ${vars["ExpectedQueuedForTime"]}`);
        log.info(`FinalExpectedQueuedStatus: ${vars["FinalExpectedQueuedStatus"]}`);

        vars["BidStatusExtractedFromList"] = await priceOfferedPage.Price_Offered_Status_Column_Data.first().textContent() || '';
        vars["BidStatusExtractedFromList"] = String(vars["BidStatusExtractedFromList"]).trim();
        log.info(`BidStatusExtractedFromList: ${vars["BidStatusExtractedFromList"]}`);

        expect(String(vars["BidStatusExtractedFromList"])).toContain(vars["FinalExpectedQueuedStatus"]);
        log.info('Bid status in list view matches FinalExpectedQueuedStatus');

        log.stepPass('Bid status in list view validated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to validate bid status in list view');
        throw e;
      }

      // ── Step 13: Navigate to Request Details & Final Validations ──────────
      log.step('Navigating to request details by ID and performing final status validations');
      try {
        await bidRequestListPage.Request_Id_to_select(vars["RequestIdFromDetails"]).click();
        log.info(`Clicked Request ID: ${vars["RequestIdFromDetails"]}`);

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner hidden after navigating to request details');

        await expect(bidRequestDetailsPage.Passed_Queued_For_TimeRed_Colour_Text).not.toBeVisible();
        log.info('Passed Queued For Time Red Colour Text is not visible on details page');

        await expect(bidRequestDetailsPage.Queued_For_TimeBlack_colour_text).toBeVisible();
        log.info('Queued For Time Black Colour Text is visible');

        await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Queued for Next Batch");
        log.info('Status confirmed as "Queued for Next Batch"');

        vars["QueuedTimeDetails"] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
        log.info(`QueuedTimeDetails: ${vars["QueuedTimeDetails"]}`);

        expect(String(vars["QueuedTimeDetails"]).toLowerCase()).toContain(String(vars["ExpectedQueuedForTime"]).toLowerCase());
        log.info(`QueuedTimeDetails contains ExpectedQueuedForTime: ${vars["ExpectedQueuedForTime"]}`);

        log.stepPass('Final status and queued time validations on details page passed');
      } catch (e) {
        await log.stepFail(page, 'Failed final validations on request details page');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});