import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../pages/correspondant/bid-request-list';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1381 } from './prereq-1381';
import path from 'path';
import { add } from 'date-fns';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { waitForSpinnerToDisappear } from '@helpers/wait-helpers';

export async function runPrereq_1394(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1381(page, vars);

  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestListPage = new BidRequestListPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const spinnerPage = new SpinnerPage(page);


  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
  await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
  //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
  const CorrPortalElem = new CorrPortalPage(page);
  await CorrPortalElem.BidRequests_Menu.click();
  await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
  await expect(page.getByText("Bid Requests").first()).toBeVisible();
  await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
  // [DISABLED] Uploading Bid Request(Latest)
  // await stepGroups.stepGroup_Uploading_Bid_RequestLatest(page, vars);
  await correspondentPortalPage.Pricing_Return_Time.selectOption({ index: parseInt("2") });
  vars["ExtractedPrincingReturnTime"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  await correspondentPortalPage.Upload_File.setInputFiles([path.resolve(__dirname, '..', '..', '..', 'uploads', 'Bid_file_success_error_newly_updated (10).xlsx')]);
  await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
  await expect(correspondentPortalPage.UploadBid_Button).toBeEnabled();
  await correspondentPortalPage.UploadBid_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
  await page.waitForTimeout(5000);

  //   page.once('response', response => {
  //   // Filter only your app's domain
  //   if (response.url().includes('lpcorrtest.com')) {
  //     console.log(`[${response.request().method()}] ${response.url()} - Status: ${response.status()}`);
  //   }
  // });
  await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
  //page.off('response', responseHandler);
  //page.reload();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await page.waitForLoadState('load');
  await page.waitForTimeout(5000);

  const currentUrl = page.url();
  console.log('Current URL:', currentUrl);

  await bidRequestDetailsPage.Request_Id_From_Details.waitFor({ state: 'visible', timeout: 20000 });


  vars["RequestIDDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
  vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
  console.log("Extracted Request ID: " + vars["RequestIDDetails"]);
  await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Ready for Pricing");
  vars["QueuedDateTime"] = await bidRequestDetailsPage.Queued_Forbid_request_details_text_dark.textContent() || '';
  vars["ExtractedDateTime"] = String('').split("")["3"] || '';
  vars["QueuedTime"] = vars["ExtractedDateTime"];

  vars["CurrentEstTime"] = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  vars["TimeDifference"] = Math.abs(new Date('2000-01-01 ' + String(vars["QueuedTime"])).getTime() - new Date('2000-01-01 ' + String(vars["CurrentEstTime"])).getTime()) / 60000 + '';
  if (true) /* Verify if TimeDifference > 4 */ {
    // [DISABLED] Store 4 in WaitTime
    // vars["WaitTime"] = "4";
  } else {
    // [DISABLED] Store TimeDifference in WaitTime
    // vars["WaitTime"] = vars["TimeDifference"];
  }

  await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await bidRequestDetailsPage.Yes_Submit_Button.click();

  vars["CurrentEstTime"] = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  console.log("Current EST Time after submission: " + vars["CurrentEstTime"]);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await correspondentPortalPage.Bid_Requests_Side_Menu.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["index"] = "0";
  while (!(await bidRequestDetailsPage.Price_Offered_Status_of_searched_bid(vars["RequestIDDetails"]).isVisible())) {
    await page.reload();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["index"] = (parseInt(String(vars["index"])) + 1).toString();
    console.log("Current Attempt: " + vars["index"]);
  }
  console.log("Price Offered status is visible after " + vars["index"] + " attempts.");
  vars["CurrentEstTime"] = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  console.log("Current EST Time: " + vars["CurrentEstTime"]);

}
