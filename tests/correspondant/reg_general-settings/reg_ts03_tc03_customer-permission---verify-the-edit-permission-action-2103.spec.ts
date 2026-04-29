// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionsPage } from '../../../src/pages/correspondant/actions';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { EditPermissionsPage } from '../../../src/pages/correspondant/edit-permissions';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { APP_CONSTANTS } from 'src/constants/app-constants';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';

const TC_ID = 'REG_TS03_TC03';
const TC_TITLE = 'Customer Permission - Verify the edit permission action';
let reg_ts03_tc03_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let actionsPage: ActionsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let editPermissionsPage: EditPermissionsPage;
  let generalSettingPage: GeneralSettingPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionsPage = new ActionsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    editPermissionsPage = new EditPermissionsPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });


  test('REG_TS03_TC03_Customer Permission - Verify the edit permission action.', async ({ page }) => {
    const CorrPortalElem = new CorrPortalPage(page);
    const actionsPage = new ActionsPage(page);
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

      // ── Search for company by APP_CONSTANTS.CompanyName1 ───────────────────────────────────
      log.step(`Searching for company: ${APP_CONSTANTS.CompanyName1}`);
      try {
        await customerPermissionPage.Search_Filter_Input.fill(APP_CONSTANTS.CompanyName1);
        log.info(`Filled Search Filter Input with: ${APP_CONSTANTS.CompanyName1}`);
        await page.keyboard.press('Enter');
        log.info('Pressed Enter to search');
        log.stepPass(`Successfully searched for ${APP_CONSTANTS.CompanyName1}`);
      } catch (e) {
        await log.stepFail(page, `Failed to search for ${APP_CONSTANTS.CompanyName1}`);
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

      // ── Extract first company name ─────────────────────────────────────
      log.step('Extracting first company name');
      try {
        vars["FirstCompanyName"] = await generalSettingPage.First_Company_Namecustomer_permission.textContent() || '';
        log.info(`First Company Name extracted: ${vars["FirstCompanyName"]}`);
        log.stepPass('First company name extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract first company name');
        throw e;
      }

      // ── Process company name substring ─────────────────────────────────
      log.step('Processing company name substring');
      try {
        vars["FirstCompanyName"] = String(vars["FirstCompanyName"]).substring(1, String(vars["FirstCompanyName"]).length - 1);
        log.info(`Company name after substring processing: ${vars["FirstCompanyName"]}`);
        log.stepPass('Company name substring processed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to process company name substring');
        throw e;
      }

      // ── Search by Company Name ─────────────────────────────────────────
      log.step(`Searching by Company Name: ${vars["FirstCompanyName"]}`);
      try {
        await customerPermissionPage.Search_Filter_Input.fill(String(vars["FirstCompanyName"]));
        log.info(`Filled Search Filter Input with: ${vars["FirstCompanyName"]}`);
        await page.keyboard.press('Enter');
        log.info('Pressed Enter to search by Company Name');
        log.stepPass('Successfully searched by Company Name');
      } catch (e) {
        await log.stepFail(page, 'Failed to search by Company Name');
        throw e;
      }

      // ── Wait for search results ────────────────────────────────────────
      log.step('Waiting for search results after Company Name search');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - search results loaded');
        log.stepPass('Search results loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for search results');
        throw e;
      }

      // ── Set expected company name ──────────────────────────────────────
      log.step('Setting expected company name variable');
      try {
        vars["ExpectedCompanyName"] = vars["FirstCompanyName"];
        log.info(`Expected Company Name set to: ${vars["ExpectedCompanyName"]}`);
        log.stepPass('Expected company name set successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to set expected company name');
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

      // ── Toggle Radio Button Based on Current State ──────────────────────
      log.step('Toggling Radio Button based on current state');
      try {
        //await stepGroups.stepGroup_Toggle_Radio_Button_Based_on_Current_State(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);
        const actionsPage = new ActionsPage(page);
        if (await CorrPortalElem.Standard_Off_Radio_button.isChecked()) /* Radio button Standard Off Radio button is selected */ {
          await actionsPage.Standard_Flow_On_Button.check();
          vars["ExpectedStandardState"] = "Allowed";
          vars["PreviousStandardState"] = "Disabled";
        } else if (await actionsPage.Standard_Flow_On_Button.isChecked()) /* Radio button Standard On Radio(Global Restriction) is select */ {
          await CorrPortalElem.Standard_Off_Radio_button.check();
          vars["ExpectedStandardState"] = "Disabled";
          vars["PreviousStandardState"] = "Allowed";
        }
        if (await CorrPortalElem.Chase_Direct_ON_button.isChecked()) /* Radio button Chase On Radio(Global Restriction) is selected */ {
          await CorrPortalElem.ChaseDirect_Off_Button.check();
          vars["ExpectedChaseState"] = "Disabled";
          vars["PreviousChaseState"] = "Allowed";
        } else if (await CorrPortalElem.ChaseDirect_Off_Button.isChecked()) /* Radio button Chase Off Radio(Global Restrictions) is selected */ {
          await CorrPortalElem.Chase_Direct_ON_button.check();
          vars["ExpectedChaseState"] = "Allowed";
          vars["PreviousChaseState"] = "Disabled";
        }
        await CorrPortalElem.Update_Permissions_Button.waitFor({ state: 'visible' });
        await CorrPortalElem.Update_Permissions_Button.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        log.info('Radio button toggled based on current state');
        log.stepPass('Radio button toggled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to toggle radio button');
        throw e;
      }

      // ── Re-search for company ──────────────────────────────────────────
      log.step(`Re-searching for company: ${APP_CONSTANTS.CompanyName1}`);
      try {
        await customerPermissionPage.Search_Filter_Input.fill(String(APP_CONSTANTS.CompanyName1));
        log.info(`Filled Search Filter Input with: ${APP_CONSTANTS.CompanyName1}`);
        await page.keyboard.press('Enter');
        log.info('Pressed Enter to search');
        log.stepPass('Successfully re-searched for company');
      } catch (e) {
        await log.stepFail(page, 'Failed to re-search for company');
        throw e;
      }

      // ── Wait for search results ────────────────────────────────────────
      log.step('Waiting for search results after re-search');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - search results loaded');
        log.stepPass('Search results loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for search results');
        throw e;
      }

      // ── Verify Standard State (First Record) ────────────────────────────
      log.step('Verifying Standard State for first record');
      try {
        if (String(vars["ExpectedStandardState"]) === String("Allowed")) {
          await expect(customerPermissionPage.Standard_State_First_Record).toContainClass(APP_CONSTANTS.ExecutionAllowedState);
          log.info('Verified Standard State is in Allowed state');
        } else {
          await expect(customerPermissionPage.Standard_State_First_Record).toContainClass(APP_CONSTANTS.ExecutionDisabledState);
          log.info('Verified Standard State is in Disabled state');
        }
        log.stepPass(`Standard State verified: ${vars["ExpectedStandardState"]}`);
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Standard State');
        throw e;
      }

      // ── Verify Chase State (First Record) ──────────────────────────────
      log.step('Verifying Chase State for first record');
      try {
        if (String(vars["ExpectedChaseState"]) === String("Allowed")) {
          await expect(customerPermissionPage.Chase_StateFirst_Record).toContainClass(APP_CONSTANTS.ExecutionAllowedState);
          log.info('Verified Chase State is in Allowed state');
        } else {
          await expect(customerPermissionPage.Chase_StateFirst_Record).toContainClass(APP_CONSTANTS.ExecutionDisabledState);
          log.info('Verified Chase State is in Disabled state');
        }
        log.stepPass(`Chase State verified: ${vars["ExpectedChaseState"]}`);
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Chase State');
        throw e;
      }

      // ── Click Edit Permission button again ──────────────────────────────
      log.step('Clicking Edit Permission button for first record again');
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
        if (String(vars["PreviousStandardState"]) === String("Disabled")) {
          await editPermissionsPage.Standard_Off_Radio_button.check();
          log.info('Checked Standard_Off_Radio_button');
        } else {
          await actionsPage.Standard_Flow_On_Button.check();
          log.info('Checked Standard_Flow_On_Button');
        }
        log.stepPass(`Previous Standard State restored: ${vars["PreviousStandardState"]}`);
      } catch (e) {
        await log.stepFail(page, 'Failed to restore Previous Standard State');
        throw e;
      }

      // ── Restore Previous Chase State ───────────────────────────────────
      log.step(`Restoring Previous Chase State: ${vars["PreviousChaseState"]}`);
      try {
        if (String(vars["PreviousChaseState"]) === String("Allowed")) {
          await CorrPortalElem.Chase_Direct_ON_button.check();
          log.info('Checked Chase_Direct_ON_button');
        } else {
          await CorrPortalElem.ChaseDirect_Off_Button.check();
          log.info('Checked Chase_Direct_OFF_button');
        }
        log.stepPass(`Previous Chase State restored: ${vars["PreviousChaseState"]}`);
      } catch (e) {
        await log.stepFail(page, 'Failed to restore Previous Chase State');
        throw e;
      }

      // ── Wait for Update Permissions button and click ────────────────────
      log.step('Waiting for Update Permissions button');
      try {
        await actionsPage.Update_Permissions_Button.waitFor({ state: 'visible' });
        log.info('Update Permissions button is now visible');
        log.stepPass('Update Permissions button is visible');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Update Permissions button');
        throw e;
      }

      // ── Click Update Permissions button ────────────────────────────────
      log.step('Clicking Update Permissions button');
      try {
        await actionsPage.Update_Permissions_Button.click();
        log.info('Clicked Update Permissions button');
        log.stepPass('Update Permissions button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Update Permissions button');
        throw e;
      }

      // ── Generate and log current timestamp ──────────────────────────────
      log.step('Generating current timestamp');
      try {
        vars["CurrentLocalTime"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
          const fmt = "M/d/yyyy : h:mm a";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        log.info(`Current Local Time: ${vars["CurrentLocalTime"]}`);
        log.stepPass('Timestamp generated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to generate timestamp');
        throw e;
      }

      // ── Wait for page load after update ────────────────────────────────
      log.step('Waiting for page load after permissions update');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
        throw e;
      }

      // ── Verify Chase State is restored (First Record) ───────────────────
      log.step(`Verifying restored Chase State: ${vars["PreviousChaseState"]}`);
      try {
        if (String(vars["PreviousChaseState"]) === String("Allowed")) {
          await expect(customerPermissionPage.Chase_StateFirst_Record).toContainClass(APP_CONSTANTS.ExecutionAllowedState);
          log.info('Verified Chase State is in Allowed state');
        } else {
          await expect(customerPermissionPage.Chase_StateFirst_Record).toContainClass(APP_CONSTANTS.ExecutionDisabledState);
          log.info('Verified Chase State is in Disabled state');
        }
        log.stepPass(`Chase State verified: ${vars["PreviousChaseState"]}`);
      } catch (e) {
        await log.stepFail(page, 'Failed to verify restored Chase State');
        throw e;
      }

      // ── Verify Standard State is restored (First Record) ────────────────
      log.step(`Verifying restored Standard State: ${vars["PreviousStandardState"]}`);
      try {
        //await expect(customerPermissionPage.Standard_State_First_Record).toContainText(vars["PreviousStandardState"]);
        log.info(`Standard State text content: ${vars["PreviousStandardState"]}`);
        if (String(vars["PreviousStandardState"]) === String("Allowed")) {
          await expect(customerPermissionPage.Standard_State_First_Record).toContainClass(APP_CONSTANTS.ExecutionAllowedState);
          log.info('Verified Standard State is in Allowed state');
        } else {
          await expect(customerPermissionPage.Standard_State_First_Record).toContainClass(APP_CONSTANTS.ExecutionDisabledState);
          log.info('Verified Standard State is in Disabled state');
        }
        log.stepPass(`Standard State verified: ${vars["PreviousStandardState"]}`);
      } catch (e) {
        await log.stepFail(page, 'Failed to verify restored Standard State');
        throw e;
      }

      try {
        log.info('Verifying last modified data in the right corner of the screen');
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.stepPass('Last modified data in the right corner of the screen verified successfully');

      }
      catch (e) {
        await log.stepFail(page, 'Failed to verify last modified data in the right corner of the screen');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts03_tc03_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });
  test.afterEach(async ({ page }) => {
    const CorrPortalElem = new CorrPortalPage(page);
    const actionsPage = new ActionsPage(page);
    if (reg_ts03_tc03_testFailed) {
      log.afterTestSteps(TC_ID, reg_ts03_tc03_testFailed);
      log.info('Test failed - executing afterEach steps for failure handling');
      // Add any additional steps needed on failure, e.g., resetting state
      await correspondentPortalPage.Administration_Menu.click();
      await correspondentPortalPage.GeneralSettings_Menu.click();
      await customerPermissionPage.CustomerPermission_Menu.click();
      await customerPermissionPage.Search_Filter_Input.fill(String(vars["FirstCompanyName"]));
      await page.keyboard.press('Enter');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.info('Spinner disappeared - Customer Permission page loaded');
      log.stepPass('Customer Permission page loaded successfully');
      await customerPermissionPage.Edit_Permission_Buttonfirst_record.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.info('Spinner disappeared - Edit Permissions page loaded');
      log.stepPass('Edit Permissions page loaded successfully');

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
      }
      log.info('State restoration attempted in afterEach');

    } else {
      log.info('Test passed - no afterEach steps needed');
    }
  });
});
