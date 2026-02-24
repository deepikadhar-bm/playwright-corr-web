// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1313 } from '../../../src/helpers/prereqs/prereq-1313';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1313(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS30_TC01_Verifying the Cancel Button is enabled for Ready For Pricing and Qued for next bussiness day statuses', async ({ page }) => {

    await expect(bidRequestListPage.Respective_Bid_Cancel_Button_list).toBeVisible();
    await bidRequestListPage.Request_Id_From_list.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestDetailsPage.Yes_Submit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestListPage.Respective_Bid_Cancel_Button_list).toBeVisible();
  });
});
