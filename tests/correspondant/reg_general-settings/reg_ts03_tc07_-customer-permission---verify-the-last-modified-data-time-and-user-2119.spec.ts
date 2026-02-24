// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { runPrereq_2103 } from '../../../src/helpers/prereqs/prereq-2103';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let customerPermissionPage: CustomerPermissionPage;
  let generalSettingPage: GeneralSettingPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2103(page, vars);
    customerPermissionPage = new CustomerPermissionPage(page);
    generalSettingPage = new GeneralSettingPage(page);
  });

  test('REG_TS03_TC07_ Customer Permission - Verify the Last Modified Data, Time and User get displayed in the Right Corner of the Page.', async ({ page }) => {

    await expect(generalSettingPage.Last_Modified_DataRight_Corner_Screen).toContainText("test sigma");
    vars["CurrentLocalTimeList"] = (() => {
      const d = new Date(String(vars["CurrentLocalTime"]));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "M/d/yy h:mm a".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
    // [DISABLED] Pick the current date MM/d/yyyy h:mm a by location UTC and store into a variable CurrentLocalTimeList
    // vars["CurrentLocalTimeList"] = (() => {
    //   const d = new Date();
    //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    //   const fmt = "MM/d/yyyy h:mm a";
    //   // Map Java date format to Intl parts
    //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    // })();
    await expect(customerPermissionPage.Last_Modified_Data_List).toContainText(vars["CurrentLocalTimeList"]);
    await expect(customerPermissionPage.Modified_by_DataList).toContainText("testsigma_internal");
  });
});
