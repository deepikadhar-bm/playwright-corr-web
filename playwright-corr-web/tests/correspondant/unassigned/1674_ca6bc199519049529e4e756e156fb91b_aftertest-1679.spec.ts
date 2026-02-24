// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('1674_ca6bc199519049529e4e756e156fb91b_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await correspondentPortalPage.Administration_Menu.click();
      await correspondentPortalPage.GeneralSettings_Menu.click();
      await correspondentPortalPage.Early_Close_Config.click();
      if (true) /* Element Delete Button(Early Conf) is visible */ {
        await correspondentPortalPage.Delete_ButtonEarly_Conf.click();
        await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
        await page.reload();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("No result")).toBeVisible();
      }
    }
  });
});
