// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
  });

  test('904_f8203f694aa348eab99a5b0d28fbc085_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await correspondentPortalPage.Administration_Menu.click();
      await correspondentPortalPage.GeneralSettings_Menu.click();
      await page.waitForLoadState('networkidle');
      await correspondentPortalPage.Bulk_Batch_Timing.click();
      await page.waitForLoadState('networkidle');
      await stepGroups.stepGroup_Modifying_The_Batch_Intervals(page, vars);
    }
  });
});
