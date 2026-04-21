// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EmailConfigPage } from '../../../src/pages/correspondant/email-config';
import { GeneralSettingsPage } from '../../../src/pages/correspondant/general-settings';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { APP_CONSTANTS } from 'src/constants/app-constants';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS20_TC03';
const TC_TITLE = 'Email Configuration - Verify the System should not allow Duplicate email entries in add and edit flow';
let reg_ts20_tc03_testFailed = false;

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

  test('REG_TS20_TC03_Email Configuration - Verify the System should not allow Duplicate email entries in add and edit flow', async ({ page }) => {

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
        log.info('Clicked Administration Menu');
        await correspondentPortalPage.GeneralSettings_Menu.click();
        log.info('Clicked General Settings Menu');
        await correspondentPortalPage.Email_Configuration.click();
        log.info('Clicked Email Configuration');
        log.stepPass('Successfully navigated to Email Configuration page');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Email Configuration');
        throw e;
      }

      // ── Add first email entry ──────────────────────────────────────────────
      log.step('Adding first email entry for duplicate validation test');
      try {
        await correspondentPortalPage.Add_Email_Button.click();
        log.info('Clicked Add Email button');
        vars["ExpectedEmail"] = APP_CONSTANTS.EmailforConfig;
        await page.getByText("Add Internal Recipient").waitFor({ state: 'visible' });
        log.info('Add Internal Recipient dialog appeared');
        await correspondentPortalPage.Email_Id_Input.fill(vars["ExpectedEmail"]);
        log.info(`Filled email field with: ${vars["ExpectedEmail"]}`);
        //vars["DuplicateEmail"] = "testsigma@sysla.com";
        // vars["ExpectedEmail"] = vars["DuplicateEmail"];
        await correspondentPortalPage.Save_ButtonEmail_Config.click();
        log.info('Clicked Save button for first email entry');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - first email saved');
        await correspondentPortalPage.Close_Buttonemail_config.click();
        log.info('Closed email configuration dialog');
        log.stepPass('First email entry added successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add first email entry');
        throw e;
      }

      // ── Verify first email displays in UI ──────────────────────────────────
      log.step('Verifying first email displays in the UI');
      try {
        // [DISABLED] Verify that the current page displays an element Last Email Record and With Scrollable FALSE
        // await expect(emailConfigPage.Last_Email_Record).toBeVisible();
        await expect(emailConfigPage.Last_Email_Record).toContainText(vars["ExpectedEmail"]);
        log.info(`First email record verified in UI: ${vars["ExpectedEmail"]}`);
        log.stepPass('First email displayed in UI successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify first email in UI');
        throw e;
      }

      // ── Attempt to add duplicate email in ADD flow ─────────────────────────
      log.step('Attempting to add duplicate email entry - should show error');
      try {
        vars["DuplicateEmail"] = vars["ExpectedEmail"];
        log.info(`Duplicate email to test: ${vars["DuplicateEmail"]}`);
        await correspondentPortalPage.Add_Email_Button.click();
        log.info('Clicked Add Email button for duplicate attempt');
        await page.getByText("Add Internal Recipient").waitFor({ state: 'visible' });
        log.info('Add Internal Recipient dialog appeared');
        await correspondentPortalPage.Email_Id_Input.fill(vars["DuplicateEmail"]);
        log.info(`Filled email field with duplicate: ${vars["DuplicateEmail"]}`);
        //vars["ExpectedEmail"] = vars["DuplicateEmail"];
        await correspondentPortalPage.Save_ButtonEmail_Config.click();
        log.info('Clicked Save button for duplicate email entry');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared after attempting to save duplicate');
        await page.getByText("Internal recipients must be unique.").waitFor({ state: 'visible' });
        log.info('Duplicate email error message displayed: "Internal recipients must be unique."');
        await correspondentPortalPage.Close_Buttonemail_config.click();
        log.info('Closed email configuration dialog');
        log.stepPass('Duplicate email validation in ADD flow working correctly - error message displayed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify duplicate email validation in ADD flow');
        throw e;
      }

      // ── Attempt to edit email to duplicate in EDIT flow ────────────────────
      log.step('Attempting to edit email to duplicate value in EDIT flow - should disable save button');
      try {
        // [DISABLED] Verifying the Last Modified Data In the Right corner screen
        // await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.info('Opening email editor to test duplicate validation in EDIT flow');
        await generalSettingsPage.Last_Edit_Button_Email_Config.click();
        log.info('Clicked Last Edit button to open email editor');
        //vars["DuplicateEmail"] = await correspondentPortalPage.Email_Id_Input.textContent() || '';
        await correspondentPortalPage.Email_Id_Input.fill(vars["DuplicateEmail"]);
        log.info(`Filled email field with duplicate value: ${vars["DuplicateEmail"]}`);
        await expect(correspondentPortalPage.Save_ButtonEmail_Config).toBeDisabled();
        log.info('Save button is disabled as expected for duplicate email in EDIT flow');
        log.stepPass('Duplicate email validation in EDIT flow working correctly - Save button disabled');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify duplicate email validation in EDIT flow');
        throw e;
      }

      // ── Close edit dialog ──────────────────────────────────────────────────
      log.step('Closing edit dialog without saving');
      try {
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        log.info('Clicked close button to close edit dialog');
        log.stepPass('Edit dialog closed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to close edit dialog');
        throw e;
      }

      // ── Delete the test email ──────────────────────────────────────────────
      log.step('Deleting the test email entry and verifying last modified value is updated');
      try {
        await emailConfigPage.Required_Delete_Email_Button(vars["ExpectedEmail"]).click();
        log.info(`Clicked delete button for email: ${vars["ExpectedEmail"]}`);
        await emailConfigPage.Yes_Go_ahead_Button.waitFor({ state: 'visible' });
        log.info('Confirmation dialog appeared - confirming deletion');
        await emailConfigPage.Yes_Go_ahead_Button.click();
        log.info('Clicked Yes to confirm deletion');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info(`Email deleted: ${vars["ExpectedEmail"]}`);
        // [DISABLED] Verifying the Last Modified Data In the Right corner screen
        // await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.stepPass('Test email deleted successfully after duplicate validation tests');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete test email');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts20_tc03_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, reg_ts20_tc03_testFailed);
    if (reg_ts20_tc03_testFailed) {
      try {
        await page.reload();
        await page.waitForLoadState('load');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Test failed, executing after-test steps to reset state for next tests');
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Email_Configuration.click();
        if (await emailConfigPage.Required_Delete_Email_Button(vars["ExpectedEmail"]).isVisible()) {
          await emailConfigPage.Required_Delete_Email_Button(vars["ExpectedEmail"]).click();
          await emailConfigPage.Yes_Go_ahead_Button.waitFor({ state: 'visible' });
          await emailConfigPage.Yes_Go_ahead_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
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