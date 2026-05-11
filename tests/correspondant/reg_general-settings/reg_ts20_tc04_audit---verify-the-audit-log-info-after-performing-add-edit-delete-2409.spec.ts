// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EmailConfigPage } from '../../../src/pages/correspondant/email-config';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { APP_CONSTANTS, APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
//import { AddonHelpers, AddonHelpers as Methods } from '../../../src/helpers/AddonHelpers';
import { AddonHelpers, AddonHelpers as Methods} from '../../../src/helpers/AddonHelpers';

const TC_ID = 'REG_TS20_TC04';
const TC_TITLE = 'Audit - Verify the Audit log info after performing Add / Edit / Delete actions then accordingly the logs should be reflected in Audit logs';
let reg_ts20_tc04_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let Methods: AddonHelpers;
  let correspondentPortalPage: CorrespondentPortalPage;
  let emailConfigPage: EmailConfigPage;
  let generalSettingPage: GeneralSettingPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    Methods = new AddonHelpers(page, vars);

    correspondentPortalPage = new CorrespondentPortalPage(page);
    emailConfigPage = new EmailConfigPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
  });
//const Methods = new AddonHelpers();
  test('REG_TS20_TC04_Audit - Verify the Audit log info after performing Add / Edit / Delete actions then accordingly the logs should be reflected in Audit logs', async ({ page }) => {
    
    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login to Correspondent Portal ────────────────────────────────────
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
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Email_Configuration.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Successfully navigated to Email Configuration page');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Email Configuration');
        throw e;
      }

      // ── Add new email recipient ────────────────────────────────────────────
      log.step('Adding a new internal email recipient');
      try {
        await correspondentPortalPage.Add_Email_Button.waitFor({ state: 'visible' });
        await correspondentPortalPage.Add_Email_Button.click();
        await page.getByText("Add Internal Recipient").waitFor({ state: 'visible' });
        await correspondentPortalPage.Email_Id_Input.fill(APP_CONSTANTS.EmailforConfig);
        vars["ExpectedEmail"] = APP_CONSTANTS.EmailforConfig;
        log.info(`Email to be added: ${vars["ExpectedEmail"]}`);
        await correspondentPortalPage.Save_ButtonEmail_Config.click();
        log.stepPass('New internal email recipient added successfully: ' + vars["ExpectedEmail"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to add new internal email recipient');
        throw e;
      }

      // ── Generate expected time audit value ────────────────────────────────
      log.step('Generating expected time audit value');
      try {
        Methods.getCurrentTimestamp("MM/dd/yyyy hh:mm a", "ExpectedTimeAudit", "UTC");
        log.info(`Expected audit time generated: ${vars["ExpectedTimeAudit"]}`);
        log.stepPass('Expected time audit value generated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to generate expected time audit value');
        throw e;
      }

      // ── Wait for spinner and close email config ───────────────────────────
      log.step('Waiting for spinner and closing email configuration');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Close_Buttonemail_config.click();
        log.stepPass('Spinner hidden and email configuration closed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner or close email configuration');
        throw e;
      }

      // ── Verify added email displays in UI ────────────────────────────────
      log.step('Verifying added email displays in the UI');
      try {
        await expect(emailConfigPage.Last_Email_Record).toContainText(vars["ExpectedEmail"]);
        log.info(`Email record verified in UI: ${vars["ExpectedEmail"]}`);
        log.stepPass('Email displayed in UI successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify email in UI');
        throw e;
      }

      // ── Navigate to Audit Logs ───────────────────────────────────────────
      log.step('Navigating to Administration > General Settings > Audit Logs');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await generalSettingPage.Audit_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Successfully navigated to Audit Logs page');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Audit Logs');
        throw e;
      }

      // ── Verify Audit log entries ─────────────────────────────────────────
      log.step('Verifying audit log entries for created email');
      try {
        await expect(generalSettingPage.Created_Date_Time_Column_Data.first()).toContainText(vars["ExpectedTimeAudit"]);
        log.info(`Audit timestamp verified: ${vars["ExpectedTimeAudit"]}`);
        await expect(generalSettingPage.First_User_Name_UI.first()).toContainText("testsigma_internal\t\r");
        log.info('Audit user name verified: testsigma_internal');
        await expect(generalSettingPage.Config_Type_Column_Data.first()).toContainText("Email Config");
        log.info('Audit config type verified: Email Config');
        log.stepPass('All audit log entries verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify audit log entries');
        throw e;
      }

      // ── View differences - Side by side ──────────────────────────────────
      log.step('Viewing see difference popup in side-by-side mode');
      try {
        await correspondentPortalPage.See_the_difference_Button.click();
        await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Side_by_side_Button).toBeDisabled();
        await expect(correspondentPortalPage.Line_by_line_Button).toBeEnabled();
        await expect(seeDifferencePopUpPage.Side_by_Side_Tables.nth(1)).toBeVisible();
        vars["SidebySideTablesCount"] = String(await seeDifferencePopUpPage.Side_by_Side_Tables.count());
        log.info(`Side-by-side tables count: ${vars["SidebySideTablesCount"]}`);
        expect(String(vars["SidebySideTablesCount"])).toBe("2");
        await expect(seeDifferencePopUpPage.Side_by_Side_New_Data_TableSee_Difference).toContainText(vars["ExpectedEmail"]);
        log.info(`New data in side-by-side view verified: ${vars["ExpectedEmail"]}`);
        await expect(seeDifferencePopUpPage.Previous_data_empty_email_field).toBeVisible();
        log.info('Previous data field verified as empty');
        log.stepPass('Side-by-side difference view verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify side-by-side difference view');
        throw e;
      }

      // ── View differences - Line by line ──────────────────────────────────
      log.step('Viewing see difference popup in line-by-line mode');
      try {
        await correspondentPortalPage.Line_by_line_Button.click();
        await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Line_by_line_Button).toBeVisible();
        await seeDifferencePopUpPage.Line_by_line_Table.waitFor({ state: 'visible' });
        vars["LineByLineTableCount"] = String(await seeDifferencePopUpPage.Line_by_line_Table.count());
        log.info(`Line-by-line tables count: ${vars["LineByLineTableCount"]}`);
        expect(String(vars["LineByLineTableCount"])).toBe("1");
        await expect(seeDifferencePopUpPage.Email_New_Data_Line_by_line).toContainText(vars["ExpectedEmail"]);
        log.info(`New data in line-by-line view verified: ${vars["ExpectedEmail"]}`);
        log.stepPass('Line-by-line difference view verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify line-by-line difference view');
        throw e;
      }

      // ── Close see difference popup and delete email ──────────────────────
      log.step('Closing see difference popup and deleting added email');
      try {
        // [DISABLED] Verification of see difference pop up data
        // await stepGroups.stepGroup_Verification_of_see_difference_pop_up_data(page, vars);
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        await correspondentPortalPage.Email_Configuration.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Deleting_added_email_from_email_config(page, vars);
        log.info(`Email deleted: ${vars["ExpectedEmail"]}`);
        log.stepPass('See difference popup closed and email deleted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to close popup or delete email');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts20_tc04_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, reg_ts20_tc04_testFailed);
    if (reg_ts20_tc04_testFailed) {
      try {
        log.info('Test failed, executing after-test steps to clean up resources');
        await page.reload();
        await page.waitForLoadState('load');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Page reloaded and spinner hidden');
        await correspondentPortalPage.Administration_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Email_Configuration.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Deleting_added_email_from_email_config(page, vars);
        log.info(`Deleted email in after-test steps: ${vars["ExpectedEmail"]}`);
        log.pass("After-test steps executed successfully");
      } catch (e) {
        await log.stepFail(page, 'After-test steps failed to execute');
        throw e;
      }
    }
  });
});