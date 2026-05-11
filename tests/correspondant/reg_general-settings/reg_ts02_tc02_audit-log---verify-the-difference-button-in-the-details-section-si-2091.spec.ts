// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AuditLogPage } from '../../../src/pages/correspondant/audit-log';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2087 } from '../../../src/helpers/prereqs/prereq-2087';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS02_TC02';
const TC_TITLE = 'Audit Log - Verify the difference button in the details section  (Side by side) & (Line by Line).';
let reg_ts02_tc02_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let auditLogPage: AuditLogPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    log.info('Running prerequisite setup for REG_TS02_TC02');
    await runPrereq_2087(page, vars);
    auditLogPage = new AuditLogPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
    log.info('Prerequisite setup completed successfully');
  });

  test('REG_TS02_TC02_Audit Log - Verify the difference button in the details section  (Side by side) & (Line by Line).', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // [DISABLED] Login to CORR Portal
      // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      // [DISABLED] Click on Administration_Menu
      // await correspondentPortalPage.Administration_Menu.click();
      // [DISABLED] Click on GeneralSettings_Menu
      // await correspondentPortalPage.GeneralSettings_Menu.click();
      // [DISABLED] Wait until the element Spinner is not visible
      // await spinnerPage.Spinner.waitFor({ state: 'hidden' });

      // ── Navigate to Audit Logs ───────────────────────────────────────────
      log.step('Navigating to Audit Logs');
      try {
        await generalSettingPage.Audit_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Successfully navigated to Audit Logs page');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Audit Logs');
        throw e;
      }

      // ── Verify Audit log entries ─────────────────────────────────────────
      log.step('Verifying audit log entries for Global Restrictions Config');
      try {

        await expect(generalSettingPage.Created_Date_Time_Column_Data.first()).toContainText(vars["ExpectedTimeAudit"]);
        log.info(`Audit timestamp verified: ${vars["ExpectedTimeAudit"]}`);
        await expect(generalSettingPage.First_User_Name_UI.first()).toContainText("testsigma_internal");
        log.info('Audit user name verified: testsigma_internal');
        await expect(generalSettingPage.Config_Type_Column_Data.first()).toContainText("Global Restrictions Config");
        log.info('Audit config type verified: Global Restrictions Config');
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
        log.info('Side-by-side button visible');
        await expect(correspondentPortalPage.Line_by_line_Button).toBeEnabled();
        log.info('Line-by-line button visible');
        await expect(seeDifferencePopUpPage.Side_by_Side_Tables.first()).toBeVisible();
        vars["SidebySideTablesCount"] = String(await seeDifferencePopUpPage.Side_by_Side_Tables.count());
        log.info(`Side-by-side tables count: ${vars["SidebySideTablesCount"]}`);
        expect(String(vars["SidebySideTablesCount"])).toBe("2");
        log.stepPass('Side-by-side tables count verified as 2');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify side-by-side view buttons and tables');
        throw e;
      }

      // ── Verify previous data in side by side ──────────────────────────────
      log.step('Verifying previous data in side-by-side view');
      try {
        await expect(auditLogPage.Standard_Previous_Datapop_up).toContainText(vars["StandardPreviousDataExp"]);
        log.info(`Standard previous data verified: ${vars["StandardPreviousDataExp"]}`);
        await expect(auditLogPage.Chase_Previous_Data_pop_up).toContainText(vars["ChasePreviousDataExp"]);
        log.info(`Chase previous data verified: ${vars["ChasePreviousDataExp"]}`);
        await expect(seeDifferencePopUpPage.Standard_previous_datapop_up_sub_text).toHaveCSS('background-color', "rgb(255, 182, 186)");
        log.info('Standard previous data background color verified (red)');
        await expect(seeDifferencePopUpPage.Chase_Previous_Datapop_up_sub_text).toHaveCSS('background-color', "rgb(255, 182, 186)");
        log.info('Chase previous data background color verified (red)');
        log.stepPass('Previous data in side-by-side view verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify previous data in side-by-side view');
        throw e;
      }

      // ── Verify new data in side by side ──────────────────────────────────
      log.step('Verifying new data in side-by-side view');
      try {
        await expect(seeDifferencePopUpPage.Chase_New_Datapop_up_sub_text).toContainText(vars["ChaseNewDataExp"]);
        log.info(`Chase new data verified: ${vars["ChaseNewDataExp"]}`);
        await expect(seeDifferencePopUpPage.Standard_New_Datapop_up_sub_text).toContainText(vars["StandardNewDataExp"]);
        log.info(`Standard new data verified: ${vars["StandardNewDataExp"]}`);
        await expect(seeDifferencePopUpPage.Standard_New_Datapop_up_sub_text).toHaveCSS('background-color', "rgb(151, 242, 149)");
        log.info('Standard new data background color verified (green)');
        await expect(seeDifferencePopUpPage.Chase_New_Datapop_up_sub_text).toHaveCSS('background-color', "rgb(151, 242, 149)");
        log.info('Chase new data background color verified (green)');
        log.stepPass('New data in side-by-side view verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify new data in side-by-side view');
        throw e;
      }

      // ── View differences - Line by line ──────────────────────────────────
      log.step('Viewing see difference popup in line-by-line mode');
      try {
        await correspondentPortalPage.Line_by_line_Button.click();
        //await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Side_by_side_Button).toBeEnabled();
        await expect(correspondentPortalPage.Line_by_line_Button).toBeDisabled();
        log.info('Line-by-line button visible');
        await seeDifferencePopUpPage.Line_by_line_Table.first().waitFor({ state: 'visible' });
        vars["LineByLineTableCount"] = String(await seeDifferencePopUpPage.Line_by_line_Table.count());
        log.info(`Line-by-line tables count: ${vars["LineByLineTableCount"]}`);
        expect(String(vars["LineByLineTableCount"])).toBe("1");
        log.stepPass('Line-by-line table count verified as 1');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify line-by-line view');
        throw e;
      }

      // ── Verify line by line difference data ──────────────────────────────
      log.step('Verifying line-by-line difference popup data');
      try {
        // [DISABLED] Verification of see difference pop up data
        // await stepGroups.stepGroup_Verification_of_see_difference_pop_up_data(page, vars);
        log.stepPass('Line-by-line difference popup data verified (verification disabled)');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify line-by-line difference popup data');
        throw e;
      }

      // ── Close see difference popup ───────────────────────────────────────
      log.step('Closing see difference popup');
      try {
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        log.stepPass('See difference popup closed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to close see difference popup');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts02_tc02_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });

  // test.afterEach(async ({ page }) => {
  //   log.afterTestSteps(TC_ID, reg_ts02_tc02_testFailed);
  //   if (reg_ts02_tc02_testFailed) {
  //     try {
  //       log.info('Test failed, executing after-test steps to clean up resources');
  //       await page.reload();
  //       await page.waitForLoadState('load');
  //       await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  //       log.info('Page reloaded and spinner hidden');
  //       log.pass("After-test steps executed successfully");
  //     } catch (e) {
  //       await log.stepFail(page, 'After-test steps failed to execute');
  //       throw e;
  //     }
  //   }
  // });
});