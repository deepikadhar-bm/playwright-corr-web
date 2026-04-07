// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { BidRequestCreationPage } from '../../../src/pages/correspondant/bid-request-creation';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { Logger as log } from '../../../src/helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { ENV } from '../../../src/config/environments';

const TC_ID = 'REG_TS01_TC09';
const TC_TITLE = 'Lock term / Expiration Date scenarios_Verify Bid upload date value should be current date';

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

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {
    const addonHelpers = new AddonHelpers(page, vars);

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login & Navigate to Bid Request Config ─────────────────────────────────
      log.step('Logging in to Correspondent Portal');
      try {
        const credentials = ENV.getCredentials('internal');
              vars["Username"] = credentials.username;
              vars["Password"] = credentials.password;
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Logging in to Correspondent Portal failed');
        throw e;
      }

      log.step('Navigating to Bid Request Config');
      try {
        await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
        await page.getByText("Lock Days :").waitFor({ state: 'visible' });
        log.stepPass('Bid Request Config page loaded');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Bid Request Config failed');
        throw e;
      }

      // ── Delete existing Lock Days records if any ───────────────────────────────
      log.step('Checking for existing Lock Days records and deleting if present');
      try {
        await bidRequestConfigPage.Delete_Lock_Days_Icon_Config.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
        if (await bidRequestConfigPage.Delete_Lock_Days_Icon_Config.first().isVisible()) /* Element Delete Lock Days Icon (Config) is visible */ {
          vars["RecordsCount"] = String(await bidRequestConfigPage.Delete_Lock_Days_Icon_Config.count());
          log.info(`Found ${vars["RecordsCount"]} existing Lock Days record(s) — deleting all`);
          vars["count"] = "1";
          while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["RecordsCount"]))) {
            log.info(`Deleting Lock Days record ${vars["count"]} of ${vars["RecordsCount"]}`);
            await bidRequestConfigPage.Individual_Delete_Icon.click();
            await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
            vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
          }
          await bidRequestConfigPage.Save_Changes_Button.click();
          await page.getByText("Bid Request Config updated successfully").waitFor({ state: 'visible' });
          log.stepPass('All existing Lock Days records deleted and config saved');
        }
      } catch (e) {
        await log.stepFail(page, 'Checking or deleting existing Lock Days records failed');
        throw e;
      }

      // ── Navigate to Upload New Bid Request & verify current date ───────────────
      log.step('Navigating to Upload New Bid Request page');
      try {
        await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        log.stepPass('Upload New Bid Request page loaded');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Upload New Bid Request failed');
        throw e;
      }

      log.step('Computing current date in UTC and verifying Bid Upload Date');
      try {
        vars["CurrentDate"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
          const fmt = "MM/dd/yyyy";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
        })();
        log.info(`Computed CurrentDate (UTC): "${vars["CurrentDate"]}"`);
        await expect(bidRequestCreationPage.Bid_Upload_Date(vars["CurrentDate"])).toContainText(vars["CurrentDate"]);
        log.stepPass(`Bid Upload Date verified as current date: "${vars["CurrentDate"]}"`);
      } catch (e) {
        await log.stepFail(page, 'Computing or verifying Bid Upload Date failed');
        throw e;
      }

      log.step('Verifying Lock Term Days Lock Expiration and Bid Upload Date elements are visible');
      try {
        await expect(bidRequestCreationPage.Lock_Term_Days_Lock_Expiration).not.toBeVisible();
        await expect(bidRequestCreationPage.Bid_Upload_Date(vars["CurrentDate"])).toBeVisible();
        log.stepPass('Lock Term Days is Not Visible and Bid Upload Date is visible');
      } catch (e) {
        await log.stepFail(page, 'Verifying Lock Term Days Lock Expiration and Bid Upload Date visibility failed');
        throw e;
      }

      // ── Add Lock Days 1 and 2 in Config ───────────────────────────────────────
      log.step('Navigating back to Bid Request Config to add Lock Days');
      try {
        await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
        log.stepPass('Bid Request Config page loaded');
      } catch (e) {
        await log.stepFail(page, 'Navigating back to Bid Request Config failed');
        throw e;
      }

      log.step('Adding Lock Day with value 1');
      try {
        await correspondentPortalPage.Add_Lock_Days_Button.click();
        await bidRequestConfigPage.Lock_Days_Input1.waitFor({ state: 'visible' });
        await bidRequestConfigPage.Lock_Days_Input1.pressSequentially("1");
        log.stepPass('Lock Day 1 entered');
      } catch (e) {
        await log.stepFail(page, 'Adding Lock Day with value 1 failed');
        throw e;
      }

      log.step('Adding Lock Day with value 2');
      try {
        await correspondentPortalPage.Add_Lock_Days_Button.click();
        await bidRequestConfigPage.Lock_days_Input2.waitFor({ state: 'visible' });
        await bidRequestConfigPage.Lock_days_Input2.pressSequentially("2");
        log.stepPass('Lock Day 2 entered');
      } catch (e) {
        await log.stepFail(page, 'Adding Lock Day with value 2 failed');
        throw e;
      }

      log.step('Saving Lock Days config');
      try {
        await expect(bidRequestConfigPage.Save_Changes_Button).toBeVisible();
        await bidRequestConfigPage.Save_Changes_Button.click();
        await page.getByText("Bid Request Config updated successfully").waitFor({ state: 'visible' });
        log.stepPass('Lock Days config saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Saving Lock Days config failed');
        throw e;
      }

      // ── Navigate to Upload New Bid Request & verify Lock Term 1 ───────────────
      log.step('Navigating to Upload New Bid Request page to verify Lock Term Days');
      try {
        await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        await stepGroups.stepGroup_Getting_Next_Bussiness_day_by_handling_weekend(page, vars);
        log.info(`Next Business Date computed: "${vars["NextBusinessDate"]}"`);
        log.stepPass('Upload New Bid Request page loaded');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Upload New Bid Request page to verify Lock Term Days failed');
        throw e;
      }

      log.step('Verifying Lock Terms 1 Days label and expiration date');
      try {
        await expect(bidRequestCreationPage.Lock_Term_Days_Text_1).toContainText("Lock Terms 1 Days");
        await expect(bidRequestCreationPage.Lock_term_days_1lock_expiration).toContainText(vars["NextBusinessDate"]);
        log.stepPass(`Lock Terms 1 Days expiration verified as: "${vars["NextBusinessDate"]}"`);
      } catch (e) {
        await log.stepFail(page, 'Verifying Lock Terms 1 Days label or expiration date failed');
        throw e;
      }

      log.step('Verifying if Lock Terms 2 Days label is visible');
      try {
        await expect(bidRequestCreationPage.Lock_Term_Days_text_2).toContainText("Lock Terms 2 Days");
        log.stepPass('Lock Terms 2 Days text label verified');
      } catch (e) {
        await log.stepFail(page, 'Verifying Lock Terms 2 Days label failed');
        throw e;
      }

      // ── Compute BussinessDayAfter2Lockdays based on current day ───────────────
      log.step('Computing current date in EST timezone');
      try {
        vars["CurrentDateEST"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "MM/dd/yyyy";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
        })();
        log.info(`Computed CurrentDateEST: "${vars["CurrentDateEST"]}"`);
        log.stepPass('Current date in EST computed successfully');
      } catch (e) {
        await log.stepFail(page, 'Computing current date in EST failed');
        throw e;
      }

      //vars[""] = new Date(String("CurrentDay")).toLocaleDateString('en-US', { weekday: 'long' });
      log.step(`Determining business day offset for 2 Lock Days based on CurrentDay: "${vars["CurrentDayEST"]}"`);
      try {
        addonHelpers.getDayFromDate(vars["CurrentDateEST"], "MM/dd/yyyy", "CurrentDayEST");
        if (String(vars["CurrentDay"]) === String("Thursday")) {
          log.info('Today is Thursday — adding 4 days to get next business day after 2 lock days');
          vars["BussinessDayAfter2Lockdays"] = (() => {
            const d = new Date(String(vars["CurrentDateEST"]));
            d.setDate(d.getDate() + parseInt(String("4")));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return ("MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h)).trim();
          })();
        } else if (String(vars["CurrentDay"]) === String("Friday")) {
          log.info('Today is Friday — adding 3 days to get next business day after 2 lock days');
          vars["BussinessDayAfter2Lockdays"] = (() => {
            const d = new Date(String(vars["CurrentDateEST"]));
            d.setDate(d.getDate() + parseInt(String("3")));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return ("MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h)).trim();
          })();
        } else if (String(vars["CurrentDay"]) === String("Saturday")) {
          log.info('Today is Saturday — adding 2 days to get next business day after 2 lock days');
          vars["BussinessDayAfter2Lockdays"] = (() => {
            const d = new Date(String(vars["CurrentDateEST"]));
            d.setDate(d.getDate() + parseInt(String("2")));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return ("MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h)).trim();
          })();
        } else if (String(vars["CurrentDay"]) === String("Sunday")) {
          log.info('Today is Sunday — adding 1 day to get next business day after 2 lock days');
          vars["BussinessDayAfter2Lockdays"] = (() => {
            const d = new Date(String(vars["CurrentDateEST"]));
            d.setDate(d.getDate() + parseInt(String("1")));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return ("MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h)).trim();
          })();
        } else {
          log.info(`Today is "${vars["CurrentDayEST"]}" (Mon–Wed) — adding 2 days to get next business day after 2 lock days`);
          vars["BussinessDayAfter2Lockdays"] = (() => {
            const d = new Date(String(vars["CurrentDateEST"]));
            d.setDate(d.getDate() + parseInt(String("2")));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return ("MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h)).trim();
          })();
        }
        log.info(`Computed BussinessDayAfter2Lockdays: "${vars["BussinessDayAfter2Lockdays"]}"`);
        log.stepPass('Business day after 2 lock days computed successfully');
      } catch (e) {
        await log.stepFail(page, 'Determining business day offset for 2 Lock Days failed');
        throw e;
      }

      // ── Verify Lock Term 2 expiration date ─────────────────────────────────────
      log.step('Verifying Lock Terms 2 Days expiration date');
      try {
        await expect(bidRequestCreationPage.Lock_days_2_lock_expiration).toContainText(vars["BussinessDayAfter2Lockdays"]);
        log.stepPass(`Lock Terms 2 Days expiration verified as: "${vars["BussinessDayAfter2Lockdays"]}"`);
      } catch (e) {
        await log.stepFail(page, 'Verifying Lock Terms 2 Days expiration date failed');
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