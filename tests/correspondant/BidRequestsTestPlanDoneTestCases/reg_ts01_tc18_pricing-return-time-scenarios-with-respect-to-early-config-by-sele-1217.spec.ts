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
  let reg_ts01_tc18_testFailed = false;
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
  const TC_ID = 'REG_TS01_TC18';
  const TC_TITLE = 'Pricing return time scenarios with respect to early config By Selecting Tomorrow\'s Date and verifying the last batch time is not present in bid requests';
  test('REG_TS01_TC18_Pricing return time scenarios with respect to early config By Selecting Tomorrow\'s Date and verifying the last batch time is not present in bid requests)', async ({ page }) => {



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

      // ── Step 2: Login & Navigate ─────────────────────────────────────────
      log.step('Login and navigation to Correspondent Portal and Bulk Batch Timing');
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

      // ── Step 3: Modify Batch Timing for Next Business Day ────────────────
      log.step('Modifying batch intervals for next business day');
      try {
        await stepGroups.stepGroup_Modifying_Batch_Intervals_For_next_bussiness_day(page, vars);

        vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
        log.info(`BufferTime captured: ${vars["BufferTime"]}`);

        vars["ThirdBatchTimeFromLast"] = await bidRequestPage.Third_Batch_From_the_Last.textContent() || '';
        log.info(`ThirdBatchTimeFromLast: ${vars["ThirdBatchTimeFromLast"]}`);

        vars["BufferedThirdBatchTimeFromLast"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["ThirdBatchTimeFromLast"]));
          d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        })();
        log.info(`BufferedThirdBatchTimeFromLast: ${vars["BufferedThirdBatchTimeFromLast"]}`);

        vars["LastBeforeBatchTime"] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
        log.info(`LastBeforeBatchTime: ${vars["LastBeforeBatchTime"]}`);

        vars["BufferedLastBeforeBatchTime"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["LastBeforeBatchTime"]));
          d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        })();
        log.info(`BufferedLastBeforeBatchTime: ${vars["BufferedLastBeforeBatchTime"]}`);

        vars["LastBatchTime"] = await chaseFieldNamePage.Last_batch_Timebulk_batch_screen.textContent() || '';
        log.info(`LastBatchTime: ${vars["LastBatchTime"]}`);

        vars["BufferedLastBatchTime"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["LastBatchTime"]));
          d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        })();
        log.info(`BufferedLastBatchTime: ${vars["BufferedLastBatchTime"]}`);

        vars["LastBatchTimeToEnterInConfig"] = String(vars["ThirdBatchTimeFromLast"]).substring(0, String(vars["ThirdBatchTimeFromLast"]).length - 3);
        log.info(`LastBatchTimeToEnterInConfig: ${vars["LastBatchTimeToEnterInConfig"]}`);
        vars["RequiredBatchTime"] = vars["BufferedThirdBatchTimeFromLast"];
        await stepGroups.stepGroup_Separating_Hours_and_Minutes(page, vars);

        log.stepPass('Batch intervals modified and time variables computed successfully');
      } catch (e) {
        await log.stepFail(page, 'Batch interval modification failed');
        throw e;
      }

      // ── Step 4: Compute Date Variables ───────────────────────────────────
      log.step('Computing current and next business date variables');
      try {
        vars["CurrentDateList"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "yyyy/M/dd";
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        log.info(`CurrentDateList: ${vars["CurrentDateList"]}`);

        vars["CurrentDateCalender"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "dd-M-yyyy";
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        log.info(`CurrentDateCalender: ${vars["CurrentDateCalender"]}`);

        vars["CurrentDateInput"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "yyyy-MM-dd";
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        log.info(`CurrentDateInput: ${vars["CurrentDateInput"]}`);

        vars["TomorrowsDateCalender1"] = (() => {
          //const d = new Date(String(vars["CurrentDateCalender"]));
          const [day, month, year] = String(vars["CurrentDateCalender"]).split("-");
          const d = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
          );
          d.setDate(d.getDate() + parseInt(String("1")));
          const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
          return "d-M-yyyy".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
        })();
        log.info(`TomorrowsDateCalender1: ${vars["TomorrowsDateCalender1"]}`);

        vars["TomorrowsDateCalender2"] = (() => {
          // const d = new Date(String(vars["CurrentDateCalender"]));
          const [day, month, year] = String(vars["CurrentDateCalender"]).split("-");
          const d = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
          );
          d.setDate(d.getDate() + parseInt(String("1")));
          const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
          return "dd-M-yyyy".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
        })();
        log.info(`TomorrowsDateCalender2: ${vars["TomorrowsDateCalender2"]}`);

        vars[""] = new Date(String("TomorrowsDay")).toLocaleDateString('en-US', { weekday: 'long' });
        log.info(`TomorrowsDay: ${vars["TomorrowsDay"]}`);

        log.stepPass('Date variables computed successfully');
      } catch (e) {
        await log.stepFail(page, 'Date variable computation failed');
        throw e;
      }

      // ── Step 5: Resolve Next Business Date Based on Day of Week ──────────
      log.step(`Resolving next business date (TomorrowsDay: ${vars["TomorrowsDay"]})`);
      try {
        if (String(vars["TomorrowsDay"]) === String("Saturday")) {
          log.info('Tomorrow is Saturday — skipping to Monday (+2 days)');

          vars["NextBusinessDateCalender1"] = (() => {
            const d = new Date(String(vars["TomorrowsDateCalender1"]));
            d.setDate(d.getDate() + parseInt(String("2")));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "d-M-yyyy".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

          vars["NextBusinessDateCalender2"] = (() => {
            const d = new Date(String(vars["TomorrowsDateCalender1"]));
            d.setDate(d.getDate() + parseInt(String("2")));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "dd-M-yyyy".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

          vars["NextBusinessDateInput1"] = (() => {
            const d = new Date(String(vars["NextBusinessDateCalender1"]));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "yyyy-MM-dd".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

          vars["NextBusinessDateInput2"] = (() => {
            const d = new Date(String(vars["NextBusinessDateCalender1"]));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "yyyy-MM-dd".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

          vars["NextBusinessDateList"] = (() => {
            const d = new Date(String(vars["NextBusinessDateCalender2"]));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "yyyy/M/d".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

        } else if (String(vars["TomorrowsDay"]) === String("Sunday")) {
          log.info('Tomorrow is Sunday — skipping to Monday (+1 day)');

          vars["NextBusinessDateCalender1"] = (() => {
            const d = new Date(String(vars["TomorrowsDateCalender1"]));
            d.setDate(d.getDate() + parseInt(String("1")));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "d-M-yyyy".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

          vars["NextBusinessDateCalender2"] = (() => {
            const d = new Date(String(vars["TomorrowsDateCalender1"]));
            d.setDate(d.getDate() + parseInt(String("1")));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "dd-M-yyyy".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

          vars["NextBusinessDateInput1"] = (() => {
            const d = new Date(String(vars["NextBusinessDateCalender1"]));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "yyyy-MM-dd".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

          vars["NextBusinessDateInput2"] = (() => {
            const d = new Date(String(vars["NextBusinessDateCalender1"]));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "yyyy-MM-dd".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

          vars["NextBusinessDateList"] = (() => {
            const d = new Date(String(vars["NextBusinessDateCalender2"]));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "yyyy/M/d".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

        } else {
          log.info('Tomorrow is a weekday — using tomorrow as next business day');

          vars["NextBusinessDateInput1"] = (() => {
            const d = new Date(String(vars["CurrentDateInput"]));
            d.setDate(d.getDate() + parseInt(String("1")));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "yyyy-MM-d".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

          vars["NextBusinessDateInput2"] = (() => {
            const d = new Date(String(vars["CurrentDateInput"]));
            d.setDate(d.getDate() + parseInt(String("1")));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "yyyy-MM-dd".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

          vars["NextBusinessDateList"] = (() => {
            const d = new Date(String(vars["CurrentDateList"]));
            d.setDate(d.getDate() + parseInt(String("1")));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "yyyy/M/d".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
          })();

          vars["NextBusinessDateCalender1"] = vars["TomorrowsDateCalender1"];
          vars["NextBusinessDateCalender2"] = vars["TomorrowsDateCalender2"];
        }

        log.info(`NextBusinessDateCalender1: ${vars["NextBusinessDateCalender1"]}`);
        log.info(`NextBusinessDateCalender2: ${vars["NextBusinessDateCalender2"]}`);
        log.info(`NextBusinessDateInput1: ${vars["NextBusinessDateInput1"]}`);
        log.info(`NextBusinessDateInput2: ${vars["NextBusinessDateInput2"]}`);
        log.info(`NextBusinessDateList: ${vars["NextBusinessDateList"]}`);

        log.stepPass('Next business date resolved successfully');
      } catch (e) {
        await log.stepFail(page, 'Next business date resolution failed');
        throw e;
      }

      // ── Step 6: Early Config Setup for Next Business Day ─────────────────
      log.step('Navigating to Early Close Config and setting up config for next business day');
      try {
        await correspondentPortalPage.Early_Close_Config.click();

        if (await earlyConfigPage.Early_Config_For_Next_business_day(vars["NextBusinessDateList"]).isVisible()) /* Element Early Config For Next business day is visible */ {
          log.info('Existing early config found — deleting before creating new one');
          await bidRequestPage.Delete_Early_Config_Button(vars["NextBusinessDateList"]).hover();
          await expect(page.getByText("Delete")).toBeVisible();
          await bidRequestPage.Delete_Early_Config_Button(vars["NextBusinessDateList"]).click();
          await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
          await earlyConfigPage.Early_Config_For_Next_business_day(vars["NextBusinessDateList"]).waitFor({ state: 'hidden' });
          log.info('Existing early config deleted successfully');
        }

        await correspondentPortalPage.Add_New_Config_Button.click();
        await correspondentPortalPage.Toggle_Date_Picker_Button.click();
        await earlyConfigPage.Next_Business_Date(vars["NextBusinessDateCalender1"], vars["NextBusinessDateCalender2"]).click();

        vars["SelectedDate"] = await correspondentPortalPage.datepicker_Input.inputValue() || '';
        log.info(`SelectedDate from datepicker: ${vars["SelectedDate"]}`);

        if (String(vars["SelectedDate"]).includes(String(vars["NextBusinessDateInput1"]))) {
          log.info(`SelectedDate matches NextBusinessDateInput1 (${vars["NextBusinessDateInput1"]}) — waiting for network idle`);
          await page.waitForLoadState('load');
        } else {
          log.info(`SelectedDate does not match Input1 — asserting against NextBusinessDateInput2 (${vars["NextBusinessDateInput2"]})`);
          expect(String(vars["SelectedDate"])).toBe(vars["NextBusinessDateInput2"]);
        }

        await earlyConfigPage.Last_Batch_Time_Input_Box.pressSequentially(vars["LastBatchTimeToEnterInConfig"]);
        log.info(`Filled Last Batch Time input with: ${vars["LastBatchTimeToEnterInConfig"]}`);

        if (String(vars["Time_Unit"]).includes(String("AM"))) {
          await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "AM" });
          log.info('Selected time unit: AM');
        } else {
          await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
          log.info('Selected time unit: PM');
        }
        page.waitForTimeout(2000);
        await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.click();
        page.waitForTimeout(2000);

        await expect(correspondentPortalPage.Save_Config_Button).toBeEnabled();
        await correspondentPortalPage.Save_Config_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(earlyConfigPage.Early_Config_For_Next_business_day(vars["NextBusinessDateList"])).toBeVisible();

        log.stepPass('Early config for next business day saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Early config setup for next business day failed');
        throw e;
      }

      // ── Step 7: Navigate to Bid Requests & Open Upload Form ──────────────
      log.step('Navigating to Bid Requests and opening Upload New Bid Request form');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        await expect(page.getByText("Bid Request Details")).toBeVisible();
        log.info('"Bid Request Details" page is visible');

        await correspondentPortalPage.Off_Radio_StandardEdit_Permissions_Popup.check();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        log.stepPass('Bid Request upload form opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to open Bid Request upload form');
        throw e;
      }

      // ── Step 8: Validate Batch Times Not Present in Pricing Return Time Dropdown ──
      log.step('Validating that last batch times are not present in Pricing Return Time dropdown');
      try {
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.hover();
        //await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click({ force: true });
        await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BufferedThirdBatchTimeFromLast"] })).not.toBeVisible();
        log.info(`PASS — BufferedThirdBatchTimeFromLast (${vars["BufferedThirdBatchTimeFromLast"]}) is NOT visible in dropdown`);

        await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BufferedLastBeforeBatchTime"] })).not.toBeVisible();
        log.info(`PASS — BufferedLastBeforeBatchTime (${vars["BufferedLastBeforeBatchTime"]}) is NOT visible in dropdown`);

        await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BufferedLastBatchTime"] })).not.toBeVisible();
        log.info(`PASS — BufferedLastBatchTime (${vars["BufferedLastBatchTime"]}) is NOT visible in dropdown`);

        log.stepPass('All expected batch times are correctly absent from the dropdown');
      } catch (e) {
        await log.stepFail(page, 'Dropdown batch time validation failed');
        throw e;
      }

      // ── Step 9: Cleanup — Delete Early Config ────────────────────────────
      log.step('Cleaning up — deleting early config');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await headerMappingPage.General_Settings.click();
        await page.waitForLoadState('load');
        await correspondentPortalPage.Early_Close_Config.click();
        await page.waitForLoadState('load');
        if (await earlyConfigPage.Early_Config_For_Next_business_day(vars["NextBusinessDateList"]).isVisible()) /* Element Early Config For Next business day is visible */ {
          log.info('Existing early config found — deleting before creating new one');
          await bidRequestPage.Delete_Early_Config_Button(vars["NextBusinessDateList"]).hover();
          await expect(page.getByText("Delete")).toBeVisible();
          await bidRequestPage.Delete_Early_Config_Button(vars["NextBusinessDateList"]).click();
          await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
          await earlyConfigPage.Early_Config_For_Next_business_day(vars["NextBusinessDateList"]).waitFor({ state: 'hidden' });
          log.info('Existing early config deleted successfully');
        }
        // await stepGroups.stepGroup_Delete_early_config(page, vars);

        log.stepPass('Early config deleted successfully — cleanup complete');
      } catch (e) {
        await log.stepFail(page, 'Cleanup failed — early config deletion unsuccessful');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      reg_ts01_tc18_testFailed = true;
      throw e;
    }
  });
  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, reg_ts01_tc18_testFailed);
    if (reg_ts01_tc18_testFailed) {
      try {
        log.step('Executing after-test steps: Deleting Early Config Records if Present');
        // await correspondentPortalPage.Administration_Menu.click();
        // await correspondentPortalPage.GeneralSettings_Menu.click();
        //await stepGroups.stepGroup_Delete_early_config(page, vars);
        await correspondentPortalPage.Administration_Menu.click();
        await headerMappingPage.General_Settings.click();
        await page.waitForLoadState('load');
        await correspondentPortalPage.Early_Close_Config.click();
        await page.waitForLoadState('load');
        if (await earlyConfigPage.Early_Config_For_Next_business_day(vars["NextBusinessDateList"]).isVisible()) /* Element Early Config For Next business day is visible */ {
          log.info('Existing early config found — deleting before creating new one');
          await bidRequestPage.Delete_Early_Config_Button(vars["NextBusinessDateList"]).hover();
          await expect(page.getByText("Delete")).toBeVisible();
          await bidRequestPage.Delete_Early_Config_Button(vars["NextBusinessDateList"]).click();
          await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
          await earlyConfigPage.Early_Config_For_Next_business_day(vars["NextBusinessDateList"]).waitFor({ state: 'hidden' });
          log.info('Existing early config deleted successfully');
        }
        log.stepPass('After-test steps executed successfully, deleted early config records if present');
      } catch (e) {
        await log.stepFail(page, 'After-test steps failed to execute as the script is passed');
        throw e;
      }
    }
  })
});