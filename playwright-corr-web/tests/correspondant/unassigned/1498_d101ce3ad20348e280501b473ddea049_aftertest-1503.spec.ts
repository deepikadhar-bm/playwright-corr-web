// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test('1498_d101ce3ad20348e280501b473ddea049_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await correspondentPortalPage.Administration_Menu.click();
      await generalSettingPage.General_Settings.click();
      await correspondentPortalPage.Market_Thresholds.click();
      await priceOfferedPage.Edit_Map_Button.click();
      await priceOfferedPage.Minimum_Display_value.clear();
      await priceOfferedPage.Minimum_Display_value.fill("1");
      await priceOfferedPage.Maximum_Display_Value.clear();
      await priceOfferedPage.Maximum_Display_Value.fill("120");
      await priceOfferedPage.Update_Threshold_Button.click();
    }
  });
});
