import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../pages/correspondant/ok-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1381 } from './prereq-1381';

export async function runPrereq_2396(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1381(page, vars);

  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const okButtonPage = new OkButtonPage(page);
  const spinnerPage = new SpinnerPage(page);



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
}
