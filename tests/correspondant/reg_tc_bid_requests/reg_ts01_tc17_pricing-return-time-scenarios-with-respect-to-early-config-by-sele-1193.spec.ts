// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BatchinbulkbatchtimingPage } from '../../../src/pages/correspondant/batchinbulkbatchtiming';
import { BidrequestCreationPage } from '../../../src/pages/correspondant/bidrequest-creation';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EarlyConfigPage } from '../../../src/pages/correspondant/early-config';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';
import { Logger as log } from '../../../src/helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { ENV } from '../../../src/config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { CorrPortalPage } from '../../../src/pages/correspondant/CorrPortalPage';
test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let batchinbulkbatchtimingPage: BatchinbulkbatchtimingPage;
  let bidrequestCreationPage: BidrequestCreationPage;
  let bidRequestPage: BidRequestPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let earlyConfigPage: EarlyConfigPage;
  let headerMappingPage: HeaderMappingPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;
  let reg_ts01_tc17_testFailed = false;

  test.beforeEach(async ({ page }) => {
    vars = {};
    batchinbulkbatchtimingPage = new BatchinbulkbatchtimingPage(page);
    bidrequestCreationPage = new BidrequestCreationPage(page);
    bidRequestPage = new BidRequestPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    earlyConfigPage = new EarlyConfigPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
  });
  const TC_ID = 'REG_TS01_TC17';
  const TC_TITLE = 'Pricing return time scenarios with respect to early config';

  test('REG_TS01_TC17_Pricing return time scenarios with respect to early config By Selecting Current Date and verifying the last batch time is not present in bid requests', async ({ page }) => {

    // const TC_ID = 'REG_TS01_TC17';
    // const TC_TITLE = 'Pricing return time scenarios with respect to early config';


    log.tcStart(TC_ID, TC_TITLE);

    try {


      // ── Step 1: Load Test Data & Credentials ─────────────────────────────
      log.step('Loading test data and credentials');
      try {
        const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
        if (profile2 && profile2.data) {
          const TimeInterval = profile2.data[0]['Time Interval'];
          vars["Time Interval"] = TimeInterval;

          const NoOfBatches = profile2.data[0]['NO of Batches'];
          vars["NO of Batches"] = NoOfBatches;
        }

        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;

        log.stepPass('Test data and credentials loaded');
      } catch (e) {
        await log.stepFail(page, 'Failed to load test data');
        throw e;
      }

      // ── Step 2: Login & Navigate ────────────────────────────────────────
      log.step('Login and navigation to bulk batch timing');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);

        await page.waitForLoadState('load');

        log.stepPass('Login and navigation successful');
      } catch (e) {
        await log.stepFail(page, 'Login/navigation failed');
        throw e;
      }

      // ── Step 3: Modify Batch Timing ─────────────────────────────────────
      log.step('Modifying batch timing');
      try {
        //await stepGroups.stepGroup_Modifying_The_Batch_Intervals(page, vars);
        await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);

        vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
        vars["ThirdBatchTimeFromLast"] = await bidRequestPage.Third_Batch_From_the_Last.textContent() || '';

        vars["LastBatchTimeToEnter"] = String(vars["ThirdBatchTimeFromLast"]).substring(0, String(vars["ThirdBatchTimeFromLast"]).length - 3);

        vars["BufferedThirdBatchTimeFromLast"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["ThirdBatchTimeFromLast"]));
          d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        })();

        vars["RequiredBatchTime"] = vars["BufferedThirdBatchTimeFromLast"];

        vars["LastBeforeBatchTime"] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';

        vars["BufferedLastBeforeBatchTime"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["LastBeforeBatchTime"]));
          d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        })();

        vars["LastBatchTime"] = await chaseFieldNamePage.Last_batch_Timebulk_batch_screen.textContent() || '';

        vars["BufferedLastBatchTime"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["LastBatchTime"]));
          d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        })();

        await stepGroups.stepGroup_Separating_Hours_and_Minutes(page, vars);

        log.stepPass('Batch timing modified successfully');
      } catch (e) {
        await log.stepFail(page, 'Batch timing modification failed');
        throw e;
      }

      // ── Step 4: Early Config Setup ──────────────────────────────────────
      log.step('Configuring early close settings');
      try {
        await correspondentPortalPage.Early_Close_Config.click();

        // vars["CurrentDateList"] = (() => {
        //   const d = new Date();
        //   const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
        //   const fmt = "yyyy/M/d";
        //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
        //   const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
        //   return fmt.replace('yyyy', p.year || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0')));
        // })();

        // vars["CurrentDateCalender"] = vars["CurrentDateList"];
        // vars["CurrentDateInput"] = vars["CurrentDateList"];
        // ── Date Variables (Restored exactly as-is) ─────────────────────────────
        vars["CurrentDateList"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "yyyy/M/d";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        vars["CurrentDateCalender"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "d-M-yyyy";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        vars["CurrentDateInput"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "yyyy-MM-dd";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();



        if (await statusInactive2Page.Delete_Early_Config_Button_CurrentDateList(vars["CurrentDateList"]).isVisible()) {
          await statusInactive2Page.Delete_Early_Config_Button_CurrentDateList(vars["CurrentDateList"]).click();
          await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
        }

        await correspondentPortalPage.Add_New_Config_Button.click();
        await correspondentPortalPage.Toggle_Date_Picker_Button.click();
        await earlyConfigPage.Current_Date(vars["CurrentDateCalender"]).click();

        await earlyConfigPage.Last_Batch_Time_Input_Box.pressSequentially(vars["LastBatchTimeToEnter"]);

        if (String(vars["Time_Unit"]).includes("AM")) {
          await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "AM" });
        } else {
          await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
        }

        await correspondentPortalPage.Save_Config_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        log.stepPass('Early config completed');
      } catch (e) {
        await log.stepFail(page, 'Early config failed');
        throw e;
      }

      // ── Step 5: Validation ──────────────────────────────────────────────
      log.step('Validating batch times in bid request');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        //page.waitForTimeout(2000);
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.hover();
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click({ force: true });
        //await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();
        //       await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.focus();
        // await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.press('ArrowDown');
        //await expect(bidrequestCreationPage.dropdownPanel).toBeVisible();
        //page.pause();
        // page.waitForTimeout(2000);
        page.pause();
        await expect(correspondentPortalPage.Pricing_Return_Time.locator(`option[value="${vars["BufferedThirdBatchTimeFromLast"]}"]`)).not.toBeAttached();
        log.info(`BufferedThirdBatchTimeFromLast : ${vars["BufferedThirdBatchTimeFromLast"]} is not visible`);
        await expect(correspondentPortalPage.Pricing_Return_Time.locator(`option[value="${vars["BufferedLastBeforeBatchTime"]}"]`)).not.toBeAttached();
        log.info(`BufferedLastBeforeBatchTime : ${vars["BufferedLastBeforeBatchTime"]} is not visible`);
        await expect(correspondentPortalPage.Pricing_Return_Time.locator(`option[value="${vars["BufferedLastBatchTime"]}"]`)).not.toBeAttached();
        log.info(`BufferedLastBatchTime : ${vars["BufferedLastBatchTime"]} is not visible`);

        log.stepPass('Validation successful');
      } catch (e) {
        await log.stepFail(page, 'Validation failed');
        throw e;
      }

      // ── Step 6: Cleanup ─────────────────────────────────────────────────
      log.step('Cleaning up early config');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await headerMappingPage.General_Settings.click();
        await correspondentPortalPage.Early_Close_Config.click();
        // const CorrPortalElem = new CorrPortalPage(page);
        //   if (await CorrPortalElem.Early_Config_For_Current_Date(vars["CurrentDateList"]).isVisible())  {
        //     await CorrPortalElem.Delete_Early_Config_Button(vars["CurrentDateList"]).hover();
        //     await expect(page.getByText("Delete")).toBeVisible();
        //     await CorrPortalElem.Delete_Early_Config_Button(vars["CurrentDateList"]).click();
        //     await CorrPortalElem.Yes_Delete_ButtonEarly_config.click();
        //     await CorrPortalElem.Early_Config_For_Current_Date(vars["CurrentDateList"]).waitFor({ state: 'hidden' });
        //   }
        await stepGroups.stepGroup_Delete_early_config(page, vars);

        log.stepPass('Cleanup successful');
      } catch (e) {
        await log.stepFail(page, 'Cleanup failed');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      reg_ts01_tc17_testFailed = true;
      throw e;
    }
  })
  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, reg_ts01_tc17_testFailed);
    if (reg_ts01_tc17_testFailed) {
      try {
        log.step('Executing after-test steps: Deleting Early Config Records if Present');
        // await correspondentPortalPage.Administration_Menu.click();
        // await correspondentPortalPage.GeneralSettings_Menu.click();
        await stepGroups.stepGroup_Delete_early_config(page, vars);
        log.stepPass('After-test steps executed successfully, deleted early config records if present');
      } catch (e) {
        await log.stepFail(page, 'After-test steps failed to execute as the script is passed');
        throw e;
      }
    }
  })
});