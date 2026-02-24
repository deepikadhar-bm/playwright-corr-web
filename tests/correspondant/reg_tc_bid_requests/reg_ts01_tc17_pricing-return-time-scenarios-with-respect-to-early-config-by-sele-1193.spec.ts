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

  test('REG_TS01_TC17_Pricing return time scenarios with respect to early config By Selecting Current Date and verifying the last batch time is not present in bid requests', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await page.waitForLoadState('networkidle');
    await stepGroups.stepGroup_Modifying_The_Batch_Intervals(page, vars);
    vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
    vars["ThirdBatchTimeFromLast"] = await bidRequestPage.Third_Batch_From_the_Last.textContent() || '';
    vars["LastBatchTimeToEnter"] = String(vars["ThirdBatchTimeFromLast"]).substring(0, String(vars["ThirdBatchTimeFromLast"]).length - 3);
    vars["BufferedThirdBatchTimeFromLast"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["ThirdBatchTimeFromLast"]));
      d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
    })();
    vars["LastBeforeBatchTime"] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
    vars["BufferedLastBeforeBatchTime"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["LastBeforeBatchTime"]));
      d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
    })();
    vars["LastBatchTime"] = await chaseFieldNamePage.Last_batch_Timebulk_batch_screen.textContent() || '';
    vars["BufferedLastBatchTime"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["LastBatchTime"]));
      d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
    })();
    await stepGroups.stepGroup_Separating_Hours_and_Minutes(page, vars);
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
    if (true) /* Element Early Config For Current Date is visible */ {
      await statusInactive2Page.Delete_Early_Config_Button_CurrentDateList.hover();
      await expect(page.getByText("Delete")).toBeVisible();
      await statusInactive2Page.Delete_Early_Config_Button_CurrentDateList.click();
      await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
      await earlyConfigPage.Early_Config_For_Current_Date.waitFor({ state: 'hidden' });
    }
    await correspondentPortalPage.Add_New_Config_Button.click();
    await correspondentPortalPage.Toggle_Date_Picker_Button.click();
    await earlyConfigPage.Current_Date.click();
    await expect(correspondentPortalPage.datepicker_Input).toHaveValue(vars["CurrentDateInput"]);
    await earlyConfigPage.Last_Batch_Time_Input_Box.fill(vars["LastBatchTimeToEnter"]);
    if (String(vars["Time_Unit"]).includes(String("AM"))) {
      await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "AM" });
    } else {
      await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
    }
    await correspondentPortalPage.Save_Config_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(earlyConfigPage.Early_Config_For_Current_Date).toBeVisible();
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Bid Request Details")).toBeVisible();
    await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();
    await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BufferedThirdBatchTimeFromLast"] })).not.toBeVisible();
    await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BufferedLastBeforeBatchTime"] })).not.toBeVisible();
    await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BufferedLastBatchTime"] })).not.toBeVisible();
    await correspondentPortalPage.Administration_Menu.click();
    await headerMappingPage.General_Settings.click();
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Early_Close_Config.click();
    await page.waitForLoadState('networkidle');
    await stepGroups.stepGroup_Delete_early_config(page, vars);
  });
});
