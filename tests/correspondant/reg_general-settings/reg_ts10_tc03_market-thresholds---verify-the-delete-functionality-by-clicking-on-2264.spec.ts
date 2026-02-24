// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { MarketThresholdPage } from '../../../src/pages/correspondant/market-threshold';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2262 } from '../../../src/helpers/prereqs/prereq-2262';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let marketThresholdPage: MarketThresholdPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2262(page, vars);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    marketThresholdPage = new MarketThresholdPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS10_TC03_Market Thresholds - Verify the  delete Functionality by clicking on the Delete Icon', async ({ page }) => {

    await correspondentPortalPage.Market_Thresholds.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await marketThresholdPage.Required_Threshold_Delete_Button.click();
    await correspondentPortalPage.Yes_Go_ahead_Buttondelete.waitFor({ state: 'visible' });
    await correspondentPortalPage.Yes_Go_ahead_Buttondelete.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(marketThresholdPage.Required_Threshold_Delete_Button).toBeVisible();
  });
});
