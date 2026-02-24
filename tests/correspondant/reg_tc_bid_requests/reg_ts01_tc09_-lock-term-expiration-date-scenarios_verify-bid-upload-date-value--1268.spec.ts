// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { BidRequestCreationPage } from '../../../src/pages/correspondant/bid-request-creation';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let bidRequestCreationPage: BidRequestCreationPage;
  let correspondentPortalPage: CorrespondentPortalPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
    bidRequestCreationPage = new BidRequestCreationPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
  });

  test('REG_TS01_TC09_ Lock term / Expiration Date scenarios_Verify Bid upload date value should be current date', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
    await page.getByText("Lock Days").waitFor({ state: 'visible' });
    if (true) /* Element Delete Lock Days Icon (Config) is visible */ {
      vars["RecordsCount"] = String(await bidRequestConfigPage.Delete_Lock_Days_Icon_Config.count());
      vars["count"] = "1";
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["RecordsCount"]))) {
        await bidRequestConfigPage.Individual_Delete_Icon.click();
        await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
        vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
      }
      await bidRequestConfigPage.Save_Changes_Button.click();
      await page.getByText("Bid Request Config updated successfully").waitFor({ state: 'visible' });
    }
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    vars["CurrentDate"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "MM/dd/yyyy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    await expect(bidRequestCreationPage.Bid_Upload_Date).toContainText(vars["CurrentDate"]);
    await expect(bidRequestCreationPage.Lock_Term_Days_Lock_Expiration).toBeVisible();
    await expect(bidRequestCreationPage.Bid_Upload_Date).toBeVisible();
    await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
    await correspondentPortalPage.Add_Lock_Days_Button.click();
    await bidRequestConfigPage.Lock_Days_Input1.waitFor({ state: 'visible' });
    await bidRequestConfigPage.Lock_Days_Input1.fill("1");
    await correspondentPortalPage.Add_Lock_Days_Button.click();
    await bidRequestConfigPage.Lock_days_Input2.waitFor({ state: 'visible' });
    await bidRequestConfigPage.Lock_days_Input2.fill("2");
    await expect(bidRequestConfigPage.Save_Changes_Button).toBeVisible();
    await bidRequestConfigPage.Save_Changes_Button.click();
    await page.getByText("Bid Request Config updated successfully").waitFor({ state: 'visible' });
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Getting_Next_Bussiness_day_by_handling_weekend(page, vars);
    await expect(bidRequestCreationPage.Lock_Term_Days_Text_1).toContainText("Lock Terms 1 Days");
    await expect(bidRequestCreationPage.Lock_term_days_1lock_expiration).toContainText(vars["NextBusinessDate"]);
    await expect(bidRequestCreationPage.Lock_Term_Days_text_2).toContainText("Lock Terms 2 Days");
    vars["CurrentDateEST"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "MM/dd/yyyy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars[""] = new Date(String("CurrentDay")).toLocaleDateString('en-US', { weekday: 'long' });
    if (String(vars["CurrentDay"]) === String("Thursday")) {
      vars["BussinessDayAfter2Lockdays"] = (() => {
        const d = new Date(String(vars["CurrentDateEST"]));
        d.setDate(d.getDate() + parseInt(String("4")));
        const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
        return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
      })();
    } else if (String(vars["CurrentDay"]) === String("Friday")) {
      vars["BussinessDayAfter2Lockdays"] = (() => {
        const d = new Date(String(vars["CurrentDateEST"]));
        d.setDate(d.getDate() + parseInt(String("3")));
        const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
        return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
      })();
    } else if (String(vars["CurrentDay"]) === String("Saturday")) {
      vars["BussinessDayAfter2Lockdays"] = (() => {
        const d = new Date(String(vars["CurrentDateEST"]));
        d.setDate(d.getDate() + parseInt(String("2")));
        const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
        return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
      })();
    } else if (String(vars["CurrentDay"]) === String("Sunday")) {
      vars["BussinessDayAfter2Lockdays"] = (() => {
        const d = new Date(String(vars["CurrentDateEST"]));
        d.setDate(d.getDate() + parseInt(String("1")));
        const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
        return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
      })();
    } else {
      vars["BussinessDayAfter2Lockdays"] = (() => {
        const d = new Date(String(vars["CurrentDateEST"]));
        d.setDate(d.getDate() + parseInt(String("2")));
        const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
        return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
      })();
    }
    await expect(bidRequestCreationPage.Lock_days_2_lock_expiration).toContainText(vars["BussinessDayAfter2Lockdays"]);
  });
});
