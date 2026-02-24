import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestConfigPage } from '../../pages/correspondant/bid-request-config';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EarlyConfigPage } from '../../pages/correspondant/early-config';
import { SpinnerPage } from '../../pages/correspondant/spinner';

export async function runPrereq_2220(page: Page, vars: Record<string, string>): Promise<void> {
  const bidRequestConfigPage = new BidRequestConfigPage(page);
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const earlyConfigPage = new EarlyConfigPage(page);
  const spinnerPage = new SpinnerPage(page);


  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await correspondentPortalPage.Administration_Menu.click();
  await correspondentPortalPage.GeneralSettings_Menu.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await bidRequestPage.Bid_Request_Config_Menu.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await earlyConfigPage.Real_time_On_Radio_Button.check();
  await earlyConfigPage.Deffered_On_Radio_Button.check();
  if (true) /* Element Save Changes Button is enabled */ {
    await bidRequestConfigPage.Save_Changes_Button.click();
  }
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
  // [DISABLED] Add 5 minutes to the CurrentTime with hh:mm a , convert to hh:mm a format, and store it in a runtime variable ExpectedBatch2Time
  // vars["ExpectedBatch2Time"] = (() => {
  //   const d = new Date('2000-01-01 ' + String(vars["CurrentTime"]));
  //   d.setMinutes(d.getMinutes() + parseInt(String("5")));
  //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  // })();
  await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
  await stepGroups.stepGroup_Uploading_Bid_Request_For_both_Real_and_Differed_Options(page, vars);
  await correspondentPortalPage.Real_Time_Radio_ButtonUpload_Bid.check();
  await page.waitForLoadState('networkidle');
  await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeVisible();
  await expect(correspondentPortalPage.bidRequestDate_Next_Bussiness_Radio_Button).toBeVisible();
  await correspondentPortalPage.Deferred_Radio_ButtonUpload_Bid.check();
  await page.waitForLoadState('networkidle');
  await bidRequestDetailsPage.bidRequestDate_Today_Radio_Button.waitFor({ state: 'visible' });
  await correspondentPortalPage.bidRequestDate_Next_Bussiness_Radio_Button.waitFor({ state: 'visible' });
  await stepGroups.stepGroup_Upload_Bid_Process_from_Batch_time_Selection_to_Bid_Upload_P(page, vars);
  await expect(bidRequestDetailsPage.Submit_for_PricingEnabled).toBeVisible();
  await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await bidRequestDetailsPage.Yes_Submit_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await correspondentPortalPage.Bid_Requests_Side_Menu.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(correspondentPortalPage.Status).toContainText("Queued");
  await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
  await bidRequestConfigPage.Real_Time_Off_Radio_Button.check();
  await earlyConfigPage.Deffered_On_Radio_Button.check();
  if (true) /* Element Save Changes Button is visible */ {
    await bidRequestConfigPage.Save_Changes_Button.click();
  }
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
}
