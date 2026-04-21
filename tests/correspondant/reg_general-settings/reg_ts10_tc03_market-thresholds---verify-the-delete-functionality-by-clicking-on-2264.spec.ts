// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { MarketThresholdPage } from '../../../src/pages/correspondant/market-threshold';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2258 } from '../../../src/helpers/prereqs/prereq-2258';
import { Logger as log } from '../../../src/helpers/log-helper';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let marketThresholdPage: MarketThresholdPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2258(page, vars);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    marketThresholdPage = new MarketThresholdPage(page);
    spinnerPage = new SpinnerPage(page);
  });
const TC_ID = 'REG_TS10_TC03';
const TC_TITLE = 'Market Thresholds - Verify the  delete Functionality by clicking on the Delete Icon';
let reg_ts10_tc03_testFailed = false;   
  test('REG_TS10_TC03_Market Thresholds - Verify the  delete Functionality by clicking on the Delete Icon', async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try{
    await correspondentPortalPage.Market_Thresholds.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await marketThresholdPage.Required_Threshold_Delete_Button(vars["ExpectedProductCode"]).click();
        await correspondentPortalPage.Yes_Go_ahead_Buttondelete.nth(1).waitFor({ state: 'visible' });
        await correspondentPortalPage.Yes_Go_ahead_Buttondelete.nth(1).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(marketThresholdPage.Required_Threshold_Delete_Button(vars["ExpectedProductCode"])).not.toBeVisible();

      }  catch(e){
        await log.stepFail(page, 'Test step failed');
        reg_ts10_tc03_testFailed = true;
        throw e;
      }
});
test.afterEach(async ({ page }) => {
  log.afterTestSteps(TC_ID, reg_ts10_tc03_testFailed);
  try{
    if (reg_ts10_tc03_testFailed) {
      await page.reload();
      await page.waitForLoadState('load');
      await correspondentPortalPage.Administration_Menu.click();
      await correspondentPortalPage.GeneralSettings_Menu.click();
      await correspondentPortalPage.Market_Thresholds.click();
      if (await marketThresholdPage.Required_Threshold_Delete_Button(vars["ExpectedProductCode"]).isVisible()) {
        log.info('Unwanted market threshold record found - removing it');
        await marketThresholdPage.Required_Threshold_Delete_Button(vars["ExpectedProductCode"]).click();
        await correspondentPortalPage.Yes_Go_ahead_Buttondelete.nth(1).waitFor({ state: 'visible' });
        await correspondentPortalPage.Yes_Go_ahead_Buttondelete.nth(1).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(marketThresholdPage.Required_Threshold_Delete_Button(vars["ExpectedProductCode"])).not.toBeVisible();
        log.info('Unwanted market threshold record removed in after-test steps');
        log.pass("After-test steps executed successfully");
      }
    }
  } catch (e) {
    await log.stepFail(page, 'Failed to execute after-test steps');
  }

});
});