// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { MarketThresholdPage } from '../../../src/pages/correspondant/market-threshold';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let marketThresholdPage: MarketThresholdPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    marketThresholdPage = new MarketThresholdPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('2268_13e8b8e54e0e4fe7a60247c957efce9d_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await correspondentPortalPage.Market_Thresholds.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      if (true) /* Element Required Threshold Delete Button is visible */ {
        await marketThresholdPage.Required_Threshold_Delete_Button.click();
        await page.waitForLoadState('networkidle');
        await correspondentPortalPage.Yes_Go_ahead_Button_Bid_Request_List.click();
      }
    }
  });
});
