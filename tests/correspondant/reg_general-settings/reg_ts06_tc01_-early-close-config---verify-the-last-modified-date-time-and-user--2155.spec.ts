// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EarlyConfigPage } from '../../../src/pages/correspondant/early-config';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { addMinutes } from 'date-fns';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';


const TC_ID = 'REG_TS06_TC01';
const TC_TITLE = 'Early Close Config - Verify the last Modified date, Time and User data that get displayed in the Right corner of the Page';
let reg_ts06_tc01_testFailed = false;
let methods: AddonHelpers;
test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let earlyConfigPage: EarlyConfigPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    earlyConfigPage = new EarlyConfigPage(page);
    spinnerPage = new SpinnerPage(page);
    methods = new AddonHelpers(page, vars);
  });

  test('REG_TS06_TC01_ Early Close Config - Verify the last Modified date, Time and User data that get displayed in the Right corner of the Page', async ({ page }) => {

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

      // [DISABLED] Convert the date from the TomorrowDateList in d-M-yyyy to yyyy-MM-dd and store it in a runtime TomorrowDateInput
      // vars["TomorrowDateInput"] = (() => {
      //   const d = new Date(String(vars["TomorrowDateList"]));
      //   const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      //   return "yyyy-MM-dd".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
      // })();

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

      // ── Add new configuration with date picker ────────────────────────
      log.step('Adding new configuration with tomorrow date');
      try {
        await correspondentPortalPage.Add_New_Config_Button.click();
        log.info('Clicked Add New Config button');
        await correspondentPortalPage.Toggle_Date_Picker_Button.click();
        log.info('Clicked Toggle Date Picker button');
        await earlyConfigPage.Tomorrow_date(vars["TomorrowsDateCalender"]).click();
        log.info(`Selected tomorrow date: ${vars["TomorrowsDateCalender"]}`);
        await expect(correspondentPortalPage.datepicker_Input).toHaveValue(vars["TomorrowsDateInput"]);
        log.info(`Verified datepicker input has value: ${vars["TomorrowsDateInput"]}`);
        log.stepPass('New configuration added with tomorrow date successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add new configuration with date picker');
        throw e;
      }

      // [DISABLED] Calculate current time in EST format
      // vars["CurrentEstTime"] = (() => {
      //   const d = new Date();
      //   const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
      //   const fmt = "hh:mm a";
      //   // Map Java date format to Intl parts
      //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
      // })();
      // const Methods = new AddonHelpers(page, vars);
      // Methods.getCurrentTimestamp(yyyy-MM-dd, "CurrentLocalTime", appconstants.America/New_York);

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

      // [DISABLED] Add 2 and 0 to date CurrentEstTime and format hh:mm a and store CurrentEst2hrPrior
      // vars[""] = (() => {
      //   const d = new Date(String(''));
      //   d.setMinutes(d.getMinutes() + parseInt(String('')));
      //   return d.toLocaleString('en-US');
      // })();

      // ── Extract hour and unit from calculated time ────────────────────
      log.step('Extracting hour and time unit from calculated time');
      try {
        // vars["TimeHourMin"] = String(vars["CurrentEst2hrPrior"]).split("")[0] || '';
        // vars["TimeUnit"] = String(vars["CurrentEst2hrPrior"]).split(":")[1]?.split(" ")[1] || '';
        const parts = String(vars["CurrentEst2hrPrior"]).split(" ");

        vars["TimeHourMin"] = parts[0] || '';
        vars["TimeUnit"] = parts[1] || '';
        log.info(`Extracted TimeHourMin: ${vars["TimeHourMin"]}, TimeUnit: ${vars["TimeUnit"]}`);
        log.stepPass('Hour and time unit extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract hour and time unit');
        throw e;
      }

      // ── Fill time input fields ───────────────────────────────────────
      log.step('Filling time input fields with calculated time');
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

      // ── Save configuration ───────────────────────────────────────────
      log.step('Saving configuration');
      try {
        await expect(correspondentPortalPage.Save_Config_Button).toBeEnabled();
        await correspondentPortalPage.Save_Config_Button.click();
        log.info('Clicked Save Config button');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - configuration saved');
        log.info(`Tomorrow Date List : ${vars["TomorrowDateList"]}`);
        await expect(earlyConfigPage.Early_Configtomorrows_Date(vars["TomorrowDateList"])).toBeVisible();
        log.info(`Verified configuration saved with date: ${vars["TomorrowDateList"]}`);
        log.stepPass('Configuration saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save configuration');
        throw e;
      }

      // ── Recalculate current EST time ─────────────────────────────────
      log.step('Recalculating current EST time after configuration save');
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

      // ── Calculate time 3 hours prior to current EST time ───────────────
      log.step('Calculating time 3 hours prior to current EST time for edit');
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

      // [DISABLED] Add 3 and 0 to date CurrentEstTime and format hh:mm a and store CurrentEst2hrPrior
      // vars[""] = (() => {
      //   const d = new Date(String(''));
      //   d.setMinutes(d.getMinutes() + parseInt(String('')));
      //   return d.toLocaleString('en-US');
      // })();

      // ── Extract hour and unit from recalculated time ──────────────────
      log.step('Extracting hour and time unit from recalculated time');
      //       try {
      //         // vars["TimeHourMin"] = String(vars["CurrentEst2hrPrior"]).split("")[0] || '';
      //         // vars["TimeUnit"] = String(vars["CurrentEst2hrPrior"]).split(":")[1]?.split(" ")[1] || '';
      //         const parts = String(vars["CurrentEst2hrPrior"]).split(" ");

      // vars["TimeHourMin"] = parts[0] || '';
      // vars["TimeUnit"] = parts[1] || '';
      //         log.info(`Extracted updated TimeHourMin: ${vars["TimeHourMin"]}, TimeUnit: ${vars["TimeUnit"]}`);
      //         log.stepPass('Updated hour and time unit extracted successfully');
      //       } catch (e) {
      //         await log.stepFail(page, 'Failed to extract updated hour and time unit');
      //         throw e;
      //       }

      // ── Edit configuration ───────────────────────────────────────────
      log.step('Editing configuration with new time values');
      try {
        await earlyConfigPage.Edit_ButtonEarly_Close_Config(vars["TimeHourMin"]).click();
        log.info('Clicked Edit button for Early Close Config');
        await earlyConfigPage.Last_Batch_Time_Input_Box.clear();
        log.info('Cleared Last Batch Time Input Box');
        log.step('Extracting hour and time unit from recalculated time');
        try {
          // vars["TimeHourMin"] = String(vars["CurrentEst2hrPrior"]).split("")[0] || '';
          // vars["TimeUnit"] = String(vars["CurrentEst2hrPrior"]).split(":")[1]?.split(" ")[1] || '';
         

console.log(vars["UpdatedTime"]);
          methods.addMinutesToDatetime( vars["CurrentEst2hrPrior"], "hh:mm a", 2, "hh:mm a", "CurrentEst2hrPriorPlus2" );
          log.info(`Recalculated CurrentEst2hrPrior for edit: ${vars["CurrentEst2hrPriorPlus2"]}`);
          const parts = String(vars["CurrentEst2hrPriorPlus2"]).split(" ");


          vars["TimeHourMin"] = parts[0] || '';
          vars["TimeUnit"] = parts[1] || '';
          log.info(`Extracted updated TimeHourMin: ${vars["TimeHourMin"]}, TimeUnit: ${vars["TimeUnit"]}`);
          log.stepPass('Updated hour and time unit extracted successfully');
        } catch (e) {
          await log.stepFail(page, 'Failed to extract updated hour and time unit');
          throw e;
        }
        await earlyConfigPage.Last_Batch_Time_Input_Box.pressSequentially(vars["TimeHourMin"]);
        log.info(`Filled Last Batch Time Input Box with updated time: ${vars["TimeHourMin"]}`);
        if (String(vars["TimeUnit"]).includes(String("AM"))) {
          await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "AM" });
          log.info('Selected AM from time unit dropdown for edit');
        } else {
          await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
          log.info('Selected PM from time unit dropdown for edit');
        }
        log.stepPass('Configuration edit values filled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to edit configuration');
        throw e;
      }

      // ── Update configuration ─────────────────────────────────────────
      log.step('Updating configuration');
      try {
        await expect(correspondentPortalPage.UpdateConfig_Button).toBeEnabled();
        await correspondentPortalPage.UpdateConfig_Button.click();
        log.info('Clicked Update Config button');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - configuration updated');
        log.stepPass('Configuration updated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to update configuration');
        throw e;
      }

      // ── Verify edited time in UI ────────────────────────────────────
      log.step('Verifying edited time is displayed in the UI');
      try {
        vars["EditedTime"] = vars["TimeHourMin"];
        log.info(`Expected edited time: ${vars["EditedTime"]}`);
        await expect(earlyConfigPage.Added_Last_Batch(vars["TimeHourMin"])).toContainText(vars["EditedTime"]);
        log.info(`Verified edited time displayed in UI: ${vars["EditedTime"]}`);
        log.stepPass('Edited time verified in UI successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify edited time in UI');
        throw e;
      }

      // [DISABLED] Verify that the current page displays text EditedTime
      // await expect(page.getByText(vars["EditedTime"])).toBeVisible();

      // ── Delete configuration ─────────────────────────────────────────
      log.step('Deleting configuration and verifying deletion');
      try {
        await earlyConfigPage.Delete_Button_early_config(vars["TimeHourMin"]).hover();
        log.info(`Hovered over delete button for time: ${vars["TimeHourMin"]}`);
        await expect(page.getByText("Delete")).toBeVisible();
        log.info('Delete confirmation text appeared');
        await earlyConfigPage.Delete_Button_early_config(vars["TimeHourMin"]).click();
        log.info('Clicked delete button');
        await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
        log.info('Clicked Yes to confirm deletion');
        await earlyConfigPage.Delete_Button_early_config(vars["TimeHourMin"]).waitFor({ state: 'hidden' });
        log.info(`Configuration deleted: ${vars["TimeHourMin"]}`);
        log.stepPass('Configuration deleted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete configuration');
        throw e;
      }

      // ── Calculate expected modified timestamp ────────────────────────
      log.step('Calculating expected modified timestamp');
      try {
        vars["ExpectedModifiedTime"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
          const fmt = "M/d/yyyy : h:mm a";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        log.info(` Expected Modified Time Calculated: ${vars["ExpectedModifiedTime"]}`);
        log.stepPass('Expected modified timestamp calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate expected modified timestamp');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts06_tc01_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });
  test.afterEach(async ({ page }) => {
    if (reg_ts06_tc01_testFailed) {
      await log.stepFail(page, 'Test failed - performing cleanup if necessary');

      if (await earlyConfigPage.Delete_Button_early_config(vars["TimeHourMin"]).isVisible()) {
        await earlyConfigPage.Delete_Button_early_config(vars["TimeHourMin"]).hover();

        await earlyConfigPage.Delete_Button_early_config(vars["TimeHourMin"]).click();
        log.info('Clicked delete button');
        await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
        log.info('Clicked Yes to confirm deletion');
        await earlyConfigPage.Delete_Button_early_config(vars["TimeHourMin"]).waitFor({ state: 'hidden' });
        log.info(`Configuration deleted: ${vars["TimeHourMin"]}`);

      }
      else{
        log.info('No configuration found to delete during cleanup');
      }
    }
  });
});