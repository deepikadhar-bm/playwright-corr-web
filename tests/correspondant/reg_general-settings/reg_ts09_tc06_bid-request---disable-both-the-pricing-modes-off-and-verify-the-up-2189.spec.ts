// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EarlyConfigPage } from '../../../src/pages/correspondant/early-config';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let earlyConfigPage: EarlyConfigPage;
  let spinnerPage: SpinnerPage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    earlyConfigPage = new EarlyConfigPage(page);
    spinnerPage = new SpinnerPage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
  });

  test('REG_TS09_TC06_Bid Request - Disable both the pricing Modes, (OFF) and verify the Upload Bid request Button is get Visible in the Bid request screen.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.Bid_Request_Config_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestConfigPage.Real_Time_Off_Radio_Button.check();
    await bidRequestConfigPage.Deffered_Off_Radio_Button.check();
    await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
    await bidRequestConfigPage.Save_Changes_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Bid_Requests_Side_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button).toBeVisible();
    await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
    await earlyConfigPage.Real_time_On_Radio_Button.check();
    await earlyConfigPage.Deffered_On_Radio_Button.check();
    await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
    await bidRequestConfigPage.Save_Changes_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  });
});
