import { Page} from '@playwright/test';
import { expect} from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../pages/correspondant/ok-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1381 } from './prereq-1381';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'PRE_REQ_2396(REG_TS15_TC06)';
const TC_TITLE = 'Company Config - Verify the User making the Changes, in the Input of the Internal User Username Replacement, whether it is get Reflected in the Commitment letter';

export async function runPrereq_2396(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1381(page, vars);

  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const okButtonPage = new OkButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const credentials = ENV.getCredentials('internal');

  vars['Username'] = credentials.username;
  vars['Password'] = credentials.password;

  log.tcStart(TC_ID, TC_TITLE);

  try {

    log.step('Login to CORR Portal');
    try {
      await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      log.stepPass('Login to CORR Portal successful');
    } catch (e) {
      await log.stepFail(page, 'Login to CORR Portal failed');
      throw e;
    }

    log.step('Navigate to Company Config under General Settings');
    try {
      await correspondentPortalPage.Administration_Menu.click();
      await correspondentPortalPage.GeneralSettings_Menu.click();
      await correspondentPortalPage.Company_ConfigGenral_settings.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Navigated to Company Config successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate to Company Config');
      throw e;
    }

    log.step('Capture current internal username, update to test value and save');
    try {
      await expect(correspondentPortalPage.Internal_User_Username_Replacement_Input).toHaveValue(/.+/);
      vars['UserName'] = await correspondentPortalPage.Internal_User_Username_Replacement_Input.inputValue() || '';
      log.info('UserName (before edit): ' + vars['UserName']);
      await correspondentPortalPage.Internal_User_Username_Replacement_Input.click();
      vars['UsernameUpdated'] = appconstants.USERNAME_TESTING;
      log.info('UsernameUpdated: ' + vars['UsernameUpdated']);
      await correspondentPortalPage.Internal_User_Username_Replacement_Input.clear();
      await correspondentPortalPage.Internal_User_Username_Replacement_Input.type(String(vars['UsernameUpdated']));
      await expect(correspondentPortalPage.Save_Settings).toBeEnabled();
      await correspondentPortalPage.Save_Settings.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await okButtonPage.Ok_Button.click();
      log.stepPass('Internal username updated to test value and saved successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to update or save internal username');
      throw e;
    }

    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}