// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS27_TC03_02_Try to perform submit action where, Queued time is passed, and no further batch exists for the day', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
    await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_Bid_RequestNew(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["FooterQueuedDate"] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
    vars["QueuedForTime"] = String(vars["FooterQueuedDate"]).substring(23, String(vars["FooterQueuedDate"]).length - 6);
    vars["CurrentEstTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "hh:mm";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["TimeDifference"] = Math.abs(new Date('2000-01-01 ' + String(vars["CurrentEstTime"])).getTime() - new Date('2000-01-01 ' + String(vars["QueuedForTime"])).getTime()) / 60000 + '';
    vars["InitialTimeDifference"] = vars["TimeDifference"];
    await expect(bidRequestDetailsPage.Passed_Queued_For_TimeRed_Colour_Text).toBeVisible();
    vars["TimeDifferenceInSeconds"] = (parseFloat(String(vars["TimeDifference"])) * parseFloat(String("60"))).toFixed(0);
    await stepGroups.stepGroup_Splitting_the_time_and_waiting_if_the_wait_time_is_more_than(page, vars);
    if (String(vars["InitialTimeDifference"]) > String("4")) {
      await page.waitForTimeout(parseInt(vars["TimeDifferenceSeconds"]) * 1000);
    } else {
      await page.waitForTimeout(parseInt(vars["TimeDifferenceInSeconds"]) * 1000);
    }
    await page.reload();
    await expect(bidRequestDetailsPage.Passed_Queued_For_TimeRed_Colour_Text).toBeVisible();
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page, vars);
  });
});
