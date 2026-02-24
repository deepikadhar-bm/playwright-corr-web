import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestConfigPage } from '../../pages/correspondant/bid-request-config';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../pages/correspondant/spinner';

export async function runPrereq_2173(page: Page, vars: Record<string, string>): Promise<void> {
  const bidRequestConfigPage = new BidRequestConfigPage(page);
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const spinnerPage = new SpinnerPage(page);


  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await correspondentPortalPage.Administration_Menu.click();
  await correspondentPortalPage.GeneralSettings_Menu.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await bidRequestPage.Bid_Request_Config_Menu.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: "Choice" });
  await expect(correspondentPortalPage.Pricing_Return_Time).toHaveValue("Choice");
  await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
  await bidRequestConfigPage.Save_Changes_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
  await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
  await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
  // [DISABLED] Upload Bid Request from batch time selection to continue button
  // await stepGroups.stepGroup_Upload_Bid_Request_from_batch_time_selection_to_continue_but(page, vars);
  await stepGroups.stepGroup_Upload_Bid_Process_from_Batch_time_Selection_to_Bid_Upload_P(page, vars);
  vars["RowsCount"] = String(await bidRequestDetailsPage.Rows_Count_Table_1.count());
  await bidRequestDetailsPage.First_error_data.hover();
  vars["ConventionalErrorCount"] = String(await bidRequestDetailsPage.Not_Approved_for_Conventional_Error_Description.count());
  expect(String(vars["RowsCount"])).toBe(vars["ConventionalErrorCount"]);
  await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
  await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: "Conventional" });
  await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
  await bidRequestConfigPage.Save_Changes_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["ExpectedModifiedTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    const fmt = "MM/d/yyyy : h:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars[""] = (() => {
    const d = new Date('2000-01-01 ' + String(''));
    d.setMinutes(d.getMinutes() - parseInt(String('')));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  })();
  await expect(correspondentPortalPage.Pricing_Return_Time).toHaveValue("Conventional");
}
