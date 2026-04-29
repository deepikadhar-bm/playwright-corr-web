// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';

const TC_ID = 'REG_TS14_TC02';
const TC_TITLE = 'Commitment timer - Verify the Last Modified date, time and user get displayed in the screen';
let reg_ts14_tc02_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS14_TC02_Commitment timer - Verify the Last Modified date, time and user get displayed in the screen.', async ({ page }) => {
    
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

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for page load');
      try {
        await page.waitForLoadState('load');
        log.info('Page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
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

      // ── Navigate to Commitment Timer General Settings ────────────────
      log.step('Navigating to Commitment Timer General Settings');
      try {
        await generalSettingPage.Commitment_Timer_General_Settings.click();
        log.info('Clicked Commitment Timer General Settings');
        log.stepPass('Successfully navigated to Commitment Timer General Settings');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment Timer General Settings');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for page load after Commitment Timer navigation');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
        throw e;
      }

      // ── Extract current minutes value ──────────────────────────────────
      log.step('Extracting current minutes value before edit');
      try {
        vars["MinutesBeforeEdit"] = await correspondentPortalPage.Internal_User_Minutes_Input.inputValue() || '';
        log.info(`Current minutes value extracted: ${vars["MinutesBeforeEdit"]}`);
        log.stepPass('Current minutes value extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract current minutes value');
        throw e;
      }

      // ── Generate new random minutes value ──────────────────────────────
      log.step('Generating new random minutes value');
      try {
        vars["NewMinToEnter"] = String(Math.floor(Math.random() * (4 - 1 + 1)) + 1);
        log.info(`Generated random minutes value: ${vars["NewMinToEnter"]}`);
        log.stepPass('Random minutes value generated');
      } catch (e) {
        await log.stepFail(page, 'Failed to generate random minutes value');
        throw e;
      }

      // ── Ensure new value is different from current value ────────────────
      log.step('Ensuring new value is different from current value');
      try {
        while (String(vars["NewMinToEnter"]) === String(vars["MinutesBeforeEdit"])) {
          vars["NewMinToEnter"] = String(Math.floor(Math.random() * (4 - 1 + 1)) + 1);
          log.info(`Regenerating value as it matched previous: ${vars["NewMinToEnter"]}`);
        }
        log.info(`Final new minutes value to enter: ${vars["NewMinToEnter"]}`);
        log.stepPass('New value confirmed to be different from current value');
      } catch (e) {
        await log.stepFail(page, 'Failed to ensure new value is different');
        throw e;
      }

      // ── Clear and fill Internal User Minutes Input ─────────────────────
      log.step('Clearing Internal User Minutes Input');
      try {
        await correspondentPortalPage.Internal_User_Minutes_Input.clear();
        log.info('Cleared Internal User Minutes Input');
        log.stepPass('Internal User Minutes Input cleared successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to clear Internal User Minutes Input');
        throw e;
      }

      // ── Fill new minutes value ─────────────────────────────────────────
      log.step(`Filling new minutes value: ${vars["NewMinToEnter"]}`);
      try {
        await correspondentPortalPage.Internal_User_Minutes_Input.fill(vars["NewMinToEnter"]);
        log.info(`Filled Internal User Minutes Input with: ${vars["NewMinToEnter"]}`);
        log.stepPass('New minutes value filled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to fill new minutes value');
        throw e;
      }

      // ── Wait for Save Changes Button to be visible ─────────────────────
      log.step('Waiting for Save Changes Button to be visible');
      try {
        await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
        log.info('Save Changes Button is now visible');
        log.stepPass('Save Changes Button visibility confirmed');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Save Changes Button');
        throw e;
      }

      // ── Click Save Changes Button ──────────────────────────────────────
      log.step('Clicking Save Changes Button');
      try {
        await correspondentPortalPage.Save_Changes_Button.click();
        log.info('Clicked Save Changes Button');
        log.stepPass('Save Changes Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Save Changes Button');
        throw e;
      }

      // ── Wait for page load after saving ────────────────────────────────
      log.step('Waiting for page load after saving changes');
      try {
        await page.waitForLoadState('load');
        log.info('Page load completed after save');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load after save');
        throw e;
      }

      // ── Verify Last Modified data on screen ────────────────────────────
      log.step('Verifying Last Modified data on screen');
      try {
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.info('Last Modified data verification step group executed');
        log.stepPass('Last Modified data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Last Modified data');
        throw e;
      }

      // ── Restore original minutes value ─────────────────────────────────
      log.step(`Restoring original minutes value: ${vars["MinutesBeforeEdit"]}`);
      try {
        await correspondentPortalPage.Internal_User_Minutes_Input.fill(String(vars["MinutesBeforeEdit"]));
        log.info(`Filled Internal User Minutes Input with original value: ${vars["MinutesBeforeEdit"]}`);
        log.stepPass('Original minutes value filled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore original minutes value');
        throw e;
      }

      // ── Wait for Save Changes Button to be visible ─────────────────────
      log.step('Waiting for Save Changes Button to be visible');
      try {
        await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
        log.info('Save Changes Button is now visible');
        log.stepPass('Save Changes Button visibility confirmed');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Save Changes Button');
        throw e;
      }

      // ── Click Save Changes Button to finalize ──────────────────────────
      log.step('Clicking Save Changes Button to finalize restoration');
      try {
        await correspondentPortalPage.Save_Changes_Button.click();
        log.info('Clicked Save Changes Button');
        log.stepPass('Save Changes Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Save Changes Button');
        throw e;
      }

      // ── Wait for spinner to disappear ──────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - all changes completed');
        log.stepPass('Spinner disappeared successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts14_tc02_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });


});