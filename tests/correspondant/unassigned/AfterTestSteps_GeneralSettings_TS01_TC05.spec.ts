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

  test('2432_87a68d73c9bb4a7391940d9883f7d97c_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await correspondentPortalPage.Early_Close_Config.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await stepGroups.stepGroup_Deleting_Early_Config_Recordsother_than_today(page, vars);
    }
  });
});
