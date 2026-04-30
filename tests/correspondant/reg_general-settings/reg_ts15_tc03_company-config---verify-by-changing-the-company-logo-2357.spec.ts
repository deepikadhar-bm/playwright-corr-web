import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';


const TC_ID = 'REG_TS15_TC03';
const TC_TITLE = 'Company Config - Verify by changing the Company Logo';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;
  let REG_TS15_TC03testFailed = false;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
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

      log.step('Upload new company logo and save');
      try {
        await uploadFile(page, correspondentPortalPage.upload_Company_Config, fileconstants.NEW_LOGO);
        await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Save_Settings).toBeEnabled();
        await correspondentPortalPage.Save_Settings.click();
        await page.getByText('Company config updated successfully!').waitFor({ state: 'visible' });
        await okButtonPage.Ok_Button.click();
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.stepPass('New company logo uploaded and saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to upload new company logo or save');
        throw e;
      }

      log.step('Restore original company logo and save');
      try {
        await uploadFile(page, correspondentPortalPage.upload_Company_Config, fileconstants.LOGO);
        await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
        expect(correspondentPortalPage.Save_Settings).toBeEnabled();
        await correspondentPortalPage.Save_Settings.click();
        await page.getByText('Company config updated successfully!').waitFor({ state: 'visible' });
        await okButtonPage.Ok_Button.click();
        log.stepPass('Original company logo restored and saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore original company logo or save');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      REG_TS15_TC03testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS15_TC03testFailed);
    try {
      log.step('Executing after-test steps: Restore original company logo');
      if (REG_TS15_TC03testFailed) {
        await uploadFile(page, correspondentPortalPage.upload_Company_Config, fileconstants.LOGO);
        if (await correspondentPortalPage.Save_Settings.isEnabled()) /* Element Save Settings is enabled */ {
          await correspondentPortalPage.Save_Settings.click();
          await page.getByText('Company config updated successfully!').waitFor({ state: 'visible' });
          await okButtonPage.Ok_Button.waitFor({ state: 'visible' });
          await okButtonPage.Ok_Button.click();
        }
      }
      log.stepPass('After-test steps executed successfully. Original company logo restored');
    } catch (e) {
      await log.stepFail(page, 'Failed to restore original company logo in after-test steps');
      throw e;
    }
  });
});