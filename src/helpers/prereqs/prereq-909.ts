import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidrequestCreationPage } from '../../pages/correspondant/bidrequest-creation';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { ChaseFieldNamePage } from '../../pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../pages/correspondant/ok-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../pages/correspondant/upload-new-bid-request-button';
import { runPrereq_903 } from './prereq-903';

export async function runPrereq_909(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_903(page, vars);

  const bidrequestCreationPage = new BidrequestCreationPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const okButtonPage = new OkButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const statusInactivePage = new StatusInactivePage(page);
  const uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);



  // [DISABLED] Login to CORR Portal
  // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(page.getByText("Bulk Batch Timing")).toBeVisible();
  // [DISABLED] Store text from the element Last batch Time(bulk batch screen) into a variable LastBatchTime
  // vars["LastBatchTime"] = await chaseFieldNamePage.Last_batch_Timebulk_batch_screen.textContent() || '';
  // [DISABLED] Add 5 minutes to the LastBatchTime with HH:mm a , convert to HH:mm a format, and store it in a runtime variable BatchTime(FewMinAdded)
  // vars["BatchTime(FewMinAdded)"] = (() => {
  //   const d = new Date('2000-01-01 ' + String(vars["LastBatchTime"]));
  //   d.setMinutes(d.getMinutes() + parseInt(String("5")));
  //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: HH:mm a
  // })();
  // [DISABLED] Trim white space from DeletedBatch1 and store it in a runtime DeletedBatch1
  // vars["DeletedBatch1"] = String(vars["DeletedBatch1"]).trim();
  vars["MinWithStandard"] = String(vars["DeletedBatchTime1"]).split(":")["2"] || '';
  vars["Time_Hour"] = String(vars["DeletedBatchTime1"]).substring(0, String(vars["DeletedBatchTime1"]).length - 6);
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
  vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
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
  vars["AddedBatchTime"] = await bidRequestPage.Added_Batch_1.textContent() || '';
  vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
  vars["AddedBatchTime"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["AddedBatchTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String(vars["PricingReturnTimeBuffer"])));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  // [DISABLED] Store the count of elements identified by locator Batches_Count into a variable BatchCount
  // vars["BatchCount"] = String(await correspondentPortalPage.Batches_Count.count());
  await page.waitForLoadState('networkidle');
  await correspondentPortalPage.Bid_Requests.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
  await expect(page.getByText("Bid Request Details")).toBeVisible();
  await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();
  await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["AddedBatchTime"] })).toBeVisible();
  // [DISABLED] Store 1 in Batch
  // vars["Batch"] = "1";
  while (true) /* Verify if Batch <= BatchCount */ {
    // [DISABLED] Perform addition on 1 and Batch and store the result inside a Batch considering 0 decimal places
    // vars["Batch"] = (parseFloat(String("1")) + parseFloat(String(vars["Batch"]))).toFixed(0);
    // [DISABLED] Navigating to Bulk Batch Timing
    // await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  }
}
