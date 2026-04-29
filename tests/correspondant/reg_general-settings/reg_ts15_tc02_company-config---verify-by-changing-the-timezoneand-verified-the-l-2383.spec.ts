import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CompanyConfigPage } from '../../../src/pages/correspondant/company-config';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { AddonHelpers } from '@helpers/AddonHelpers';


const TC_ID = 'REG_TS15_TC02';
const TC_TITLE = 'Company Config - Verify by changing the timezone and verified the last Modified date, time and user data';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let companyConfigPage: CompanyConfigPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;
  let REG_TS15_TC02testFailed = false;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    companyConfigPage = new CompanyConfigPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
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

      log.step('Navigate to Bid Requests and capture uploaded time before timezone change');
      try {
        await correspondentPortalPage.Reports_Dropdown.click();
        await correspondentPortalPage.Bid_Requests_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['UploadedTimeBeforeEdit'] = await correspondentPortalPage.Uploaded_Time.first().textContent() || '';
        Methods.trimtestdata(vars['UploadedTimeBeforeEdit'], 'UploadedTimeBeforeEdit');
        log.info('Uploaded Time Before Edit: ' + vars['UploadedTimeBeforeEdit']);
        Methods.subtractMinutesFromDatetime(vars['UploadedTimeBeforeEdit'], appconstants.TIME_FORMAT_HMMA, 180, appconstants.TIME_FORMAT_HMMA, 'ExpectedUploadedTime');
        log.info('ExpectedUploadedTime: ' + vars['ExpectedUploadedTime']);

        log.stepPass('Navigated to Bid Requests and uploaded time captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Requests or capture uploaded time');
        throw e;
      }

      log.step('Navigate to Company Config and change timezone to America/Los_Angeles');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Company_ConfigGenral_settings.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Toggle_dropdown_Dropdown.click();
        await generalSettingPage.Time_Zone_OptionLosAngeles.scrollIntoViewIfNeeded();
        await generalSettingPage.Time_Zone_OptionLosAngeles.click();
        await expect(correspondentPortalPage.Toggle_dropdown_Dropdown).toContainText(appconstants.AMERICA_LOS_ANGELES);
        log.stepPass('Navigated to Company Config and timezone changed to America/Los_Angeles successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Company Config or change timezone to America/Los_Angeles');
        throw e;
      }

      log.step('Save timezone change and verify last modified data');
      try {
        await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
        await correspondentPortalPage.Save_Settings.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await okButtonPage.Ok_Button.click();
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.stepPass('Timezone change saved and last modified data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save timezone change or verify last modified data');
        throw e;
      }

      log.step('Navigate to Bid Requests and verify uploaded time after timezone change');
      try {
        await correspondentPortalPage.Reports_Dropdown.click();
        await correspondentPortalPage.Bid_Requests_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['UploadedTimeAfterEdit'] = await correspondentPortalPage.Uploaded_Time.first().textContent() || '';
        Methods.trimtestdata(vars['UploadedTimeAfterEdit'], 'ActualUploadedTime');
        log.info('UploadedTimeAfterEdit: ' + vars['UploadedTimeAfterEdit']);
        log.info('ActualUploadedTime: ' + vars['ActualUploadedTime']);
        expect(Methods.verifyString(vars['ExpectedUploadedTime'], 'equals', vars['ActualUploadedTime']));
        log.stepPass('Uploaded time after timezone change verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify uploaded time after timezone change');
        throw e;
      }

      log.step('Navigate to Company Config and restore timezone to America/New_York');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Company_ConfigGenral_settings.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Toggle_dropdown_Dropdown.click();
        await correspondentPortalPage.Time_Zone_OptionAmericaNew_York.scrollIntoViewIfNeeded();
        await correspondentPortalPage.Time_Zone_OptionAmericaNew_York.click();
        await expect(correspondentPortalPage.Toggle_dropdown_Dropdown).toContainText(appconstants.AMERICA_NEW_YORK);
        await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
        expect(correspondentPortalPage.Save_Settings).toBeEnabled();
        await correspondentPortalPage.Save_Settings.click();
        log.stepPass('Timezone restored to America/New_York successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore timezone to America/New_York');
        throw e;
      }
      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      REG_TS15_TC02testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS15_TC02testFailed);
    try {
      log.step('Executing after-test steps: Restore timezone to America/New_York');
      if (REG_TS15_TC02testFailed) {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Company_ConfigGenral_settings.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Toggle_dropdown_Dropdown.click();
        await correspondentPortalPage.Time_Zone_OptionAmericaNew_York.scrollIntoViewIfNeeded();
        await correspondentPortalPage.Time_Zone_OptionAmericaNew_York.click();
        await expect(correspondentPortalPage.Toggle_dropdown_Dropdown).toContainText(appconstants.AMERICA_NEW_YORK);
        if (await correspondentPortalPage.Save_Settings.isEnabled()) /* Element Save Settings is enabled */ {
          log.info('Save Settings is enabled');
          await correspondentPortalPage.Save_Settings.click();
          await page.getByText('Company config updated successfully!').waitFor({ state: 'visible' });
          await okButtonPage.Ok_Button.waitFor({ state: 'visible' });
          await okButtonPage.Ok_Button.click();
        }
      }
      log.stepPass('After-test steps executed successfully. Timezone restored to America/New_York');
    } catch (e) {
      await log.stepFail(page, 'Failed to restore timezone to America/New_York in after-test steps');
      throw e;
    }
  });
});