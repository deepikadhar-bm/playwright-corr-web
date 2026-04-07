import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BatchinbulkbatchtimingPage } from '../../../src/pages/correspondant/batchinbulkbatchtiming';
import { BidrequestCreationPage } from '../../../src/pages/correspondant/bidrequest-creation';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = 'REG_TS04_TC08';
const TC_TITLE = 'Bulk Batch Timing - Verify Edit batch functionality';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let batchinbulkbatchtimingPage: BatchinbulkbatchtimingPage;
  let bidrequestCreationPage: BidrequestCreationPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    batchinbulkbatchtimingPage = new BatchinbulkbatchtimingPage(page);
    bidrequestCreationPage = new BidrequestCreationPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to CORR Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to CORR Portal failed');
        throw e;
      }

      log.step('Delete early config report if present');
      try {
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        log.stepPass('Early config report deleted successfully if present');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete early config report');
        throw e;
      }

      log.step('Navigate to Bulk Batch Timing and verify page');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Bulk Batch Timing and page verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing or verify page');
        throw e;
      }

      log.step('Modify batch intervals and capture last batch time and expected batch time');
      try {
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
        vars['LastBeforeBatchTime'] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
        Methods.addMinutesToDatetime(vars['LastBeforeBatchTime'], appconstants.TIME_FORMAT1_HHMMA, 1, appconstants.TIME_FORMAT1_HHMMA, 'ExpectedBatchTime');
        log.info('LastBeforeBatchTime: ' + vars['LastBeforeBatchTime']);
        log.info('ExpectedBatchTime: ' + vars['ExpectedBatchTime']);
        log.stepPass('Batch intervals modified and last batch time captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to modify batch intervals or capture last batch time');
        throw e;
      }

      log.step('Separate hours and minutes and hover over last batch time to click Edit');
      try {
        await stepGroups.stepGroup_Separating_Hours_and_Minutes(page, vars);
        log.info('Time_Hour: ' + vars['Time_Hour']);
        log.info('Time_Min: ' + vars['Time_Min']);
        await batchinbulkbatchtimingPage.Batch_Time_Last_Before.hover();
        await batchinbulkbatchtimingPage.Edit_Batch_ButtonLast_Before.click();
        await expect(page.getByText('Edit Batch Timing')).toBeVisible();
        log.stepPass('Hours and minutes separated and Edit Batch Timing dialog opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to separate hours and minutes or open Edit Batch Timing dialog');
        throw e;
      }

      log.step('Fill in updated batch time and apply changes');
      try {
        await correspondentPortalPage.StartTime_In_Hour.clear();
        await correspondentPortalPage.StartTime_In_Hour.fill(vars['Time_Hour']);
        await correspondentPortalPage.StartTime_In_Minutes.clear();
        await correspondentPortalPage.StartTime_In_Minutes.fill(vars['Time_Min']);
        await expect(correspondentPortalPage.Apply_Changes_Button).toBeVisible();
        await correspondentPortalPage.Apply_Changes_Button.click();
        log.stepPass('Updated batch time filled and Apply Changes clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to fill updated batch time or click Apply Changes');
        throw e;
      }

      log.step('Verify batch update success message and confirm');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText('Update Batch Timing')).toBeVisible();
        await expect(correspondentPortalPage.Batch_timing_has_been_updated_successfully_Success_Message).toBeVisible();
        await okButtonPage.Ok_Button.click();
        log.stepPass('Batch update success message verified and confirmed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify batch update success message or confirm');
        throw e;
      }

      log.step('Verify last modified data and edited batch time');
      try {
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        vars['EditedBatchTime'] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
        log.info('EditedBatchTime: ' + vars['EditedBatchTime']);
        expect(String(vars['EditedBatchTime'])).toBe(vars['ExpectedBatchTime']);
        log.stepPass('Last modified data and edited batch time verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify last modified data or edited batch time');
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