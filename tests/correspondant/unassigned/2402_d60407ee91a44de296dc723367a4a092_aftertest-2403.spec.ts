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

  test('2402_d60407ee91a44de296dc723367a4a092_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await correspondentPortalPage.Internal_User_Minutes_Input.fill(String(vars["MinutesBeforeEdit"]));
      await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
      await correspondentPortalPage.Save_Changes_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    }
  });
});
