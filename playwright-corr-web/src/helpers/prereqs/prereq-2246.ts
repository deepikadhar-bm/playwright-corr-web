import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BatchinbulkbatchtimingPage } from '../../pages/correspondant/batchinbulkbatchtiming';
import { BidrequestCreationPage } from '../../pages/correspondant/bidrequest-creation';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../pages/correspondant/ok-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../pages/correspondant/upload-new-bid-request-button';

export async function runPrereq_2246(page: Page, vars: Record<string, string>): Promise<void> {
  const batchinbulkbatchtimingPage = new BatchinbulkbatchtimingPage(page);
  const bidrequestCreationPage = new BidrequestCreationPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const okButtonPage = new OkButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const statusInactivePage = new StatusInactivePage(page);
  const uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);


  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
  await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
  vars["LastBeforeBatchTime"] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
  vars["ExpectedBatchTime"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["LastBeforeBatchTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("1")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  await stepGroups.stepGroup_Separating_Hours_and_Minutes(page, vars);
  await batchinbulkbatchtimingPage.Batch_Time_Last_Before.hover();
  await batchinbulkbatchtimingPage.Edit_Batch_ButtonLast_Before.click();
  await expect(page.getByText("Edit Batch Timing")).toBeVisible();
  await correspondentPortalPage.StartTime_In_Hour.clear();
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
  await correspondentPortalPage.StartTime_In_Minutes.clear();
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
  await correspondentPortalPage.StartTime_In_Minutes.fill(vars["Time_Min"]);
  await expect(correspondentPortalPage.Apply_Changes_Button).toBeVisible();
  await correspondentPortalPage.Apply_Changes_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(page.getByText("Update Batch Timing")).toBeVisible();
  await expect(correspondentPortalPage.Batch_timing_has_been_updated_successfully_Success_Message).toBeVisible();
  await okButtonPage.Ok_Button.click();
  await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
  vars["EditedBatchTime"] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
  expect(String(vars["EditedBatchTime"])).toBe(vars["ExpectedBatchTime"]);
  // [DISABLED] Store the count of elements identified by locator Batches_Count into a variable BatchCount
  // vars["BatchCount"] = String(await correspondentPortalPage.Batches_Count.count());
  // [DISABLED] Verification for the Pricing Return Timing
  // await stepGroups.stepGroup_Verification_for_the_Pricing_Return_Timing(page, vars);
  // [DISABLED] Store the value displayed in the text box Pricing_Return_Time_Buffer field into a variable BufferTime
  // vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
  // [DISABLED] Add BufferTime minutes to the EditedBatchTime with hh:mm a , convert to hh:mm a format, and store it in a runtime variable BufferEditedTime
  // vars["BufferEditedTime"] = (() => {
  //   const d = new Date('2000-01-01 ' + String(vars["EditedBatchTime"]));
  //   d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
  //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  // })();
  // [DISABLED] Click on BidRequests_Menu
  // await correspondentPortalPage.Bid_Requests.click();
  // [DISABLED] Wait until the element Spinner is not visible
  // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Verify that the current page displays text Bid Requests
  // await expect(page.getByText("Bid Requests")).toBeVisible();
  // [DISABLED] Click on Upload New Bid Request Button
  // await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
  // [DISABLED] Wait until the element Spinner is not visible
  // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Verify that the current page displays text Bid Request Details
  // await expect(page.getByText("Bid Request Details")).toBeVisible();
  // [DISABLED] Click on Pricing ReturnTime Dropdown
  // await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();
  // [DISABLED] Verify that the options with text BufferEditedTime is present in the select list Select_Pricing_Batch_Dropdown and With Scrollable FALSE
  // await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BufferEditedTime"] })).toBeVisible();
}
