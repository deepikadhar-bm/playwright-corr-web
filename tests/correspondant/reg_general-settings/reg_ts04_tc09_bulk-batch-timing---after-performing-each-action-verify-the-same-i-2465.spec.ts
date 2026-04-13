import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS04_TC09';
const TC_TITLE = 'Bulk Batch timing - Verify actions in Audit logs';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }

      log.step('Navigate to Bulk Batch Timing');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        log.stepPass('Navigation successful');
      } catch (e) {
        await log.stepFail(page, 'Navigation failed');
        throw e;
      }

      log.step('Delete last batch timing');
      try {
        vars["BufferTime"] = appconstants.ONE;
        await stepGroups.stepGroup_Delete_Last_Batch_Time(page, vars);
        log.stepPass('Last batch timing deleted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete last batch timing');
        throw e;
      }

      log.step('Open Audit menu and wait for data load');
      try {
        await generalSettingPage.Audit_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Audit menu opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to open Audit menu');
        throw e;
      }

      log.step('Verify audit time and date');
      try {
        await stepGroups.stepGroup_Verifying_the_Audit_Time_and_Date(page, vars);
        log.stepPass('Audit time and date verified');
      } catch (e) {
        await log.stepFail(page, 'Audit time and date verification failed');
        throw e;
      }

      log.step('Verify username and config type in audit list');
      try {
        await stepGroups.stepGroup_Verifying_the_Username_and_Config_Type_in_Audit_List_Screen(page, vars);
        log.stepPass('Username and config type verified');
      } catch (e) {
        await log.stepFail(page, 'Username/config type verification failed');
        throw e;
      }

      log.step('Verify side-by-side data in See Difference popup');
      try {
        await stepGroups.stepGroup_Verifying_the_side_by_side_data_in_see_difference_pop_upAudi(page, vars);
        log.stepPass('Side-by-side data verified');
      } catch (e) {
        await log.stepFail(page, 'Side-by-side data verification failed');
        throw e;
      }

      log.step('Verify line-by-line data in See Difference popup');
      try {
        await stepGroups.stepGroup_Verifying_the_Line_by_line_data_in_see_difference_pop_upAudi(page, vars);
        log.stepPass('Line-by-line data verified');
      } catch (e) {
        await log.stepFail(page, 'Line-by-line data verification failed');
        throw e;
      }

      log.step('Close See Difference popup');
      try {
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        log.stepPass('Popup closed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to close popup');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});