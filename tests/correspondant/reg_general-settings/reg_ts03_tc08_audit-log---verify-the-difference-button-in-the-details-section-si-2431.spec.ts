// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { APP_CONSTANTS } from 'src/constants/app-constants';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { ActionsPage } from '../../../src/pages/correspondant/actions';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';


const TC_ID = "REG_TS03_TC08";
const TC_TITLE = 'Audit Log - Verify the difference button in the details section (Side by side) & (Line by Line)';


test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;
  let customerPermissionPage: CustomerPermissionPage;
  let reg_ts03_tc08_testFailed = false;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
  });

  test('REG_TS03_TC08_Audit Log - Verify the difference button in the details section  (Side by side) & (Line by Line). ', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {
        const credentials = ENV.getCredentials('internal');
        vars['Username'] = credentials.username;
        vars['Password'] = credentials.password;
        vars['CompanyName'] = APP_CONSTANTS.CompanyName1;
      // ── Login and credentials setup ────────────────────────────────────
      log.step('Logging in to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Successfully logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      // ── Navigate to Customer Permissions and disable both executions ──────
      log.step('Navigating to Customer Permissions and disabling both executions');
      try {
        await stepGroups.stepGroup_Navigating_to_Customer_Permissions_and_disabling_both_execut(page, vars);
        log.stepPass('Successfully navigated to Customer Permissions and disabled both executions');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Customer Permissions and disable executions');
        throw e;
      }

      // ── Navigate to Customer Permissions and enable both executions ───────
      log.step('Navigating to Customer Permissions and enabling both executions');
      try {
        await stepGroups.stepGroup_Navigating_to_Customer_Permissions_and_enabling_both_executi(page, vars);
        log.stepPass('Successfully navigated to Customer Permissions and enabled both executions');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Customer Permissions and enable executions');
        throw e;
      }

      // ── Click Audit Menu ───────────────────────────────────────────────
      log.step('Clicking Audit Menu');
      try {
        await generalSettingPage.Audit_Menu.click();
        log.info('Clicked Audit Menu');
        log.stepPass('Audit Menu clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Audit Menu');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────────
      log.step('Waiting for page load');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - Audit page loaded');
        log.stepPass('Audit page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
        throw e;
      }

      // ── Verify Audit Time and Date ─────────────────────────────────────
      log.step('Verifying Audit Time and Date');
      try {
        await stepGroups.stepGroup_Verifying_the_Audit_Time_and_Date(page, vars);
        log.info('Audit Time and Date verified');
        log.stepPass('Audit Time and Date verification completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Audit Time and Date');
        throw e;
      }

      // ── Verify First User Name ─────────────────────────────────────────
      log.step('Verifying First User Name');
      try {
        await expect(generalSettingPage.First_User_Name_UI.first()).toContainText(APP_CONSTANTS.TESTSIGMA_INTERNAL);
        log.info(`First User Name verified: ${APP_CONSTANTS.TESTSIGMA_INTERNAL}`);
        log.stepPass('First User Name verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify First User Name');
        throw e;
      }

      // ── Verify Config Type Column Data ─────────────────────────────────
      log.step('Verifying Config Type Column Data');
      try {
        await expect(generalSettingPage.Config_Type_Column_Data.first()).toContainText(APP_CONSTANTS.CustomerPermissionAuditText);
        log.info(`Config Type Column Data verified: ${APP_CONSTANTS.CustomerPermissionAuditText}`);
        log.stepPass('Config Type Column Data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Config Type Column Data');
        throw e;
      }

      // ── Click See the Difference Button ────────────────────────────────
      log.step('Clicking See the Difference Button');
      try {
        await correspondentPortalPage.See_the_difference_Button.click();
        log.info('Clicked See the Difference Button');
        log.stepPass('See the Difference Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click See the Difference Button');
        throw e;
      }

      // ── Wait for Side by side Button to be visible ─────────────────────
      log.step('Waiting for Side by side Button to be visible');
      try {
        await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
        log.info('Side by side Button is now visible');
        log.stepPass('Side by side Button visibility confirmed');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Side by side Button visibility');
        throw e;
      }

      // ── Verify Side by side Button is disabled ─────────────────────────
      log.step('Verifying Side by side Button is disabled');
      try {
        await expect(correspondentPortalPage.Side_by_side_Button).toBeDisabled();
        log.info('Side by side Button is disabled');
        log.stepPass('Side by side Button disabled status verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Side by side Button is disabled');
        throw e;
      }

      // ── Verify Line by line Button is enabled ──────────────────────────
      log.step('Verifying Line by line Button is enabled');
      try {
        await expect(correspondentPortalPage.Line_by_line_Button).toBeEnabled();
        log.info('Line by line Button is enabled');
        log.stepPass('Line by line Button enabled status verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Line by line Button is enabled');
        throw e;
      }

      // ── Verify Side by Side Tables are visible ──────────────────────────
      log.step('Verifying Side by Side Tables are visible');
      try {
        await expect(seeDifferencePopUpPage.Side_by_Side_Tables.first()).toBeVisible();
        log.info('Side by Side Tables are visible');
        log.stepPass('Side by Side Tables visibility verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Side by Side Tables visibility');
        throw e;
      }

      // ── Count Side by Side Tables ──────────────────────────────────────
      log.step('Counting Side by Side Tables');
      try {
        vars["SidebySideTablesCount"] = String(await seeDifferencePopUpPage.Side_by_Side_Tables.count());
        log.info(`Side by Side Tables Count: ${vars["SidebySideTablesCount"]}`);
        expect(String(vars["SidebySideTablesCount"])).toBe("2");
        log.stepPass('Side by Side Tables count verified as 2');
      } catch (e) {
        await log.stepFail(page, `Failed to verify Side by Side Tables count - Expected: 2, Got: ${vars["SidebySideTablesCount"]}`);
        throw e;
      }

      // ── Verify Expected Previous Data ──────────────────────────────────
      log.step('Verifying Expected Previous Data - Customer Permission Config');
      try {
        await expect(seeDifferencePopUpPage.Expected_Previous_DataCustomer_Permission_Config).toBeVisible();
        log.info('Expected Previous Data - Customer Permission Config is visible');
        log.stepPass('Expected Previous Data visibility verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Expected Previous Data visibility');
        throw e;
      }

      // ── Verify Expected New Data - Standard Execution ───────────────────
      log.step('Verifying Expected New Data - Standard Execution');
      try {
        await expect(seeDifferencePopUpPage.Expected_New_Data_Standard_Execution).toBeVisible();
        log.info('Expected New Data - Standard Execution is visible');
        log.stepPass('Expected New Data - Standard Execution visibility verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Expected New Data - Standard Execution visibility');
        throw e;
      }

      // ── Verify Expected New Data - Chase Execution ─────────────────────
      log.step('Verifying Expected New Data - Chase Execution');
      try {
        await expect(seeDifferencePopUpPage.Expected_New_DataChase_Execution).toBeVisible();
        log.info('Expected New Data - Chase Execution is visible');
        log.stepPass('Expected New Data - Chase Execution visibility verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Expected New Data - Chase Execution visibility');
        throw e;
      }

      // ── Verify Previous Data Background Color (rgb(255, 182, 186)) ─────
      log.step('Verifying Previous Data Background Color');
      try {
        await expect(seeDifferencePopUpPage.Expected_Previous_DataCustomer_Permission_Config).toHaveCSS('background-color', "rgb(255, 182, 186)");
        log.info('Previous Data background color verified as rgb(255, 182, 186)');
        log.stepPass('Previous Data background color verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Previous Data background color');
        throw e;
      }

      // ── Verify New Data Standard Execution Background Color ────────────
      log.step('Verifying New Data Standard Execution Background Color');
      try {
        await expect(seeDifferencePopUpPage.Expected_New_Data_Standard_Execution).toHaveCSS('background-color', "rgb(221, 255, 221)");
        log.info('New Data Standard Execution background color verified as rgb(221, 255, 221)');
        log.stepPass('New Data Standard Execution background color verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify New Data Standard Execution background color');
        throw e;
      }

      // ── Verify New Data Chase Execution Background Color ───────────────
      log.step('Verifying New Data Chase Execution Background Color');
      try {
        await expect(seeDifferencePopUpPage.Expected_New_DataChase_Execution).toHaveCSS('background-color', "rgb(221, 255, 221)");
        log.info('New Data Chase Execution background color verified as rgb(221, 255, 221)');
        log.stepPass('New Data Chase Execution background color verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify New Data Chase Execution background color');
        throw e;
      }

      // ── Click Line by line Button ──────────────────────────────────────
      log.step('Clicking Line by line Button');
      try {
        await correspondentPortalPage.Line_by_line_Button.click();
        log.info('Clicked Line by line Button');
        log.stepPass('Line by line Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Line by line Button');
        throw e;
      }

      // ── Wait for Side by side Button to be visible after toggle ────────
      log.step('Waiting for Side by side Button to be visible after toggle');
      try {
        await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
        log.info('Side by side Button is now visible');
        log.stepPass('Side by side Button visibility confirmed after toggle');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Side by side Button visibility after toggle');
        throw e;
      }

      // ── Verify Line by line Button is visible ──────────────────────────
      log.step('Verifying Line by line Button is visible');
      try {
        await expect(correspondentPortalPage.Line_by_line_Button).toBeVisible();
        log.info('Line by line Button is visible');
        log.stepPass('Line by line Button visibility verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Line by line Button visibility');
        throw e;
      }

      // ── Wait for Line by line Table to be visible ──────────────────────
      log.step('Waiting for Line by line Table to be visible');
      try {
        await seeDifferencePopUpPage.Line_by_line_Table.waitFor({ state: 'visible' });
        log.info('Line by line Table is now visible');
        log.stepPass('Line by line Table visibility confirmed');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Line by line Table visibility');
        throw e;
      }

      // ── Count Line by Line Tables ──────────────────────────────────────
      log.step('Counting Line by Line Tables');
      try {
        vars["LineByLineTableCount"] = String(await seeDifferencePopUpPage.Line_by_line_Table.count());
        log.info(`Line by Line Table Count: ${vars["LineByLineTableCount"]}`);
        expect(String(vars["LineByLineTableCount"])).toBe("1");
        log.stepPass('Line by Line Table count verified as 1');
      } catch (e) {
        await log.stepFail(page, `Failed to verify Line by Line Table count - Expected: 1, Got: ${vars["LineByLineTableCount"]}`);
        throw e;
      }

      // ── Verify Previous Data Background Color (Line by Line view) ──────
      log.step('Verifying Previous Data Background Color in Line by Line view');
      try {
        await expect(seeDifferencePopUpPage.Expected_Previous_DataCustomer_Permission_Config).toHaveCSS('background-color', "rgb(255, 182, 186)");
        log.info('Previous Data background color verified as rgb(255, 182, 186) in Line by Line view');
        log.stepPass('Previous Data background color verified in Line by Line view');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Previous Data background color in Line by Line view');
        throw e;
      }

      // ── Verify New Data Standard Execution Background Color (Line by Line view) ────
      log.step('Verifying New Data Standard Execution Background Color in Line by Line view');
      try {
        await expect(seeDifferencePopUpPage.Expected_New_Data_Standard_Execution).toHaveCSS('background-color', "rgb(221, 255, 221)");
        log.info('New Data Standard Execution background color verified as rgb(221, 255, 221) in Line by Line view');
        log.stepPass('New Data Standard Execution background color verified in Line by Line view');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify New Data Standard Execution background color in Line by Line view');
        throw e;
      }

      // ── Verify New Data Chase Execution Background Color (Line by Line view) ───────
      log.step('Verifying New Data Chase Execution Background Color in Line by Line view');
      try {
        await expect(seeDifferencePopUpPage.Expected_New_DataChase_Execution).toHaveCSS('background-color', "rgb(221, 255, 221)");
        log.info('New Data Chase Execution background color verified as rgb(221, 255, 221) in Line by Line view');
        log.stepPass('New Data Chase Execution background color verified in Line by Line view');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify New Data Chase Execution background color in Line by Line view');
        throw e;
      }

      // ── Close the Difference Pop-up ────────────────────────────────────
      log.step('Closing the Difference Pop-up');
      try {
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        log.info('Clicked Close Pop-up Button');
        log.stepPass('Difference Pop-up closed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to close Difference Pop-up');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts03_tc08_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });

  test.afterEach(async ({ page }) => {
    const CorrPortalElem = new CorrPortalPage(page);
    const actionsPage = new ActionsPage(page);
    if (reg_ts03_tc08_testFailed) {
      log.step('Executing afterEach steps for failure handling');
      log.afterTestSteps(TC_ID, reg_ts03_tc08_testFailed);
      log.info('Test failed - executing afterEach steps for failure handling');
      try {
        // ── Navigate back to Customer Permission Menu ────────────────────
        log.step('Navigating back to Customer Permission Menu in afterEach');
        try {
          await correspondentPortalPage.Administration_Menu.click();
          log.info('Clicked Administration Menu');
          await correspondentPortalPage.GeneralSettings_Menu.click();
          log.info('Clicked General Settings Menu');
          await customerPermissionPage.CustomerPermission_Menu.click();
          log.info('Clicked Customer Permission Menu');
          log.stepPass('Successfully navigated back to Customer Permission Menu');
        } catch (e) {
          await log.stepFail(page, 'Failed to navigate back to Customer Permission Menu in afterEach');
          throw e;
        }

        // ── Search for first company name in afterEach ───────────────────
        log.step('Searching for company in afterEach');
        try {
          await customerPermissionPage.Search_Filter_Input.fill(String(APP_CONSTANTS.CompanyName1));
          log.info(`Filled Search Filter Input with: ${APP_CONSTANTS.CompanyName1}`);
          await page.keyboard.press('Enter');
          log.info('Pressed Enter to search');
          log.stepPass('Successfully searched for company');
        } catch (e) {
          await log.stepFail(page, 'Failed to search for company in afterEach');
          throw e;
        }

        // ── Wait for page load ─────────────────────────────────────────
        log.step('Waiting for page load in afterEach');
        try {
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Spinner disappeared - search results loaded');
          log.stepPass('Search results loaded successfully');
        } catch (e) {
          await log.stepFail(page, 'Failed to wait for page load in afterEach');
          throw e;
        }

        // ── Click Edit Permission button ──────────────────────────────────
        log.step('Clicking Edit Permission button in afterEach');
        try {
          await customerPermissionPage.Edit_Permission_Buttonfirst_record.click();
          log.info('Clicked Edit Permission button');
          log.stepPass('Edit Permission button clicked successfully');
        } catch (e) {
          await log.stepFail(page, 'Failed to click Edit Permission button in afterEach');
          throw e;
        }

        // ── Wait for page load ─────────────────────────────────────────
        log.step('Waiting for page load after clicking Edit Permission in afterEach');
        try {
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Spinner disappeared - Edit Permissions page loaded');
          log.stepPass('Edit Permissions page loaded successfully');
        } catch (e) {
          await log.stepFail(page, 'Failed to wait for page load in afterEach');
          throw e;
        }

        // ── Restore state ────────────────────────────────────────────────────
        log.step('Restoring state in afterEach');
        try {
          if (await CorrPortalElem.Standard_Off_Radio_button.isChecked()) /* Radio button Standard Off Radio button is selected */ {
            await actionsPage.Standard_Flow_On_Button.check();
            log.info('Checked Standard_Flow_On_Button to restore state');
          }
          if (await CorrPortalElem.ChaseDirect_Off_Button.isChecked()) /* Radio button Chase On Radio(Global Restriction) is selected */ {
            await CorrPortalElem.Chase_Direct_ON_button.check();
            log.info('Checked Chase_Direct_ON_button to restore state');
          }
          if (await actionsPage.Update_Permissions_Button.isEnabled()) {
            await actionsPage.Update_Permissions_Button.click();
            log.info('Clicked Update_Permissions_Button');
          }
          log.stepPass('State restoration completed in afterEach');
        } catch (e) {
          await log.stepFail(page, 'Failed to restore state in afterEach');
          throw e;
        }

      } catch (e) {
        log.info('Error occurred during afterEach cleanup');
      }
    } else {
      log.info('Test passed - no afterEach steps needed');
    }
  });

});