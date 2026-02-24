// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test('1808_2c68baa50dc041e285e88a46be2a7296_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await correspondentPortalPage.Administration_Menu.click();
      await correspondentPortalPage.GeneralSettings_Menu.click();
      await priceOfferedPage.Other_Config.click();
      if (String(vars["CommitCorrectionCutOffBefore"]) !== String(vars["CommitCorrectionCutOffAfter"])) {
        await commitmentListPage.Correction_Cut_Off.clear();
        await commitmentListPage.Correction_Cut_Off.click();
        await commitmentListPage.Correction_Cut_Off.fill(vars["CommitCorrectionCutOffBefore"]);
        await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
        await correspondentPortalPage.Save_Changes_Button.click();
      }
    }
  });
});
