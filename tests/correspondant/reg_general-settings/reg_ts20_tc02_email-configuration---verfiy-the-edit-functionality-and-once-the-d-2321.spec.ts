// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EmailConfigPage } from '../../../src/pages/correspondant/email-config';
import { GeneralSettingsPage } from '../../../src/pages/correspondant/general-settings';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS20_TC02';
const TC_TITLE = 'Email Configuration - Verfiy the edit Functionality and once the data is updated, accordingly values should be reflected in the UI and last modified value should get updated';
let reg_ts20_tc02_testFailed = false;
test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let emailConfigPage: EmailConfigPage;
  let generalSettingsPage: GeneralSettingsPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    emailConfigPage = new EmailConfigPage(page);
    generalSettingsPage = new GeneralSettingsPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS20_TC02_Email Configuration - Verfiy the edit Functionality and once the data is updated, accordingly values should be reflected in the UI and last modified value should get updated', async ({ page }) => {

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

      // ── Add initial email recipient ────────────────────────────────────────
      log.step('Adding initial email recipient for edit verification');
      try {
        vars["ExpectedEmail"] = appconstants.EmailforConfig;
        await correspondentPortalPage.Add_Email_Button.click();
        await page.getByText("Add Internal Recipient").waitFor({ state: 'visible' });
        await correspondentPortalPage.Email_Id_Input.fill(vars["ExpectedEmail"]);
        //vars["ExpectedEmail"] = appconstants.EmailforConfig;
        log.info(`Initial email to be added: ${vars["ExpectedEmail"]}`);
        await correspondentPortalPage.Save_ButtonEmail_Config.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Close_Buttonemail_config.click();
        log.stepPass('Initial email recipient added successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add initial email recipient');
        throw e;
      }

      // ── Verify initial email displays in UI ────────────────────────────────
      log.step('Verifying initial email displays in the UI');
      try {
        // [DISABLED] Verify that the current page displays an element Last Email Record and With Scrollable FALSE
        // await expect(emailConfigPage.Last_Email_Record).toBeVisible();
        await expect(emailConfigPage.Last_Email_Record).toContainText(appconstants.EmailforConfig);
        log.info(`Initial email record verified in UI: ${appconstants.EmailforConfig}`);
        log.stepPass('Initial email displayed in UI successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify initial email in UI');
        throw e;
      }
      vars["ExpectedEmail"] = appconstants.EditEmailforConfig;
      // ── Edit the email address ─────────────────────────────────────────────
      log.step('Editing the email address via Last Edit button');
      try {
        await generalSettingsPage.Last_Edit_Button_Email_Config.click();
        log.info(`Clicked on Last Edit button to open email editor`);
        await correspondentPortalPage.Email_Id_Input.fill(String(vars["ExpectedEmail"]));
        log.info(`Filled email field with: ${vars["ExpectedEmail"]}`);
        // [DISABLED] Enter testsigma@syslatech.com in the Email Id Input field
        // await correspondentPortalPage.Email_Id_Input.fill("testsigma@syslatech.com");
       // vars["ExpectedEmail"] = appconstants.EmailforConfig;
        log.stepPass('Email address updated in input field');
      } catch (e) {
        await log.stepFail(page, 'Failed to edit email address');
        throw e;
      }

      // ── Save edited email and verify ───────────────────────────────────────
      log.step('Saving edited email and verifying UI reflects changes');
      try {
        await correspondentPortalPage.Save_ButtonEmail_Config.click();
        log.info(`Clicked Save button for edited email`);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info(`Spinner disappeared - save operation completed`);
        await correspondentPortalPage.Close_Buttonemail_config.click();
        log.stepPass('Edited email saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save edited email');
        throw e;
      }

      // ── Verify edited email displays in UI and last modified is updated ─────
      log.step('Verifying edited email displays in UI and last modified value is updated');
      try {
        await expect(emailConfigPage.Last_Email_Record).toContainText(vars["ExpectedEmail"]);
        log.info(`Edited email record verified in UI: ${vars["ExpectedEmail"]}`);
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.stepPass('Edited email displayed in UI and last modified value updated successfully after edit');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify edited email in UI or last modified value after edit');
        throw e;
      }

      // ── Delete the edited email and verify last modified is updated ─────────
      log.step('Deleting the edited email and verifying last modified value is updated');
      try {
        await emailConfigPage.Required_Delete_Email_Button(vars["ExpectedEmail"]).click();
        log.info(`Clicked delete button for email: ${vars["ExpectedEmail"]}`);
        await emailConfigPage.Yes_Go_ahead_Button.waitFor({ state: 'visible' });
        log.info(`Confirmation dialog appeared - confirming deletion`);
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
      reg_ts20_tc02_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });
  test.afterEach(async ({ page }) => {
      log.afterTestSteps(TC_ID, reg_ts20_tc02_testFailed);
      if (reg_ts20_tc02_testFailed) {
        try {
          await page.reload();
          await page.waitForLoadState('load');
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Test failed, executing after-test steps to reset standard execution type for next tests');
          await correspondentPortalPage.Administration_Menu.click();
          await correspondentPortalPage.GeneralSettings_Menu.click();
          await correspondentPortalPage.Email_Configuration.click();
          if (await emailConfigPage.Required_Delete_Email_Button(vars["ExpectedEmail"]).isVisible()) {
          await emailConfigPage.Required_Delete_Email_Button(vars["ExpectedEmail"]).click();
          await emailConfigPage.Yes_Go_ahead_Button.waitFor({ state: 'visible' });
          await emailConfigPage.Yes_Go_ahead_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await correspondentPortalPage.Close_Buttonemail_config.click();
          log.info(`Deleted email in after-test steps: ${vars["ExpectedEmail"]}`);
          log.pass("After-test steps executed successfully");
          }
        } catch (e) {
          await log.stepFail(page, 'After-test steps failed to execute');
          throw e;
        }
      }
    });
});