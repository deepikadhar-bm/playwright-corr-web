// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EarlyConfigPage } from '../../../src/pages/correspondant/early-config';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';

const TC_ID = 'REG_TS06_TC04';
const TC_TITLE = 'Early config - try to add / update the record with the date which already exists and verify that system should not allow the duplicates';
let reg_ts06_tc04_testFailed = false;

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
  });

  test('REG_TS06_TC04_ Early config - try to add / update the record with the date which already exists and verify that system should not allow the duplicates', async ({ page }) => {

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

      // ── Add first configuration with date picker ────────────────────────
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

      // ── Fill time input fields for first config ────────────────────────
      log.step('Filling time input fields for first configuration (11:59 PM)');
      try {
        await earlyConfigPage.Last_Batch_Time_Input_Box.pressSequentially("11:59");
        log.info('Filled Last Batch Time Input Box with: 11:59');
        await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
        log.info('Selected PM from time unit dropdown');
        log.stepPass('Time input fields filled successfully for first configuration');
      } catch (e) {
        await log.stepFail(page, 'Failed to fill time input fields for first configuration');
        throw e;
      }

      // ── Save first configuration ─────────────────────────────────────
      log.step('Saving first configuration');
      try {
        await expect(correspondentPortalPage.Save_Config_Button).toBeEnabled();
        await correspondentPortalPage.Save_Config_Button.click();
        log.info('Clicked Save Config button');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - first configuration saved');
        await expect(earlyConfigPage.Early_Configtomorrows_Date(vars["TomorrowDateList"])).toBeVisible();
        log.info(`Verified first configuration saved with date: ${vars["TomorrowDateList"]}`);
        log.stepPass('First configuration saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save first configuration');
        throw e;
      }

      // ── Add second configuration with duplicate date ────────────────────
      log.step('Adding second configuration with same date (duplicate)');
      try {
        await correspondentPortalPage.Add_New_Config_Button.click();
        log.info('Clicked Add New Config button for second configuration');
        await correspondentPortalPage.Toggle_Date_Picker_Button.click();
        log.info('Clicked Toggle Date Picker button');
        await earlyConfigPage.Tomorrow_date(vars["TomorrowsDateCalender"]).click();
        log.info(`Selected same tomorrow date: ${vars["TomorrowsDateCalender"]}`);
        await expect(correspondentPortalPage.datepicker_Input).toHaveValue(vars["TomorrowsDateInput"]);
        log.info(`Verified datepicker input has value: ${vars["TomorrowsDateInput"]}`);
        log.stepPass('Second configuration added with duplicate date');
      } catch (e) {
        await log.stepFail(page, 'Failed to add second configuration with duplicate date');
        throw e;
      }

      // ── Fill time input fields for second config ────────────────────────
      log.step('Filling time input fields for second configuration (11:59 PM)');
      try {
        await earlyConfigPage.Last_Batch_Time_Input_Box.pressSequentially("11:59");
        log.info('Filled Last Batch Time Input Box with: 11:59');
        await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
        log.info('Selected PM from time unit dropdown');
        log.stepPass('Time input fields filled successfully for second configuration');
      } catch (e) {
        await log.stepFail(page, 'Failed to fill time input fields for second configuration');
        throw e;
      }

      // ── Attempt to save duplicate configuration ───────────────────────
      log.step('Attempting to save duplicate configuration');
      try {
        await expect(correspondentPortalPage.Save_Config_Button).toBeEnabled();
        await correspondentPortalPage.Save_Config_Button.click();
        log.info('Clicked Save Config button');
        log.stepPass('Save Config button clicked for duplicate configuration');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Save Config button for duplicate configuration');
        throw e;
      }

      // ── Build error message for validation ────────────────────────────
      log.step('Building and verifying error message for duplicate date');
      try {
        vars["Msg1"] = "Early close day for";
        log.info(`Message part 1 set: ${vars["Msg1"]}`);
        vars["Msg2"] = String(vars["TomorrowsDateInput"]) + ' ' + String("is already present");
        log.info(`Message part 2 set: ${vars["Msg2"]}`);
        vars["ErrorMsg"] = String(vars["Msg1"]) + ' ' + String(vars["Msg2"]);
        log.info(` Expected error message: ${vars["ErrorMsg"]}`);
        log.stepPass('Error message constructed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to construct error message');
        throw e;
      }

      // ── Verify duplicate date validation error ───────────────────────
      log.step('Verifying system displays duplicate date validation error');
      try {
        await page.getByText(vars["ErrorMsg"]).waitFor({ state: 'visible' });
        log.info(`Error message verified on page: ${vars["ErrorMsg"]}`);
        log.stepPass('Duplicate date validation error displayed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify duplicate date validation error');
        throw e;
      }

      // ── Close error popup ──────────────────────────────────────────────
      log.step('Closing error popup');
      try {
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        log.info('Clicked popup close button');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared after closing popup');
        log.stepPass('Error popup closed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to close error popup');
        throw e;
      }

      // ── Delete the configuration ───────────────────────────────────────
      log.step('Deleting Early Close Configuration');
      try {
        vars["TomorrowsDate"] = vars["TomorrowDateList"];
        log.info(`Target date for deletion: ${vars["TomorrowsDate"]}`);
        await earlyConfigPage.Delete_Button_Early_ConfigNext_Day(vars["TomorrowsDate"]).hover();
        log.info(`Hovered over delete button for date: ${vars["TomorrowsDate"]}`);
        await expect(page.getByText("Delete")).toBeVisible();
        log.info('Delete confirmation text appeared');
        await earlyConfigPage.Delete_Button_Early_ConfigNext_Day(vars["TomorrowsDate"]).click();
        log.info('Clicked delete button');
        await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
        log.info('Clicked Yes to confirm deletion');
        await earlyConfigPage.Delete_Button_Early_ConfigNext_Day(vars["TomorrowsDate"]).waitFor({ state: 'hidden' });
        log.info(`Configuration deleted: ${vars["TomorrowsDate"]}`);
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
          const fmt = "MM/d/yyyy : h:mm a";
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
      reg_ts06_tc04_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });

 test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, reg_ts06_tc04_testFailed);
    if (reg_ts06_tc04_testFailed) {
      vars["TomorrowsDate"] = vars["TomorrowDateList"];
      try {
        if (await earlyConfigPage.Delete_Button_Early_ConfigNext_Day(vars["TomorrowsDate"]).isVisible()) {
          await earlyConfigPage.Delete_Button_Early_ConfigNext_Day(vars["TomorrowsDate"]).hover();
          log.info(`Attempting to delete configuration for cleanup: ${vars["TomorrowsDate"]}`);
          await earlyConfigPage.Delete_Button_Early_ConfigNext_Day(vars["TomorrowsDate"]).click();
          log.info('Clicked delete button during cleanup');
          await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
          log.info('Clicked Yes to confirm deletion during cleanup');
          await earlyConfigPage.Delete_Button_Early_ConfigNext_Day(vars["TomorrowsDate"]).waitFor({ state: 'hidden' });
          log.info(`Configuration deleted during cleanup: ${vars["TomorrowsDate"]}`);
          log.stepPass('Cleanup deletion completed successfully');
        }
        else{
          log.info(`Configuration for cleanup deletion not found for the date ${vars["TomorrowsDate"]}, skipping deletion`);

        }
      } catch (e) {
        log.info('Could not perform cleanup deletion');
        log.info('Cleanup deletion was not needed or already removed');
      }

    }
  });
});