// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS14_TC02_Commitment timer - Verify the Last Modified date, time and user get displayed in the screen.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await generalSettingPage.Commitment_Timer_General_Settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["MinutesBeforeEdit"] = await correspondentPortalPage.Internal_User_Minutes_Input.inputValue() || '';
    vars["NewMinToEnter"] = String(Math.floor(Math.random() * (4 - 1 + 1)) + 1);
    while (String(vars["NewMinToEnter"]) === String(vars["MinutesBeforeEdit"])) {
      vars["NewMinToEnter"] = String(Math.floor(Math.random() * (4 - 1 + 1)) + 1);
    }
    await correspondentPortalPage.Internal_User_Minutes_Input.clear();
    await correspondentPortalPage.Internal_User_Minutes_Input.fill(vars["NewMinToEnter"]);
    await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Save_Changes_Button.click();
    await page.waitForLoadState('networkidle');
    await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
    await correspondentPortalPage.Internal_User_Minutes_Input.fill(String(vars["MinutesBeforeEdit"]));
    await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Save_Changes_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  });
});
