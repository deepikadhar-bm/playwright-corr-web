// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EarlyConfigPage } from '../../../src/pages/correspondant/early-config';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

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

  test('REG_TS06_TC04_ Early config - try to add / update the record with the date which already existis and verify that system should not allow the duplicates', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Early_Close_Config.click();
    vars["CurrentDateList"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "yyyy/M/d";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["CurrentDateCalender"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "d-M-yyyy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["CurrentDateInput"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "yyyy-MM-dd";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["TomorrowDateList"] = (() => {
      const d = new Date(String(vars["CurrentDateList"]));
      d.setDate(d.getDate() + parseInt(String("1")));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "yyyy/M/d".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
    vars["TomorrowsDateCalender"] = (() => {
      const d = new Date(String(vars["TomorrowDateList"]));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "d-M-yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
    // [DISABLED] Convert the date from the TomorrowDateList in d-M-yyyy to yyyy-MM-dd and store it in a runtime TomorrowDateInput
    // vars["TomorrowDateInput"] = (() => {
    //   const d = new Date(String(vars["TomorrowDateList"]));
    //   const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
    //   return "yyyy-MM-dd".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    // })();
    vars["TomorrowsDateInput"] = (() => {
      const d = new Date(String(vars["CurrentDateInput"]));
      d.setDate(d.getDate() + parseInt(String("1")));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "yyyy-MM-dd".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
    await correspondentPortalPage.Add_New_Config_Button.click();
    await correspondentPortalPage.Toggle_Date_Picker_Button.click();
    await earlyConfigPage.Tomorrow_date.click();
    await expect(correspondentPortalPage.datepicker_Input).toHaveValue(vars["TomorrowsDateInput"]);
    // [DISABLED] Pick the current date hh:mm a by location UTC-05:00 and store into a variable CurrentEstTime
    // vars["CurrentEstTime"] = (() => {
    //   const d = new Date();
    //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    //   const fmt = "hh:mm a";
    //   // Map Java date format to Intl parts
    //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    // })();
    // [DISABLED] Add 120 minutes to the CurrentEstTime with hh:mm a , convert to hh:mm a format, and store it in a runtime variable CurrentEst2hrPrior
    // vars["CurrentEst2hrPrior"] = (() => {
    //   const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
    //   d.setMinutes(d.getMinutes() + parseInt(String("120")));
    //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
    // })();
    // [DISABLED] Add 2 and 0 to date CurrentEstTime and format hh:mm a and store CurrentEst2hrPrior
    // vars[""] = (() => {
    //   const d = new Date(String(''));
    //   d.setMinutes(d.getMinutes() + parseInt(String('')));
    //   return d.toLocaleString('en-US');
    // })();
    // [DISABLED] Split string CurrentEst2hrPrior using space and store the 0 into a TimeHourMin
    // vars["TimeHourMin"] = String('').split("")["0"] || '';
    // [DISABLED] Split string CurrentEst2hrPrior using space and store the 1 into a TimeUnit
    // vars["TimeUnit"] = String('').split("")["1"] || '';
    await earlyConfigPage.Last_Batch_Time_Input_Box.fill("11:59");
    await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
    if (true) /* Verify if TimeUnit contains AM */ {
      // [DISABLED] Select option using value AM in the Last Batch Time Unit Dropdown list
      // await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "AM" });
    } else {
      // [DISABLED] Select option using value PM in the Default dropdown selection Dropdown2 list
      // await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
    }
    await correspondentPortalPage.Save_Config_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(earlyConfigPage.Early_Configtomorrows_Date).toBeVisible();
    // [DISABLED] Pick the current date hh:mm a by location UTC-05:00 and store into a variable CurrentEstTime
    // vars["CurrentEstTime"] = (() => {
    //   const d = new Date();
    //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    //   const fmt = "hh:mm a";
    //   // Map Java date format to Intl parts
    //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    // })();
    // [DISABLED] Add 180 minutes to the CurrentEstTime with hh:mm a , convert to hh:mm a format, and store it in a runtime variable CurrentEst2hrPrior
    // vars["CurrentEst2hrPrior"] = (() => {
    //   const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
    //   d.setMinutes(d.getMinutes() + parseInt(String("180")));
    //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
    // })();
    // [DISABLED] Add 3 and 0 to date CurrentEstTime and format hh:mm a and store CurrentEst2hrPrior
    // vars[""] = (() => {
    //   const d = new Date(String(''));
    //   d.setMinutes(d.getMinutes() + parseInt(String('')));
    //   return d.toLocaleString('en-US');
    // })();
    // [DISABLED] Split string CurrentEst2hrPrior using space and store the 0 into a TimeHourMin
    // vars["TimeHourMin"] = String('').split("")["0"] || '';
    // [DISABLED] Split string CurrentEst2hrPrior using space and store the 1 into a TimeUnit
    // vars["TimeUnit"] = String('').split("")["1"] || '';
    await correspondentPortalPage.Add_New_Config_Button.click();
    await correspondentPortalPage.Toggle_Date_Picker_Button.click();
    await earlyConfigPage.Tomorrow_date.click();
    await expect(correspondentPortalPage.datepicker_Input).toHaveValue(vars["TomorrowsDateInput"]);
    // [DISABLED] Clear the text displayed in the Last Batch Time Input Box field
    // await earlyConfigPage.Last_Batch_Time_Input_Box.clear();
    await earlyConfigPage.Last_Batch_Time_Input_Box.fill("11:59");
    await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
    if (true) /* Verify if TimeUnit contains AM */ {
      // [DISABLED] Select option using value AM in the Last Batch Time Unit Dropdown list
      // await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "AM" });
    } else {
    }
    await correspondentPortalPage.Save_Config_Button.click();
    vars["Msg1"] = "Early close day for";
    vars[""] = String(vars["TomorrowsDateInput"]) + ' ' + String("is already present");
    // [DISABLED] concate Msg1 and Msg2 and store the new string into a ErrorMsg
    // vars["Msg2"] = String('') + String('');
    vars[""] = String(vars["Msg1"]) + ' ' + String(vars["Msg2"]);
    await page.getByText(vars["ErrorMsg"]).waitFor({ state: 'visible' });
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Verify that the current page displays text EditedTime
    // await expect(page.getByText(vars["EditedTime"])).toBeVisible();
    // [DISABLED] Deleting Early Config Report If Present
    // await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    // [DISABLED] Replace an - with / in TomorrowsDateInput and store in TomorrowsDate
    // vars[""] = String(vars["TomorrowsDateInput"]).replace(/TomorrowsDateInput/g, "");
    vars["TomorrowsDate"] = vars["TomorrowDateList"];
    await earlyConfigPage.Delete_Button_Early_ConfigNext_Day.hover();
    await expect(page.getByText("Delete")).toBeVisible();
    await earlyConfigPage.Delete_Button_Early_ConfigNext_Day.click();
    await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
    await earlyConfigPage.Delete_Button_Early_ConfigNext_Day.waitFor({ state: 'hidden' });
    vars["ExpectedModifiedTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "MM/d/yyyy : h:mm a";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
  });
});
