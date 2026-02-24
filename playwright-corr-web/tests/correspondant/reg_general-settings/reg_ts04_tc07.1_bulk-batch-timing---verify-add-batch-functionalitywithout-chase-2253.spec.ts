// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BatchinbulkbatchtimingPage } from '../../../src/pages/correspondant/batchinbulkbatchtiming';
import { BidrequestCreationPage } from '../../../src/pages/correspondant/bidrequest-creation';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let batchinbulkbatchtimingPage: BatchinbulkbatchtimingPage;
  let bidrequestCreationPage: BidrequestCreationPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    batchinbulkbatchtimingPage = new BatchinbulkbatchtimingPage(page);
    bidrequestCreationPage = new BidrequestCreationPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
  });

  test('REG_TS04_TC07.1_Bulk Batch Timing - Verify Add batch functionality(Without Chase)', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Bulk Batch Timing")).toBeVisible();
    vars["LastBeforeBatchTime"] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
    vars["BatchTime(FewMinAdded)"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["LastBeforeBatchTime"]));
      d.setMinutes(d.getMinutes() + parseInt(String("2")));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
    })();
    vars["AddedBatchTime"] = vars["BatchTime(FewMinAdded)"];
    // [DISABLED] Trim white space from DeletedBatch1 and store it in a runtime DeletedBatch1
    // vars["DeletedBatch1"] = String(vars["DeletedBatch1"]).trim();
    vars["MinWithStandard"] = String(vars["BatchTime(FewMinAdded)"]).split(":")["2"] || '';
    vars["Time_Hour"] = String(vars["BatchTime(FewMinAdded)"]).substring(0, String(vars["BatchTime(FewMinAdded)"]).length - 6);
    vars["Time_Min"] = String(vars["MinWithStandard"]).substring(0, String(vars["MinWithStandard"]).length - 3);
    vars["Time_Unit"] = String(vars["MinWithStandard"]).substring(3);
    await correspondentPortalPage.Add_A_Batch_Button.click();
    await expect(page.getByText("Add a Batch")).toBeVisible();
    // [DISABLED] Pick the current date hh by location UTC-04:00 and store into a variable Time_Hour
    // vars["Time_Hour"] = (() => {
    //   const d = new Date();
    //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-04:00" };
    //   const fmt = "hh";
    //   // Map Java date format to Intl parts
    //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    // })();
    await correspondentPortalPage.StartTime_In_Hour.fill(vars["Time_Hour"]);
    // [DISABLED] Pick the current date hh:mm by location UTC-04:00 and store into a variable Time_Min
    // vars["Time_Min"] = (() => {
    //   const d = new Date();
    //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-04:00" };
    //   const fmt = "hh:mm";
    //   // Map Java date format to Intl parts
    //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    // })();
    // [DISABLED] Split the Time_Min with the : and store the value from the 2 in the BulkBatchTiming
    // vars["BulkBatchTiming"] = String(vars["Time_Min"]).split(":")["2"] || '';
    // [DISABLED] Store the value displayed in the text box Pricing_Return_Time_Buffer field into a variable PricingReturnTimeBuffer
    // vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
    await correspondentPortalPage.StartTime_In_Minutes.fill(vars["Time_Min"]);
    vars["AddStartTimeInMin"] = await correspondentPortalPage.StartTime_In_Minutes.inputValue() || '';
    if (String(vars["Time_Unit"]).includes(String("PM"))) {
      await correspondentPortalPage.Dropdown_selection_2.selectOption({ label: "PM" });
      await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue("PM");
    }
    await correspondentPortalPage.Add_Batch_Button.click();
    // [DISABLED] Wait until the current page is loaded completely
    // await page.waitForLoadState('networkidle');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Create Batch Timing")).toBeVisible();
    await expect(correspondentPortalPage.Batch_timing_has_been_created_successfully_Success_Message).toBeVisible();
    await okButtonPage.Ok_Button.click();
    vars["ActualBatchTime"] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
    expect(String(vars["ActualBatchTime"])).toBe(vars["AddedBatchTime"]);
    await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
    // [DISABLED] Store the value displayed in the text box Pricing_Return_Time_Buffer field into a variable PricingReturnTimeBuffer
    // vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
    // [DISABLED] Add PricingReturnTimeBuffer minutes to the AddedBatchTime with hh:mm a , convert to hh:mm a format, and store it in a runtime variable AddedBatchTime
    // vars["AddedBatchTime"] = (() => {
    //   const d = new Date('2000-01-01 ' + String(vars["AddedBatchTime"]));
    //   d.setMinutes(d.getMinutes() + parseInt(String(vars["PricingReturnTimeBuffer"])));
    //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
    // })();
    // [DISABLED] Store the count of elements identified by locator Batches_Count into a variable BatchCount
    // vars["BatchCount"] = String(await correspondentPortalPage.Batches_Count.count());
    // [DISABLED] Wait until the current page is loaded completely
    // await page.waitForLoadState('networkidle');
    // [DISABLED] Click on BidRequests_Menu
    // await correspondentPortalPage.Bid_Requests.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Click on Upload New Bid Request Button
    // await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
    // [DISABLED] Verify that the current page displays text Bid Request Details
    // await expect(page.getByText("Bid Request Details")).toBeVisible();
    // [DISABLED] Click on Today_Pricing
    // await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();
    // [DISABLED] Verify that the options with text AddedBatchTime is present in the select list Select_Pricing_Batch_Dropdown and With Scrollable FALSE
    // await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["AddedBatchTime"] })).toBeVisible();
    // [DISABLED] Store 1 in Batch
    // vars["Batch"] = "1";
    while (true) /* Verify if Batch <= BatchCount */ {
      // [DISABLED] Perform addition on 1 and Batch and store the result inside a Batch considering 0 decimal places
      // vars["Batch"] = (parseFloat(String("1")) + parseFloat(String(vars["Batch"]))).toFixed(0);
      // [DISABLED] Navigating to Bulk Batch Timing
      // await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    }
  });
});
