import type { Page } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CompanyConfigPage } from '../../pages/correspondant/company-config';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../pages/correspondant/ok-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'PRE_REQ_2342(REG_TS15_TC01)';
const TC_TITLE = 'Company Config - Verify the User can add/ edit the Values in the Inputs.';

export async function runPrereq_2342(page: Page, vars: Record<string, string>): Promise<void> {
  const companyConfigPage = new CompanyConfigPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const okButtonPage = new OkButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  let REG_TS15_TC01testFailed = false;
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

    log.step('Capture current company name, update to test value and save');
    try {
      await companyConfigPage.Company_Name_InputCompany_Config.click();
      vars['CompanyBeforeEdit'] = await companyConfigPage.Company_Name_InputCompany_Config.inputValue() || '';
      log.info('CompanyBeforeEdit: ' + vars['CompanyBeforeEdit']);
      await companyConfigPage.Company_Name_InputCompany_Config.fill(appconstants.COMPANY_TESTING);
      vars['CompanyPreviousDataExp'] = appconstants.COMPANY_TESTING;
      log.info('CompanyPreviousDataExp: ' + vars['CompanyPreviousDataExp']);
      await correspondentPortalPage.Save_Settings.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await okButtonPage.Ok_Button.click();
      await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
      log.stepPass('Company name updated to test value and saved successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to update or save company name');
      throw e;
    }

    log.step('Capture current internal username, update to test value and save');
    try {
      vars['InternalUserNameBeforeEdit'] = await correspondentPortalPage.Internal_User_Username_Replacement_Input.inputValue() || '';
      log.info('InternalUserNameBeforeEdit: ' + vars['InternalUserNameBeforeEdit']);
      await correspondentPortalPage.Internal_User_Username_Replacement_Input.fill(appconstants.INTERNALUSER_TESTING);
      vars['InternalUserPreviousDataExp'] = appconstants.INTERNALUSER_TESTING;
      log.info('InternalUserPreviousDataExp: ' + vars['InternalUserPreviousDataExp']);
      await correspondentPortalPage.Save_Settings.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await okButtonPage.Ok_Button.click();
      await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
      log.stepPass('Internal username updated to test value and saved successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to update or save internal username');
      throw e;
    }

    log.step('Restore original company name and internal username and save');
    try {
      await companyConfigPage.Company_Name_InputCompany_Config.fill(String(vars['CompanyBeforeEdit']));
      vars['CompanyNewDataExp'] = vars['CompanyBeforeEdit'];
      log.info('CompanyNewDataExp: ' + vars['CompanyNewDataExp']);
      await correspondentPortalPage.Internal_User_Username_Replacement_Input.fill(String(vars['InternalUserNameBeforeEdit']));
      vars['InternalUserNewDataExp'] = vars['InternalUserNameBeforeEdit'];
      log.info('InternalUserNewDataExp: ' + vars['InternalUserNewDataExp']);
      await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
      await correspondentPortalPage.Save_Settings.click();
      await page.getByText('Company config updated successfully!').waitFor({ state: 'visible' });
      await okButtonPage.Ok_Button.click();
      log.stepPass('Original company name and internal username restored and saved successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to restore original company name and internal username');
      throw e;
    }

    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    REG_TS15_TC01testFailed = true;
    log.tcEnd('FAIL');
    throw e;

  } finally {
    log.afterTestSteps(TC_ID, REG_TS15_TC01testFailed);
    try {
      log.step('Executing after-test steps: Restore company config to original values');
      if (REG_TS15_TC01testFailed) {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Company_ConfigGenral_settings.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await companyConfigPage.Company_Name_InputCompany_Config.fill(String(vars['CompanyBeforeEdit']));
        await correspondentPortalPage.Internal_User_Username_Replacement_Input.fill(String(vars['InternalUserNameBeforeEdit']));
        await correspondentPortalPage.Save_Settings.click();
        await page.getByText('Company config updated successfully!').waitFor({ state: 'visible' });
        await okButtonPage.Ok_Button.click();
      }
      log.stepPass('After-test steps executed successfully. Company config restored to original values');
    } catch (e) {
      await log.stepFail(page, 'Failed to restore company config to original values in after-test steps');
      throw e;
    }
  }
}