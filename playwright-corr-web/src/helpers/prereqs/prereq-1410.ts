import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1312 } from './prereq-1312';

export async function runPrereq_1410(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1312(page, vars);

  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const spinnerPage = new SpinnerPage(page);



  await page.waitForTimeout(120000);
  await correspondentPortalPage.Close_Buttonemail_config.click();
  await bidRequestDetailsPage.Last_Table_Program_Cell_Data_Bid_requests_details.scrollIntoViewIfNeeded();
  await stepGroups.stepGroup_Fetching_Second_Table_data_in_bid_requests_details_and_stori(page, vars);
  vars["FooterSubmssionBeforeSubmit"] = await bidRequestDetailsPage.Footer_Submission_Date.textContent() || '';
  vars["FooterQueuedBeforeSubmit"] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
  await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeVisible();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await correspondentPortalPage.Dropdown_selection_2.click();
  await page.waitForTimeout(5000);
  if (true) /* Element Enabled Time is visible */ {
    await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
    // [DISABLED] Scroll to the element Enabled Time into view
    // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
    // [DISABLED] Click on Enabled Time
    // await bidRequestPage.Enabled_Time.click();
  } else {
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page, vars);
    await correspondentPortalPage.Bid_Requests_Side_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["RequestIDBeforeResubmit"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.First_Bid_Request_ID).toContainText(vars["RequestIDBeforeResubmit"]);
    await correspondentPortalPage.First_Bid_Request_ID.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
    await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeVisible();
    await correspondentPortalPage.Dropdown_selection_2.click();
    await page.waitForTimeout(5000);
    await bidRequestPage.Enabled_Time.click();
  }
  vars["CurrentESTDate"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "MM/dd/yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["CurrentEstTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["SelectedBatchTime"] = await correspondentPortalPage.Dropdown_selection_2.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  await bidRequestDetailsPage.Submit_Button_On_pop_up.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(60000);
  await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
  await bidRequestDetailsPage.Bid_Upload_Progress_Header.waitFor({ state: 'visible' });
  await stepGroups.stepGroup_Verify_that_the_Bid_Upload_Progress_Popup_has_All_statuses_w(page, vars);
  await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
  await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeEnabled();
  await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
}
