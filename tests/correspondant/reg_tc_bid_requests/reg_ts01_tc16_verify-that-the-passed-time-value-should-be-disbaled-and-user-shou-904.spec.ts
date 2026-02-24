// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
  });

  test('REG_TS01_TC16_Verify that the passed time value should be disbaled and user should not be allowed to select.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Modifying_Batch_Intervals_For_Passed_Time(page, vars);
    await stepGroups.stepGroup_Writing_past_time_into_tdp(page, vars);
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Bid Requests")).toBeVisible();
    await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Past_time_disable_verification_in_bidrequest_dropdown(page, vars);
    await statusInactivePage.Back_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Bulk_Batch_Timing.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Modifying_The_Batch_Intervals(page, vars);
  });
});
