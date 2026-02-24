// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { CompanyConfigPage } from '../../../src/pages/correspondant/company-config';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EarlyConfigPage } from '../../../src/pages/correspondant/early-config';
import { MarketThresholdPage } from '../../../src/pages/correspondant/market-threshold';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let companyConfigPage: CompanyConfigPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let earlyConfigPage: EarlyConfigPage;
  let marketThresholdPage: MarketThresholdPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
    companyConfigPage = new CompanyConfigPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    earlyConfigPage = new EarlyConfigPage(page);
    marketThresholdPage = new MarketThresholdPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('Test Case To Revert Important Configs', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
    await bidRequestConfigPage.Real_Time_Off_Radio_Button.check();
    await earlyConfigPage.Deffered_On_Radio_Button.check();
    if (true) /* Element Newly Added Dropdown Input(POS) is visible */ {
      await expect(bidRequestConfigPage.Newly_Added_Dropdown_InputPOS).toBeVisible();
      await bidRequestConfigPage.Delete_Button_pos.click();
    }
    if (true) /* Element Save Changes Button is enabled */ {
      await bidRequestConfigPage.Save_Changes_Button.click();
    }
    await correspondentPortalPage.Market_Thresholds.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    while (await marketThresholdPage.Unwanted_Market_Threshold_Record.isVisible()) {
      await marketThresholdPage.Delete_Unwanted_Record_Button.click();
      await correspondentPortalPage.Yes_Go_ahead_Buttondelete.click();
      await page.waitForTimeout(5000);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    }
    await expect(marketThresholdPage.Unwanted_Market_Threshold_Record).toBeVisible();
    await correspondentPortalPage.Company_ConfigGenral_settings.click();
    await companyConfigPage.Company_Name_InputCompany_Config.waitFor({ state: 'visible' });
    vars["ConfigCompanyName"] = await companyConfigPage.Company_Name_InputCompany_Config.inputValue() || '';
    if (String(vars["ConfigCompanyName"]) !== String("Chase")) {
      await companyConfigPage.Company_Name_InputCompany_Config.fill(String("Chase"));
      await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
      await correspondentPortalPage.Save_Settings.click();
      await okButtonPage.Ok_Button.click();
    }
  });
});
