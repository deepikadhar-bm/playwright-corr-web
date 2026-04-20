// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EmailConfigPage } from '../../../src/pages/correspondant/email-config';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS20_TC01';
const TC_TITLE = 'Email Configuration - Verfiy the add Functionality and once the data is added, accordingly it should display in the UI and last modified value should get updated';
let reg_ts20_tc01_testFailed = false;
test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let emailConfigPage: EmailConfigPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    emailConfigPage = new EmailConfigPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS20_TC01_Email Configuration - Verfiy the add Functionality and once the data is added, accordingly it should display in the UI and last modified value should get updated', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login and initial navigation ──────────────────────────────────────
      log.step('Logging in to Correspondent Portal');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Successfully logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      // ── Navigate to Email Configuration ───────────────────────────────────
      log.step('Navigating to Administration > General Settings > Email Configuration');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Email_Configuration.click();
        log.stepPass('Successfully navigated to Email Configuration page');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Email Configuration');
        throw e;
      }

      // ── Add new email recipient ────────────────────────────────────────────
      log.step('Adding a new internal email recipient');
      try {
        await correspondentPortalPage.Add_Email_Button.click();
        await page.getByText("Add Internal Recipient").waitFor({ state: 'visible' });
        await correspondentPortalPage.Email_Id_Input.pressSequentially(appconstants.EmailforConfig);
        vars["ExpectedEmail"] = appconstants.EmailforConfig;
        log.info(`Email to be added: ${vars["ExpectedEmail"]}`);
        await correspondentPortalPage.Save_ButtonEmail_Config.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Close_Buttonemail_config.click();
        log.stepPass('New internal email recipient added successfully: ' + vars["ExpectedEmail"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to add new internal email recipient');
        throw e;
      }

      // ── Verify added email displays in UI and last modified is updated ─────
      log.step('Verifying added email displays in the UI and last modified value is updated');
      try {
        // [DISABLED] Verify that the current page displays an element Last Email Record and With Scrollable FALSE
        // await expect(emailConfigPage.Last_Email_Record).toBeVisible();
        await expect(emailConfigPage.Last_Email_Record).toContainText(appconstants.EmailforConfig);
        log.info(`Email record verified in UI: ${appconstants.EmailforConfig}`);
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.stepPass('Email displayed in UI and last modified value updated successfully after add');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify email in UI or last modified value after add');
        throw e;
      }

      // ── Delete the added email and verify last modified is updated ─────────
      log.step('Deleting the added email and verifying last modified value is updated');
      try {
        await emailConfigPage.Required_Delete_Email_Button(vars["ExpectedEmail"]).click();
        await emailConfigPage.Yes_Go_ahead_Button.waitFor({ state: 'visible' });
        await emailConfigPage.Yes_Go_ahead_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info(`Email deleted: ${vars["ExpectedEmail"]}`);
        await correspondentPortalPage.Close_Buttonemail_config.click();
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.stepPass('Email deleted and last modified value updated successfully after delete');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete email or verify last modified value after delete');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts20_tc01_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });
  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, reg_ts20_tc01_testFailed);
    if (reg_ts20_tc01_testFailed) {
      try {
        await page.reload();
        await page.waitForLoadState('load');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Test failed, executing after-test steps to reset standard execution type for next tests');
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Email_Configuration.click();
        await emailConfigPage.Required_Delete_Email_Button(vars["ExpectedEmail"]).click();
        await emailConfigPage.Yes_Go_ahead_Button.waitFor({ state: 'visible' });
        await emailConfigPage.Yes_Go_ahead_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Close_Buttonemail_config.click();
        log.info(`Deleted email in after-test steps: ${vars["ExpectedEmail"]}`);
        log.pass("After-test steps executed successfully");
      } catch (e) {
        await log.stepFail(page, 'After-test steps failed to execute as the script is passed');
        throw e;
      }
    }
  });
});