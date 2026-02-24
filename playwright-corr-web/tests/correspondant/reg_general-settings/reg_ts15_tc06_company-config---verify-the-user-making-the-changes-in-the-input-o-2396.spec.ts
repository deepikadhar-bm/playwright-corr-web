// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1381 } from '../../../src/helpers/prereqs/prereq-1381';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1381(page, vars);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS15_TC06_Company Config - Verify the User making the Changes, in the Input of the Internal User Username Replacement, whether it is get Reflected in the Commitment letter', async ({ page }) => {

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Company_ConfigGenral_settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["UserName"] = await correspondentPortalPage.Internal_User_Username_Replacement_Input.inputValue() || '';
    await correspondentPortalPage.Internal_User_Username_Replacement_Input.click();
    vars["UsernameUpdated"] = "Username_tesing";
    await correspondentPortalPage.Internal_User_Username_Replacement_Input.fill(String(vars["UsernameUpdated"]));
    await correspondentPortalPage.Save_Settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await okButtonPage.Ok_Button.click();
  });
});
