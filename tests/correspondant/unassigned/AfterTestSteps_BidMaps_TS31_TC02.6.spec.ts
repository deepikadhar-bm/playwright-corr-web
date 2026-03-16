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

  test('1371_6e5bfcf5b3894e86b87b85635ba70bc6_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await correspondentPortalPage.Administration_Menu.click();
      await correspondentPortalPage.Bid_Maps_Menu.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await stepGroups.stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
    }
  });
});
