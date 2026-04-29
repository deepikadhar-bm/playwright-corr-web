// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { EditPermissionsPage } from '../../../src/pages/correspondant/edit-permissions';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { GeneralSettingsPage } from '../../../src/pages/correspondant/general-settings';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { ActionsPage, CrossButtonPage } from '@pages/correspondant';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS } from 'src/constants/app-constants';
import { clear } from 'console';

const TC_ID = 'REG_TS03_TC04';
const TC_TITLE = 'Customer Permission - Verify the bulk change action';
let reg_ts03_tc04_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let editPermissionsPage: EditPermissionsPage;
  let generalSettingPage: GeneralSettingPage;
  let generalSettingsPage: GeneralSettingsPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let CrossbuttonPage: CrossButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    editPermissionsPage = new EditPermissionsPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    generalSettingsPage = new GeneralSettingsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    CrossbuttonPage = new CrossButtonPage(page);
  });

  test('REG_TS03_TC04_Customer Permission - Verify the bulk change action.', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login and credentials setup ────────────────────────────────────
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

      // ── Navigate to Administration Menu ──────────────────────────────
      log.step('Navigating to Administration Menu');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        log.info('Clicked Administration Menu');
        log.stepPass('Successfully navigated to Administration Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Administration Menu');
        throw e;
      }

      // ── Navigate to General Settings Menu ───────────────────────────
      log.step('Navigating to General Settings Menu');
      try {
        await correspondentPortalPage.GeneralSettings_Menu.click();
        log.info('Clicked General Settings Menu');
        log.stepPass('Successfully navigated to General Settings Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to General Settings Menu');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for page load');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
        throw e;
      }

      // ── Navigate to Customer Permission Menu ──────────────────────────
      log.step('Navigating to Customer Permission Menu');
      try {
        await customerPermissionPage.CustomerPermission_Menu.click();
        log.info('Clicked Customer Permission Menu');
        log.stepPass('Successfully navigated to Customer Permission Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Customer Permission Menu');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for Customer Permission page load');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - Customer Permission page loaded');
        log.stepPass('Customer Permission page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Customer Permission page load');
        throw e;
      }

      // ── Check Company Checkbox 1 ───────────────────────────────────────
      log.step('Checking Company Checkbox 1');
      try {
        await generalSettingsPage.Company_Check_box1customer_permissions.check();
        log.info('Checked Company Checkbox 1');
        log.stepPass('Company Checkbox 1 checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to check Company Checkbox 1');
        throw e;
      }

      // ── Verify Company Checkbox 1 is visible ───────────────────────────
      log.step('Verifying Company Checkbox 1 is visible');
      try {
        await expect(generalSettingsPage.Company_Check_box1customer_permissions).toBeVisible();
        log.info('Company Checkbox 1 is visible');
        log.stepPass('Company Checkbox 1 visibility verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Company Checkbox 1 visibility');
        throw e;
      }

      // ── Extract Expected Company Name 1 ────────────────────────────────
      log.step('Extracting Expected Company Name 1');
      try {
        vars["ExpectedCompanyName1"] = await customerPermissionPage.Company_Name1other_than_HomeSweet.textContent() || '';
        log.info(`Expected Company Name 1 extracted: ${vars["ExpectedCompanyName1"]}`);
        log.stepPass('Expected Company Name 1 extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract Expected Company Name 1');
        throw e;
      }
      vars["PreviousStandardStateC1"] = await customerPermissionPage.Company_1_Standard_State(vars["ExpectedCompanyName1"]).textContent() || '';
      vars["PreviousChaseStateC1"] = await customerPermissionPage.Company_1_Chase_State(vars["ExpectedCompanyName1"]).textContent() || '';

      // ── Check Company Checkbox 2 ───────────────────────────────────────
      log.step('Checking Company Checkbox 2');
      try {
        await generalSettingPage.Company_Check_Box_2customer_permissions.check();
        log.info('Checked Company Checkbox 2');
        log.stepPass('Company Checkbox 2 checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to check Company Checkbox 2');
        throw e;
      }

      // ── Verify Company Checkbox 2 is visible ───────────────────────────
      log.step('Verifying Company Checkbox 2 is visible');
      try {
        await expect(generalSettingPage.Company_Check_Box_2customer_permissions).toBeVisible();
        log.info('Company Checkbox 2 is visible');
        log.stepPass('Company Checkbox 2 visibility verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Company Checkbox 2 visibility');
        throw e;
      }

      // ── Extract Expected Company Name 2 ────────────────────────────────
      log.step('Extracting Expected Company Name 2');
      try {
        vars["ExpectedCompanyName2"] = await customerPermissionPage.Company_Name2Other_than_Home_Sweet.textContent() || '';
        log.info(`Expected Company Name 2 extracted: ${vars["ExpectedCompanyName2"]}`);
        log.stepPass('Expected Company Name 2 extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract Expected Company Name 2');
        throw e;
      }
      vars["PreviousStandardStateC2"] = await customerPermissionPage.Company_2_Standard_State(vars["ExpectedCompanyName2"]).textContent() || '';
      vars["PreviousChaseStateC2"] = await customerPermissionPage.Company_2_Chase_State(vars["ExpectedCompanyName2"]).textContent() || '';

      // ── Wait for Bulk Change Button and click ──────────────────────────
      log.step('Waiting for Bulk Change Button');
      try {
        await customerPermissionPage.Bulk_Change_Button.waitFor({ state: 'visible' });
        log.info('Bulk Change Button is now visible');
        log.stepPass('Bulk Change Button is visible');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Bulk Change Button');
        throw e;
      }

      // ── Click Bulk Change Button ───────────────────────────────────────
      log.step('Clicking Bulk Change Button');
      try {
        await customerPermissionPage.Bulk_Change_Button.click();
        log.info('Clicked Bulk Change Button');
        log.stepPass('Bulk Change Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Bulk Change Button');
        throw e;
      }

      // ── Wait for Standard_Off_Radio_button to be visible ────────────────
      log.step('Waiting for Standard_Off_Radio_button to be visible');
      try {
        await editPermissionsPage.Standard_Off_Radio_button.waitFor({ state: 'visible' });
        log.info('Standard_Off_Radio_button is now visible');
        log.stepPass('Standard_Off_Radio_button visibility confirmed');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Standard_Off_Radio_button visibility');
        throw e;
      }

      // ── Extract and verify actual first company name ────────────────────
      log.step('Extracting actual first company name from bulk change popup');
      try {
        vars["ActualFirstCompanyName"] = await customerPermissionPage.First_Companybulk_change_pop_up.textContent() || '';
        log.info(`Actual First Company Name extracted: ${vars["ActualFirstCompanyName"]}`);
        log.stepPass('Actual first company name extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract actual first company name');
        throw e;
      }

      // ── Trim and prepare expected company name 1 ───────────────────────
      log.step('Trimming and preparing Expected Company Name 1');
      try {
        vars["ActualFirstCompanyName"] = String(vars["ActualFirstCompanyName"]).trim();
        log.info(`Trimmed Actual First Company Name: ${vars["ActualFirstCompanyName"]}`);
        vars["ExpectedNameC1"] = String(vars["ExpectedCompanyName1"]).trim();
        log.info(`Trimmed Expected Company Name 1: ${vars["ExpectedNameC1"]}`);
        log.stepPass('Company Name 1 trimmed and prepared successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to trim company names');
        throw e;
      }

      // ── Verify first company name matches ──────────────────────────────
      log.step('Verifying first company name matches');
      try {
        expect(String(vars["ActualFirstCompanyName"])).toContain(vars["ExpectedNameC1"]);
        log.info(`First company name verified - Expected: ${vars["ExpectedNameC1"]}, Actual: ${vars["ActualFirstCompanyName"]}`);
        log.stepPass('First company name matches successfully');
      } catch (e) {
        await log.stepFail(page, `First company name mismatch - Expected: ${vars["ExpectedNameC1"]}, Got: ${vars["ActualFirstCompanyName"]}`);
        throw e;
      }

      // ── Extract and verify actual second company name ───────────────────
      log.step('Extracting actual second company name from bulk change popup');
      try {
        vars["ActualSecondCompanyName"] = await customerPermissionPage.Second_Companybulk_change_popup.textContent() || '';
        log.info(`Actual Second Company Name extracted: ${vars["ActualSecondCompanyName"]}`);
        log.stepPass('Actual second company name extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract actual second company name');
        throw e;
      }

      // ── Trim and prepare expected company name 2 ───────────────────────
      log.step('Trimming and preparing Expected Company Name 2');
      try {
        vars["ActualSecondCompanyName"] = String(vars["ActualSecondCompanyName"]).trim();
        log.info(`Trimmed Actual Second Company Name: ${vars["ActualSecondCompanyName"]}`);
        vars["ExpectedNameC2"] = String(vars["ExpectedCompanyName2"]).trim();
        log.info(`Trimmed Expected Company Name 2: ${vars["ExpectedNameC2"]}`);
        log.stepPass('Company Name 2 trimmed and prepared successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to trim company names');
        throw e;
      }

      // ── Verify second company name matches ─────────────────────────────
      log.step('Verifying second company name matches');
      try {
        expect(String(vars["ActualSecondCompanyName"])).toContain(vars["ExpectedNameC2"]);
        log.info(`Second company name verified - Expected: ${vars["ExpectedNameC2"]}, Actual: ${vars["ActualSecondCompanyName"]}`);
        log.stepPass('Second company name matches successfully');
      } catch (e) {
        await log.stepFail(page, `Second company name mismatch - Expected: ${vars["ExpectedNameC2"]}, Got: ${vars["ActualSecondCompanyName"]}`);
        throw e;
      }

      // ── Toggle Radio Button Based on Current State ──────────────────────
      log.step('Toggling Radio Button based on current state');
      try {
        //await stepGroups.stepGroup_Toggle_Radio_Button_Based_on_Current_State_and_Storing_the_U(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);
        const actionsPage = new ActionsPage(page);
        if (await CorrPortalElem.Standard_Off_Radio_button.isChecked()) /* Radio button Standard Off Radio button is selected */ {
          await actionsPage.Standard_Flow_On_Button.check();
          vars["ExpectedStandardState"] = "Allowed";
          vars["PreviousStandardState"] = "Disabled";
          log.info('Standard_Off_Radio_button was checked, toggled to Standard_Flow_On_Button');
        } else if (await actionsPage.Standard_Flow_On_Button.isChecked()) /* Radio button Standard On Radio(Global Restriction) is select */ {
          await CorrPortalElem.Standard_Off_Radio_button.check();
          vars["ExpectedStandardState"] = "Disabled";
          vars["PreviousStandardState"] = "Allowed";
          log.info('Standard_Flow_On_Button was checked, toggled to Standard_Off_Radio_button');
        }
        if (await CorrPortalElem.Chase_Direct_ON_button.isChecked()) /* Radio button Chase On Radio(Global Restriction) is selected */ {
          await CorrPortalElem.ChaseDirect_Off_Button.check();
          vars["ExpectedChaseState"] = "Disabled";
          vars["PreviousChaseState"] = "Allowed";
          log.info('Chase_Direct_ON_button was checked, toggled to ChaseDirect_Off_Button');
        } else if (await CorrPortalElem.ChaseDirect_Off_Button.isChecked()) /* Radio button Chase Off Radio(Global Restrictions) is selected */ {
          await CorrPortalElem.Chase_Direct_ON_button.check();
          vars["ExpectedChaseState"] = "Allowed";
          vars["PreviousChaseState"] = "Disabled";
          log.info('ChaseDirect_Off_Button was checked, toggled to Chase_Direct_ON_button');
        }
        await CorrPortalElem.Update_Permissions_Button.waitFor({ state: 'visible' });
        log.info('Update_Permissions_Button is now visible');
        await CorrPortalElem.Update_Permissions_Button.click();
        log.info('Clicked Update_Permissions_Button');
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - permissions updated');
        log.stepPass('Radio button toggled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to toggle radio button');
        throw e;
      }

      // ── Verify Company 1 Standard State ────────────────────────────────
      log.step(`Verifying Company 1 Standard State: ${vars["ExpectedStandardState"]}`);
      try {
        if (String(vars["ExpectedStandardState"]) === String("Allowed")) {
          await expect(customerPermissionPage.Company_1_Standard_State(vars["ExpectedCompanyName1"])).toContainClass(APP_CONSTANTS.ExecutionAllowedState);
        } else if (String(vars["ExpectedStandardState"]) === String("Disabled")) {
          await expect(customerPermissionPage.Company_1_Standard_State(vars["ExpectedCompanyName1"])).toContainClass(APP_CONSTANTS.ExecutionDisabledState);
        }
        log.info(`Company 1 Standard State verified: ${vars["ExpectedStandardState"]}`);
        log.stepPass('Company 1 Standard State verified successfully');
      } catch (e) {
        await log.stepFail(page, `Failed to verify Company 1 Standard State`);
        throw e;
      }

      // ── Verify Company 1 Chase State ───────────────────────────────────
      log.step(`Verifying Company 1 Chase State: ${vars["ExpectedChaseState"]}`);
      try {
        if (String(vars["ExpectedChaseState"]) === String("Allowed")) {
          await expect(customerPermissionPage.Company_1_Chase_State(vars["ExpectedCompanyName1"])).toContainClass(APP_CONSTANTS.ExecutionAllowedState);
        } else if (String(vars["ExpectedChaseState"]) === String("Disabled")) {
          await expect(customerPermissionPage.Company_1_Chase_State(vars["ExpectedCompanyName1"])).toContainClass(APP_CONSTANTS.ExecutionDisabledState);
        }
        log.info(`Company 1 Chase State verified: ${vars["ExpectedChaseState"]}`);
        log.stepPass('Company 1 Chase State verified successfully');
      } catch (e) {
        await log.stepFail(page, `Failed to verify Company 1 Chase State`);
        throw e;
      }

      // ── Verify Company 2 Standard State ────────────────────────────────
      log.step(`Verifying Company 2 Standard State: ${vars["ExpectedStandardState"]}`);
      try {
        if (String(vars["ExpectedStandardState"]) === String("Allowed")) {
          await expect(customerPermissionPage.Company_2_Standard_State(vars["ExpectedCompanyName2"])).toContainClass(APP_CONSTANTS.ExecutionAllowedState);
        } else {
          await expect(customerPermissionPage.Company_2_Standard_State(vars["ExpectedCompanyName2"])).toContainClass(APP_CONSTANTS.ExecutionDisabledState);
        }
        log.info(`Company 2 Standard State verified: ${vars["ExpectedStandardState"]}`);
        log.stepPass('Company 2 Standard State verified successfully');
      } catch (e) {
        await log.stepFail(page, `Failed to verify Company 2 Standard State`);
        throw e;
      }

      // ── Verify Company 2 Chase State ───────────────────────────────────
      log.step(`Verifying Company 2 Chase State: ${vars["ExpectedChaseState"]}`);
      try {
        if (String(vars["ExpectedChaseState"]) === String("Allowed")) {
          await expect(customerPermissionPage.Company_2_Chase_State(vars["ExpectedCompanyName2"])).toContainClass(APP_CONSTANTS.ExecutionAllowedState);
        } else {
          await expect(customerPermissionPage.Company_2_Chase_State(vars["ExpectedCompanyName2"])).toContainClass(APP_CONSTANTS.ExecutionDisabledState);
        }
        log.info(`Company 2 Chase State verified: ${vars["ExpectedChaseState"]}`);
        log.stepPass('Company 2 Chase State verified successfully');
      } catch (e) {
        await log.stepFail(page, `Failed to verify Company 2 Chase State`);
        throw e;
      }

      // ── Navigate back to Customer Permission Menu for cleanup ───────────
      log.step('Navigating back to Customer Permission Menu for cleanup');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        log.info('Clicked Administration Menu');
        await correspondentPortalPage.GeneralSettings_Menu.click();
        log.info('Clicked General Settings Menu');
        await customerPermissionPage.CustomerPermission_Menu.click();
        log.info('Clicked Customer Permission Menu');
        log.stepPass('Successfully navigated back to Customer Permission Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate back to Customer Permission Menu');
        throw e;
      }

      // ── Search for first company name ──────────────────────────────────
      log.step(`Searching for company: ${vars["ExpectedCompanyName1"]}`);
      try {
        vars["trimmedCompanyName1"] = String(vars["ExpectedCompanyName1"]).trim();
                await customerPermissionPage.Search_Filter_Input.clear();
        await customerPermissionPage.Search_Filter_Input.pressSequentially(vars["trimmedCompanyName1"]);
        log.info(`Filled Search Filter Input with: ${vars["trimmedCompanyName1"]}`);
        //await page.keyboard.press('Enter');
        //log.info('Pressed Enter to search');
        log.stepPass('Successfully searched for company');
      } catch (e) {
        await log.stepFail(page, `Failed to search for company`);
        throw e;
      }

      // ── Wait for search results ────────────────────────────────────────
      log.step('Waiting for search results');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - search results loaded');
        log.stepPass('Search results loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for search results');
        throw e;
      }

      // ── Click Edit Permission button for first record ────────────────────
      log.step('Clicking Edit Permission button for first record');
      try {
        await customerPermissionPage.Edit_Permission_Buttonfirst_record.click();
        log.info('Clicked Edit Permission button');
        log.stepPass('Edit Permission button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Edit Permission button');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────────
      log.step('Waiting for page load after clicking Edit Permission');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
        throw e;
      }

      // ── Restore Previous Standard State ────────────────────────────────
      log.step(`Restoring Previous Standard State: ${vars["PreviousStandardState"]}`);
      try {
        const CorrPortalElem = new CorrPortalPage(page);
        const actionsPage = new ActionsPage(page);
        if (await CorrPortalElem.Standard_Off_Radio_button.isChecked()) /* Radio button Standard Off Radio button is selected */ {
          await actionsPage.Standard_Flow_On_Button.check();
          log.info('Checked Standard_Flow_On_Button to restore state');
        }
        if (await CorrPortalElem.ChaseDirect_Off_Button.isChecked()) /* Radio button Chase On Radio(Global Restriction) is selected */ {
          await CorrPortalElem.Chase_Direct_ON_button.check();
          log.info('Checked Chase_Direct_ON_button to restore state');
        }
        if (await actionsPage.Update_Permissions_Button.isEnabled()) /* Radio button Standard Off Radio button is selected */ {
          await expect(actionsPage.Update_Permissions_Button).toBeEnabled();
          await actionsPage.Update_Permissions_Button.click();
          log.info('Clicked Update_Permissions_Button to apply restored state');
          log.stepPass(`Previous Standard State restoration attempted: ${vars["PreviousStandardState"]}`);
        }
        if(await CrossbuttonPage.Cross_Button.isVisible()){
            await CrossbuttonPage.Cross_Button.click();
            log.info('Clicked Cross Button to close Edit Permissions page');
          }
      } catch (e) {
        await log.stepFail(page, 'Failed to restore Previous Standard State');
        throw e;
      }

      // ── Search for second company name ──────────────────────────────────
      log.step(`Searching for company: ${vars["ExpectedCompanyName2"]}`);
      try {
        await customerPermissionPage.Search_Filter_Input.clear();
        vars["trimmedCompanyName2"] = String(vars["ExpectedCompanyName2"]).trim();
        await customerPermissionPage.Search_Filter_Input.pressSequentially(vars["trimmedCompanyName2"]);
        log.info(`Filled Search Filter Input with: ${vars["trimmedCompanyName2"]}`);
        //await page.keyboard.press('Enter');
        //log.info('Pressed Enter to search');
        log.stepPass('Successfully searched for company');
      } catch (e) {
        await log.stepFail(page, `Failed to search for company`);
        throw e;
      }

      // ── Wait for search results ────────────────────────────────────────
      log.step('Waiting for search results');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - search results loaded');
        log.stepPass('Search results loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for search results');
        throw e;
      }

      // ── Click Edit Permission button for first record ────────────────────
      log.step('Clicking Edit Permission button for first record');
      try {
        await customerPermissionPage.Edit_Permission_Buttonfirst_record.click();
        log.info('Clicked Edit Permission button');
        log.stepPass('Edit Permission button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Edit Permission button');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────────
      log.step('Waiting for page load after clicking Edit Permission');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
        throw e;
      }

      // ── Restore Previous Standard State ────────────────────────────────
      log.step(`Restoring Previous Standard State: ${vars["PreviousStandardState"]}`);
      try {
        const CorrPortalElem = new CorrPortalPage(page);
        const actionsPage = new ActionsPage(page);
        if (await CorrPortalElem.Standard_Off_Radio_button.isChecked()) /* Radio button Standard Off Radio button is selected */ {
          await actionsPage.Standard_Flow_On_Button.check();
          log.info('Checked Standard_Flow_On_Button to restore state');
        }
        if (await CorrPortalElem.ChaseDirect_Off_Button.isChecked()) /* Radio button Chase On Radio(Global Restriction) is selected */ {
          await CorrPortalElem.Chase_Direct_ON_button.check();
          log.info('Checked Chase_Direct_ON_button to restore state');
        }
        if (await actionsPage.Update_Permissions_Button.isEnabled()) /* Radio button Standard Off Radio button is selected */ {
          await expect(actionsPage.Update_Permissions_Button).toBeEnabled();
          await actionsPage.Update_Permissions_Button.click();
          log.info('Clicked Update_Permissions_Button to apply restored state');
        }
        if(await CrossbuttonPage.Cross_Button.isVisible()){
            await CrossbuttonPage.Cross_Button.click();
            log.info('Clicked Cross Button to close Edit Permissions page');
          }
        log.stepPass(`Previous Standard State restoration attempted: ${vars["PreviousStandardState"]}`);
      } catch (e) {
        await log.stepFail(page, 'Failed to restore Previous Standard State');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts03_tc04_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });

  test.afterEach(async ({ page }) => {
    const CorrPortalElem = new CorrPortalPage(page);
    const actionsPage = new ActionsPage(page);
    if (reg_ts03_tc04_testFailed) {
      log.step('Executing afterEach steps for failure handling');
      log.afterTestSteps(TC_ID, reg_ts03_tc04_testFailed);
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

        // ── Search for first company name ──────────────────────────────────
        log.step('Searching for first company in afterEach');
        try {
                  await customerPermissionPage.Search_Filter_Input.clear();

          await customerPermissionPage.Search_Filter_Input.pressSequentially(String(vars["ExpectedCompanyName1"]));
          log.info(`Filled Search Filter Input with: ${vars["ExpectedCompanyName1"]}`);
          await page.keyboard.press('Enter');
          log.info('Pressed Enter to search');
          log.stepPass('Successfully searched for company');
        } catch (e) {
          await log.stepFail(page, 'Failed to search for company in afterEach');
          throw e;
        }

        // ── Wait for search results ────────────────────────────────────────
        log.step('Waiting for search results in afterEach');
        try {
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Spinner disappeared - search results loaded');
          log.stepPass('Search results loaded successfully');
        } catch (e) {
          await log.stepFail(page, 'Failed to wait for search results in afterEach');
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

        // ── Wait for page load ─────────────────────────────────────────────
        log.step('Waiting for page load in afterEach');
        try {
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Spinner disappeared - page load completed');
          log.stepPass('Page loaded successfully');
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
          if(await CrossbuttonPage.Cross_Button.isVisible()){
            await CrossbuttonPage.Cross_Button.click();
            log.info('Clicked Cross Button to close Edit Permissions page');
          }
          log.stepPass('State restoration completed in afterEach');
        } catch (e) {
          await log.stepFail(page, 'Failed to restore state in afterEach');
          throw e;
        }

        // ── Search for second company name ──────────────────────────────────
        log.step('Searching for second company in afterEach');
        try {
          await customerPermissionPage.Search_Filter_Input.clear();
          await customerPermissionPage.Search_Filter_Input.pressSequentially(String(vars["ExpectedCompanyName2"]));
          log.info(`Filled Search Filter Input with: ${vars["ExpectedCompanyName2"]}`);
          //await page.keyboard.press('Enter');
          log.info('Pressed Enter to search');
          log.stepPass('Successfully searched for company');
        } catch (e) {
          await log.stepFail(page, 'Failed to search for company in afterEach');
          throw e;
        }

        // ── Wait for search results ────────────────────────────────────────
        log.step('Waiting for search results in afterEach');
        try {
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Spinner disappeared - search results loaded');
          log.stepPass('Search results loaded successfully');
        } catch (e) {
          await log.stepFail(page, 'Failed to wait for search results in afterEach');
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

        // ── Wait for page load ─────────────────────────────────────────────
        log.step('Waiting for page load in afterEach');
        try {
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Spinner disappeared - page load completed');
          log.stepPass('Page loaded successfully');
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
          if(await CrossbuttonPage.Cross_Button.isVisible()){
            await CrossbuttonPage.Cross_Button.click();
            log.info('Clicked Cross Button to close Edit Permissions page');
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