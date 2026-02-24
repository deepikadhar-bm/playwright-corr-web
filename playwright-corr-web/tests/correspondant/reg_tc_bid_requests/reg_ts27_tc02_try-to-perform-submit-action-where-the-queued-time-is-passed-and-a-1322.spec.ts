// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestCreationPage } from '../../../src/pages/correspondant/bid-request-creation';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestCreationPage: BidRequestCreationPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestCreationPage = new BidRequestCreationPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS27_TC02_Try to perform submit action where, the Queued time is passed, and a next available batch exists', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
    await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_Bid_RequestNew(page, vars);
    vars["SelectedBatchTime"] = await bidRequestsPage.First_Enabled_Time.getAttribute('title') || '';
    vars[""] = (() => {
      const d = new Date('2000-01-01 ' + String(''));
      d.setMinutes(d.getMinutes() - parseInt(String('')));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    })();
    vars["SecondEnabledBatchTime"] = await bidRequestCreationPage.Second_Enabled_Time.getAttribute('title') || '';
    vars["ThirdEnabledBatchTime"] = await bidRequestCreationPage.Third_Enabled_Time.getAttribute('title') || '';
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["FooterQueuedDate"] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
    expect(String(vars["FooterQueuedDate"])).toBe(vars["SelectedBatchTimeWithoutbuffer"]);
    vars["QueuedForTime"] = String(vars["FooterQueuedDate"]).substring(23, String(vars["FooterQueuedDate"]).length - 6);
    vars["TimeStandard"] = String(vars["FooterQueuedDate"]).substring(18, String(vars["FooterQueuedDate"]).length - 3);
    vars["HourMin"] = String(vars["FooterQueuedDate"]).substring(12, String(vars["FooterQueuedDate"]).length - 6);
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
    await expect(bidRequestDetailsPage.Passed_Queued_For_TimeRed_Colour_Text).toBeVisible();
    vars["TimeInSeconds"] = (parseFloat(String(vars["TimeDifference"])) * parseFloat(String("60"))).toFixed(0);
    await bidRequestDetailsPage.Bid_Request_Details_Text.click();
    while (parseFloat(String(vars["TimeDifference"])) > parseFloat(String("4"))) {
      await page.waitForTimeout(240000);
      await bidRequestDetailsPage.Bid_Request_Details_Text.click();
      vars["TimeDifference"] = (parseFloat(String(vars["TimeDifference"])) - parseFloat(String("4"))).toFixed(0);
      vars["TimeInSeconds"] = (parseFloat(String(vars["TimeDifference"])) * parseFloat(String("60"))).toFixed(0);
    }
    await page.waitForTimeout(parseInt(vars["TimeInSeconds"]) * 1000);
    await page.reload();
    await page.waitForTimeout(10000);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(bidRequestDetailsPage.Passed_Queued_For_TimeRed_Colour_Text).toBeVisible();
    await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Ready for Pricing");
    vars["Extractedqueuedtotime"] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
    expect(String(vars["Extractedqueuedtotime"])).toBe(vars["SelectedBatchTimeWithoutbuffer"]);
    vars["ExtractedCurrentDate"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "MM/dd/yyyy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    expect(String(vars["Extractedqueuedtotime"])).toBe(vars["ExtractedCurrentDate"]);
    await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
    await bidRequestDetailsPage.Yes_Submit_Button.waitFor({ state: 'visible' });
    await bidRequestDetailsPage.Yes_Submit_Button.click();
    // [DISABLED] Subtract 1 minutes from EST time SecondEnabledBatchTime with format hh:mm a into SecondEnabledBatchTime
    // vars[""] = (() => {
    //   const d = new Date('2000-01-01 ' + String(''));
    //   d.setMinutes(d.getMinutes() - parseInt(String('')));
    //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    // })();
    vars[""] = (() => {
      const d = new Date('2000-01-01 ' + String(''));
      d.setMinutes(d.getMinutes() - parseInt(String('')));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    })();
    vars["SecondEnabledBatchHourMin"] = String(vars["SecondEnabledBatchTime"]).substring(0, String(vars["SecondEnabledBatchTime"]).length - 3);
    vars["FirstDigit"] = String(vars["SecondEnabledBatchTime"]).substring(0, String(vars["SecondEnabledBatchTime"]).length - 7);
    if (String(vars["FirstDigit"]) === String("0")) {
      vars["SecondEnabledBatchTime"] = String(vars["SecondEnabledBatchTime"]).substring(1);
    }
    // [DISABLED] Subtract 1 minutes from EST time ThirdEnabledBatchTime with format hh:mm a into ThirdEnabledBatchTime
    // vars[""] = (() => {
    //   const d = new Date('2000-01-01 ' + String(''));
    //   d.setMinutes(d.getMinutes() - parseInt(String('')));
    //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    // })();
    vars[""] = (() => {
      const d = new Date('2000-01-01 ' + String(''));
      d.setMinutes(d.getMinutes() - parseInt(String('')));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    })();
    vars["FirstDigit2"] = String(vars["ThirdEnabledBatchTime"]).substring(0, String(vars["ThirdEnabledBatchTime"]).length - 7);
    if (String(vars["FirstDigit2"]) === String("0")) {
      vars["ThirdEnabledBatchTime"] = String(vars["ThirdEnabledBatchTime"]).substring(1);
    }
    vars[""] = String("Pricing moved to the next batch today at") + ' ' + String(vars["SecondEnabledBatchTime"]);
    vars[""] = String("Pricing moved to the next batch today at") + ' ' + String(vars["ThirdEnabledBatchTime"]);
    await page.waitForLoadState('networkidle');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    if (true) /* Verify that the element Moved to batch pop up displays text  */ {
    } else {
      await expect(bidRequestDetailsPage.Moved_to_batch_pop_up).toContainText(vars["PricingMovedText2"]);
    }
    await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Ready for Pricing");
    vars["RequestIdFromDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
    vars["RequestIdFromDetails"] = String(vars["RequestIdFromDetails"]).trim();
    await okButtonPage.Ok_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    if (true) /* Element First Bid Request ID is visible */ {
      await correspondentPortalPage.First_Bid_Request_ID.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    }
    vars["TimeStandard"] = String(vars["FooterQueuedDate"]).substring(18, String(vars["FooterQueuedDate"]).length - 3);
    vars[""] = String("Queued /") + ' ' + String(vars["HourMin"]);
    if (String(vars["TimeStandard"]).includes(String("AM"))) {
      vars["TimeStandard"] = "am";
    } else {
      vars["TimeStandard"] = "pm";
    }
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Bid_Requests_Side_Menu.click();
    vars[""] = String(vars["TimeStandard"]) + ' ' + String("ET");
    vars[""] = String(vars["SecondEnabledBatchHourMin"]) + ' ' + String(vars["standardwithET"]);
    vars["ExpectedQueuedForTime1"] = vars["ExpectedQueuedForTime"];
    vars[""] = String("Queued /") + ' ' + String(vars["ExpectedQueuedForTime1"]);
    vars["FinalExpectedQueuedStatus"] = String(vars["FinalExpectedQueuedStatus"]).trim();
    vars["BidStatusExtractedFromList"] = await priceOfferedPage.Price_Offered_Status_Column_Data.textContent() || '';
    vars["BidStatusExtractedFromList"] = String(vars["BidStatusExtractedFromList"]).trim();
    expect(String(vars["BidStatusExtractedFromList"])).toBe(vars["FinalExpectedQueuedStatus"]);
    await bidRequestListPage.Request_Id_to_select.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestDetailsPage.Passed_Queued_For_TimeRed_Colour_Text).toBeVisible();
    await expect(bidRequestDetailsPage.Queued_For_TimeBlack_colour_text).toBeVisible();
    await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Queued for Next Batch");
    vars["QueuedTimeDetails"] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
    expect(String(vars["QueuedTimeDetails"]).toLowerCase()).toContain(String(vars["ExpectedQueuedForTime"]).toLowerCase());
  });
});
