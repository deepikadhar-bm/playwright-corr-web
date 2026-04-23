// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EarlyConfigPage } from '../../../src/pages/correspondant/early-config';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { CrossButtonPage } from '@pages/correspondant';

const TC_ID = 'REG_TS06_TC03';
const TC_TITLE = 'Early Config - Verify the Select data range calendar functionality';
let reg_ts06_tc03_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let earlyConfigPage: EarlyConfigPage;
  let spinnerPage: SpinnerPage;
  let CrossbuttonPage: CrossButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    earlyConfigPage = new EarlyConfigPage(page);
    spinnerPage = new SpinnerPage(page);
    CrossbuttonPage = new CrossButtonPage(page);
  });

  test('REG_TS06_TC03_Early Config - Verify the Select data range calendar functionality', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login and credentials setup ────────────────────────────────────
      log.step('Logging in to Correspondent Portal');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Successfully logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      // ── Navigate to Early Close Configuration ──────────────────────────
      log.step('Navigating to Bulk Batch Timing and Early Close Config');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        log.info('Navigated to Bulk Batch Timing section');
        await page.waitForLoadState('load');
        log.info('Page load completed');
        await correspondentPortalPage.Early_Close_Config.click();
        log.info('Clicked Early Close Config');
        log.stepPass('Successfully navigated to Early Close Config page');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Early Close Config');
        throw e;
      }

      // ── Calculate current date in List format ───────────────────────────
      log.step('Calculating current date in List format (yyyy/M/d)');
      try {
        vars["CurrentDateList"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "yyyy/M/d";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        log.info(` Current Date List Calculated: ${vars["CurrentDateList"]}`);
        log.stepPass('Current date in List format calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate current date in List format');
        throw e;
      }

      // ── Calculate current date in Calendar format ───────────────────────
      log.step('Calculating current date in Calendar format (d-M-yyyy)');
      try {
        vars["CurrentDateCalender"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "d-M-yyyy";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        log.info(` Current Date Calendar Calculated: ${vars["CurrentDateCalender"]}`);
        log.stepPass('Current date in Calendar format calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate current date in Calendar format');
        throw e;
      }

      // ── Calculate current date in Input format ──────────────────────────
      log.step('Calculating current date in Input format (yyyy-MM-dd)');
      try {
        vars["CurrentDateInput"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "yyyy-MM-dd";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        log.info(` Current Date Input Calculated: ${vars["CurrentDateInput"]}`);
        log.stepPass('Current date in Input format calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate current date in Input format');
        throw e;
      }

      // ── Calculate tomorrow's date in List format ────────────────────────
      log.step('Calculating tomorrow date in List format (yyyy/M/d)');
      try {
        vars["TomorrowDateList"] = (() => {
          const d = new Date(String(vars["CurrentDateList"]));
          d.setDate(d.getDate() + parseInt(String("1")));
          const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
          return "yyyy/M/d".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
        })();
        log.info(`Tomorrow Date List Calculated: ${vars["TomorrowDateList"]}`);
        log.stepPass('Tomorrow date in List format calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate tomorrow date in List format');
        throw e;
      }

      // ── Calculate day after tomorrow's date in List format ──────────────
      log.step('Calculating day after tomorrow date in List format (yyyy/M/d)');
      try {
        vars["DayAfterTomorrowDateList"] = (() => {
          const d = new Date(String(vars["CurrentDateList"]));
          d.setDate(d.getDate() + parseInt(String("2")));
          const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
          return "yyyy/M/d".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
        })();
        log.info(`Day After Tomorrow Date List Calculated: ${vars["DayAfterTomorrowDateList"]}`);
        log.stepPass('Day after tomorrow date in List format calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate day after tomorrow date in List format');
        throw e;
      }

      // ── Calculate tomorrow's date in Calendar format ──────────────────────
      log.step('Calculating tomorrow date in Calendar format (d-M-yyyy)');
      try {
        vars["TomorrowsDateCalender"] = (() => {
          const d = new Date(String(vars["TomorrowDateList"]));
          const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
          return "d-M-yyyy".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
        })();
        log.info(` Tomorrow Date Calendar Calculated: ${vars["TomorrowsDateCalender"]}`);
        log.stepPass('Tomorrow date in Calendar format calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate tomorrow date in Calendar format');
        throw e;
      }

      // ── Calculate day after tomorrow's date in Calendar format ──────────
      log.step('Calculating day after tomorrow date in Calendar format (d-M-yyyy)');
      try {
        vars["DayAfterTomorrowsDateCalender"] = (() => {
          const d = new Date(String(vars["DayAfterTomorrowDateList"]));
          const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
          return "d-M-yyyy".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
        })();
        log.info(` Day After Tomorrow Date Calendar Calculated: ${vars["DayAfterTomorrowsDateCalender"]}`);
        log.stepPass('Day after tomorrow date in Calendar format calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate day after tomorrow date in Calendar format');
        throw e;
      }

      // ── Calculate tomorrow's date in Input format ───────────────────────
      log.step('Calculating tomorrow date in Input format (yyyy-MM-dd)');
      try {
        vars["TomorrowsDateInput"] = (() => {
          const d = new Date(String(vars["CurrentDateInput"]));
          d.setDate(d.getDate() + parseInt(String("1")));
          const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
          return "yyyy-MM-dd".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
        })();
        log.info(` Tomorrow Date Input Calculated: ${vars["TomorrowsDateInput"]}`);
        log.stepPass('Tomorrow date in Input format calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate tomorrow date in Input format');
        throw e;
      }

      // ── Calculate day after tomorrow's date in Input format ──────────────
      log.step('Calculating day after tomorrow date in Input format (yyyy-MM-dd)');
      try {
        vars["DayAfterTomorrowsDateInput"] = (() => {
          const d = new Date(String(vars["CurrentDateInput"]));
          d.setDate(d.getDate() + parseInt(String("2")));
          const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
          return "yyyy-MM-dd".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
        })();
        log.info(` Day After Tomorrow Date Input Calculated: ${vars["DayAfterTomorrowsDateInput"]}`);
        log.stepPass('Day after tomorrow date in Input format calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate day after tomorrow date in Input format');
        throw e;
      }

      // ── Add first configuration (tomorrow date) ──────────────────────────
      log.step('Adding first configuration with tomorrow date');
      try {
        await correspondentPortalPage.Add_New_Config_Button.click();
        log.info('Clicked Add New Config button');
        await correspondentPortalPage.Toggle_Date_Picker_Button.click();
        log.info('Clicked Toggle Date Picker button');
        await earlyConfigPage.Tomorrow_date(vars["TomorrowsDateCalender"]).click();
        log.info(`Selected tomorrow date: ${vars["TomorrowsDateCalender"]}`);
        await expect(correspondentPortalPage.datepicker_Input).toHaveValue(vars["TomorrowsDateInput"]);
        log.info(`Verified datepicker input has value: ${vars["TomorrowsDateInput"]}`);
        log.stepPass('First configuration added with tomorrow date successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add first configuration with date picker');
        throw e;
      }

      // ── Calculate current EST time ────────────────────────────────────
      log.step('Calculating current EST time');
      try {
        vars["CurrentEstTime"] = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }).format(new Date());
        log.info(` Current Estimate Time Calculated: ${vars["CurrentEstTime"]}`);
        log.stepPass('Current EST time calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate current EST time');
        throw e;
      }

      // ── Calculate time 2 hours prior to current EST time ───────────────
      log.step('Calculating time 2 hours prior to current EST time');
      try {
        vars["CurrentEst2hrPrior"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
          d.setMinutes(d.getMinutes() + parseInt(String("120")));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
        })();
        log.info(` Current Estimate Time 2hr Prior Calculated: ${vars["CurrentEst2hrPrior"]}`);
        log.stepPass('Time 2 hours prior calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate time 2 hours prior');
        throw e;
      }

      // ── Extract hour and unit from calculated time ────────────────────
      log.step('Extracting hour and time unit from calculated time');
      try {
        const parts = String(vars["CurrentEst2hrPrior"]).split(" ");
        vars["TimeHourMin"] = parts[0] || '';
        vars["TimeUnit"] = parts[1] || '';
        log.info(`Extracted TimeHourMin: ${vars["TimeHourMin"]}, TimeUnit: ${vars["TimeUnit"]}`);
        log.stepPass('Hour and time unit extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract hour and time unit');
        throw e;
      }

      // ── Fill time input fields for first configuration ────────────────
      log.step('Filling time input fields for first configuration');
      try {
        await earlyConfigPage.Last_Batch_Time_Input_Box.pressSequentially(vars["TimeHourMin"]);
        log.info(`Filled Last Batch Time Input Box with: ${vars["TimeHourMin"]}`);
        if (String(vars["TimeUnit"]).includes(String("AM"))) {
          await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "AM" });
          log.info('Selected AM from time unit dropdown');
        } else {
          await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
          log.info('Selected PM from time unit dropdown');
        }
        log.stepPass('Time input fields filled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to fill time input fields');
        throw e;
      }

      // ── Save first configuration ───────────────────────────────────────
      log.step('Saving first configuration');
      try {
        await correspondentPortalPage.Save_Config_Button.click();
        log.info('Clicked Save Config button');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - first configuration saved');
        log.info(`Tomorrow Date List : ${vars["TomorrowDateList"]}`);
        await expect(earlyConfigPage.Early_Configtomorrows_Date(vars["TomorrowDateList"])).toBeVisible();
        log.info(`Verified first configuration saved with date: ${vars["TomorrowDateList"]}`);
        log.stepPass('First configuration saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save first configuration');
        throw e;
      }

      // ── Add second configuration (day after tomorrow date) ──────────────
      log.step('Adding second configuration with day after tomorrow date');
      try {
        const CorrPortalElem = new CorrPortalPage(page);
        await CorrPortalElem.Add_New_Config_Button.click();
        log.info('Clicked Add New Config button for second configuration');
        await CorrPortalElem.Toggle_Date_Picker_Button.click();
        log.info('Clicked Toggle Date Picker button for second configuration');
        await earlyConfigPage.DayAfterTomorrows_Date_Calender(vars["DayAfterTomorrowsDateCalender"]).click();
        log.info(`Selected day after tomorrow date: ${vars["DayAfterTomorrowsDateCalender"]}`);
        await expect(CorrPortalElem.datepicker_Input.nth(1)).toHaveValue(vars["DayAfterTomorrowsDateInput"]);
        log.info(`Verified datepicker input has value: ${vars["DayAfterTomorrowsDateInput"]}`);
        log.stepPass('Second configuration date selected successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add second configuration with date picker');
        throw e;
      }

      // ── Recalculate current EST time for second configuration ──────────
      log.step('Recalculating current EST time for second configuration');
      try {
        vars["CurrentEstTime"] = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }).format(new Date());
        log.info(` Current Estimate Time Recalculated: ${vars["CurrentEstTime"]}`);
        log.stepPass('Current EST time recalculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to recalculate current EST time');
        throw e;
      }

      // ── Calculate time 2 hours prior for second configuration ───────────
      log.step('Calculating time 2 hours prior for second configuration');
      try {
        vars["CurrentEst2hrPrior"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
          d.setMinutes(d.getMinutes() + parseInt(String("120")));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
        })();
        log.info(` Current Estimate Time 2hr Prior Calculated: ${vars["CurrentEst2hrPrior"]}`);
        log.stepPass('Time 2 hours prior calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate time 2 hours prior');
        throw e;
      }

      // ── Extract hour and unit from recalculated time ──────────────────
      log.step('Extracting hour and time unit from recalculated time');
      try {
        const parts1 = String(vars["CurrentEst2hrPrior"]).split(" ");
        vars["TimeHourMin"] = parts1[0] || '';
        vars["TimeUnit"] = parts1[1] || '';
        log.info(`Extracted updated TimeHourMin: ${vars["TimeHourMin"]}, TimeUnit: ${vars["TimeUnit"]}`);
        log.stepPass('Updated hour and time unit extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract updated hour and time unit');
        throw e;
      }

      // ── Fill time input fields for second configuration ────────────────
      log.step('Filling time input fields for second configuration');
      try {
        const CorrPortalElem = new CorrPortalPage(page);
        await CorrPortalElem.Last_Batch_Time_Input_Box.pressSequentially(vars["TimeHourMin"]);
        log.info(`Filled Last Batch Time Input Box with: ${vars["TimeHourMin"]}`);
        if (String(vars["TimeUnit"]).includes(String("AM"))) {
          await CorrPortalElem.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "AM" });
          log.info('Selected AM from time unit dropdown for second configuration');
        } else {
          await CorrPortalElem.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
          log.info('Selected PM from time unit dropdown for second configuration');
        }
        log.stepPass('Time input fields filled for second configuration successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to fill time input fields for second configuration');
        throw e;
      }

      // ── Save second configuration ──────────────────────────────────────
      log.step('Saving second configuration');
      try {
        const CorrPortalElem = new CorrPortalPage(page);
        await CorrPortalElem.Save_Config_Button.click();
        log.info('Clicked Save Config button for second configuration');
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - second configuration saved');
        await expect(earlyConfigPage.Day_After_Tomorrow_Date_List(vars["DayAfterTomorrowDateList"])).toBeVisible();
        log.info(`Verified second configuration saved with date: ${vars["DayAfterTomorrowDateList"]}`);
        log.stepPass('Second configuration saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save second configuration');
        throw e;
      }

      // ── Click on Current Date filter ────────────────────────────────────
      log.step('Clicking on Current Date filter');
      try {
        await correspondentPortalPage.Current_Date_On_Filters.first().click();
        log.info('Clicked Current Date filter');
        log.stepPass('Current Date filter clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Current Date filter');
        throw e;
      }

      // ── Select date range from current to tomorrow ──────────────────────
      log.step('Selecting date range from current to tomorrow');
      try {
        await earlyConfigPage.Current_Date(vars["CurrentDateCalender"]).dblclick();
        log.info(`Double-clicked current date: ${vars["CurrentDateCalender"]}`);
        await earlyConfigPage.Tomorrow_date(vars["TomorrowsDateCalender"]).hover();
        log.info(`Hovered over tomorrow date: ${vars["TomorrowsDateCalender"]}`);
        await earlyConfigPage.Tomorrow_date(vars["TomorrowsDateCalender"]).click();
        log.info(`Clicked tomorrow date: ${vars["TomorrowsDateCalender"]}`);
        log.stepPass('Date range selection completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to select date range');
        throw e;
      }

      // ── Apply date filter ──────────────────────────────────────────────
      log.step('Applying date filter');
      try {
        await correspondentPortalPage.Apply_Button.click();
        log.info('Clicked Apply button');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - filter applied');
        log.stepPass('Date filter applied successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to apply date filter');
        throw e;
      }

      // ── Verify filtered results ────────────────────────────────────────
      log.step('Verifying filtered results');
      try {
        await expect(earlyConfigPage.Select_Date_Input).not.toHaveValue('');
        log.info('Verified Select Date Input has value');
        await expect(earlyConfigPage.Day_After_Tomorrow_Date_List(vars["DayAfterTomorrowDateList"])).not.toBeVisible();
        log.info(`Verified day after tomorrow date is NOT visible: ${vars["DayAfterTomorrowDateList"]}`);
        vars["TomorrowsDateList"] = vars["TomorrowDateList"];
        await expect(earlyConfigPage.Early_Configtomorrows_Date(vars["TomorrowDateList"])).toBeVisible();
        log.info(`Verified tomorrow date IS visible: ${vars["TomorrowDateList"]}`);
        log.stepPass('Filtered results verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify filtered results');
        throw e;
      }

      // ── Clear date filter ──────────────────────────────────────────────
      log.step('Clearing date filter by clicking cross button');
      try {
        // await correspondentPortalPage.Cross_In_Search_Field.click();
        await CrossbuttonPage.Cross_Button_EarlyConfigSearch.click();

        log.info('Clicked cross button in search field');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - filter cleared');
        log.stepPass('Date filter cleared successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to clear date filter');
        throw e;
      }

      // ── Verify all configurations are visible after clearing filter ─────
      log.step('Verifying all configurations are visible after clearing filter');
      try {
        await expect(earlyConfigPage.Select_Date_Input).toHaveValue('');
        log.info('Verified Select Date Input is empty');
        await expect(earlyConfigPage.Day_After_Tomorrow_Date_List(vars["DayAfterTomorrowDateList"])).toBeVisible();
        log.info(`Verified day after tomorrow date is visible: ${vars["DayAfterTomorrowDateList"]}`);
        await expect(earlyConfigPage.Early_Configtomorrows_Date(vars["TomorrowDateList"])).toBeVisible();
        log.info(`Verified tomorrow date is visible: ${vars["TomorrowsDateList"]}`);
        log.stepPass('All configurations verified as visible after filter cleared');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify configurations after clearing filter');
        throw e;
      }

      // ── Delete all non-today configurations ─────────────────────────────
      log.step('Deleting all non-today configurations');
      try {
        if (await CrossbuttonPage.Cross_Button.isVisible()) {
          await CrossbuttonPage.Cross_Button.click();
        }
        await correspondentPortalPage.Administration_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Early_Close_Config.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        while (await earlyConfigPage.Early_Conf_Del_Button_other_than_today(vars["CurrentDateList"]).first().isVisible()) {
          await earlyConfigPage.Early_Conf_Del_Button_other_than_today(vars["CurrentDateList"]).first().hover();
          log.info('Hovered over delete button');
          // await expect(page.getByText("Delete")).toBeVisible();
          log.info('Delete confirmation text appeared');
          await earlyConfigPage.Early_Conf_Del_Button_other_than_today(vars["CurrentDateList"]).first().click();
          log.info('Clicked delete button');
          await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
          log.info('Clicked Yes to confirm deletion');
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Spinner disappeared - configuration deleted');
        }
        await expect(earlyConfigPage.Early_Conf_Del_Button_other_than_today(vars["CurrentDateList"]).first()).not.toBeVisible();
        log.info('Verified all non-today configurations have been deleted');
        log.stepPass('All non-today configurations deleted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete non-today configurations');
        throw e;
      }
      try {
        
        log.info('Verifying last modified data in the right corner of the screen');
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.stepPass('Last modified data in the right corner of the screen verified successfully');

      }
      catch (e) {
        await log.stepFail(page, 'Failed to verify last modified data in the right corner of the screen');
        throw e;
      }
      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts06_tc03_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });

  test.afterEach(async ({ page }) => {
    if (reg_ts06_tc03_testFailed) {
      log.step('Test failed - performing cleanup if necessary');
      try {
        if (await CrossbuttonPage.Cross_Button.isVisible()) {
          await CrossbuttonPage.Cross_Button.click();
        }
        await correspondentPortalPage.Administration_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Early_Close_Config.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        while (await earlyConfigPage.Early_Conf_Del_Button_other_than_today(vars["CurrentDateList"]).first().isVisible()) {
          await earlyConfigPage.Early_Conf_Del_Button_other_than_today(vars["CurrentDateList"]).first().hover();
          await earlyConfigPage.Early_Conf_Del_Button_other_than_today(vars["CurrentDateList"]).first().click();
          log.info('Clicked delete button during cleanup');
          // await page.getByText("Delete").isVisible();
          await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
          log.info('Clicked Yes to confirm deletion during cleanup');
          await earlyConfigPage.Early_Conf_Del_Button_other_than_today(vars["CurrentDateList"]).first().waitFor({ state: 'hidden' });
          log.info('Configuration deleted during cleanup');
        }
        log.info('Cleanup completed - all non-today configurations removed');
      } catch (e) {
        log.info('No additional configurations found to delete during cleanup');
      }
    }
  });
});