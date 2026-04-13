import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BatchinbulkbatchtimingPage } from '../../../src/pages/correspondant/batchinbulkbatchtiming';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { stepGroup_selecting_time_unit_bulk_batch, stepGroup_Separating_Hours_and_minutes_In_time_Current_EST_time } from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CorrPortalPage } from '../../../src/pages/correspondant/CorrPortalPage';
import { testDataManager } from 'testdata/TestDataManager';



const TC_ID = 'REG_TS04_TC05';
const TC_TITLE = 'Bulk Batch Timing - Click on the Modify Batch Intervals, and in the displayed Popup Modify the Timings and Click on the Today and Future Business Days.';

const profileName = 'Administration_Bulk Batch Timing';
const profile = testDataManager.getProfileByName(profileName);
test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let batchinbulkbatchtimingPage: BatchinbulkbatchtimingPage;
  let spinnerPage: SpinnerPage;
  let REG_TS04_TC05testFailed = false;
  let Methods: AddonHelpers;
  let correspondentPortalPage: CorrespondentPortalPage;
  let CorrPortalElem: CorrPortalPage;

  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    batchinbulkbatchtimingPage = new BatchinbulkbatchtimingPage(page);
    spinnerPage = new SpinnerPage(page);
    CorrPortalElem = new CorrPortalPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
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

      log.step('Navigate to Bulk Batch Timing and verify page');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByRole('heading', { name: 'Bulk Batch Timing' })).toBeVisible();
        log.stepPass('Navigated to Bulk Batch Timing and page verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing or verify page');
        throw e;
      }

      log.step('Modify batch intervals for next business day and verify batch times');
      try {
        vars['Time Interval'] = appconstants.FIVE;
        vars['NO of Batches'] = appconstants.TWO;

        log.info(`Time Interval: ${vars['Time Interval']}`);
        log.info(`NO of Batches: ${vars['NO of Batches']}`);

        await CorrPortalElem.Modify_Batch_Intervals_Button.click();

        log.step('Calculate current EST time + 1 hour');
        try {
          Methods.getCurrentTimestamp(appconstants.TIME_FORMAT1_HHMMA, 'OnehourPrior', 'America/New_York');
          Methods.addMinutesToDatetime(vars['OnehourPrior'], appconstants.TIME_FORMAT1_HHMMA, 60, appconstants.TIME_FORMAT1_HHMMA, 'OnehourPrior');
          vars["CurrentTime"] = vars["OnehourPrior"];
          log.info(`OnehourPrior: ${vars['OnehourPrior']}`);
          await stepGroup_Separating_Hours_and_minutes_In_time_Current_EST_time(page, vars);
          log.stepPass('Time calculated and separated successfully');
        } catch (e) {
          await log.stepFail(page, 'Failed to calculate and split time');
          throw e;
        }

        log.step('Enter batch timing details');
        try {
          await CorrPortalElem.StartTime_In_Hour.pressSequentially(vars["Time_Hour"]);
          await CorrPortalElem.StartTime_In_Minutes.pressSequentially(vars["Time_Min"]);
          await stepGroup_selecting_time_unit_bulk_batch(page, vars);
          await CorrPortalElem.Time_Interval.pressSequentially(vars["Time Interval"]);
          await CorrPortalElem.No_Of_Batches.pressSequentially(vars["NO of Batches"]);
          log.stepPass('Batch timing details entered successfully');
        } catch (e) {
          await log.stepFail(page, 'Failed to enter batch timing details');
          throw e;
        }

        log.step('Select Next Business Day and submit');
        try {
          await correspondentPortalPage.Next_Business_Day_Radio_Button.check();
          await expect(correspondentPortalPage.Next_Business_Day_Radio_Button).toBeChecked();
          await CorrPortalElem.Modify_Batch_Button.click();
          await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
          await expect(CorrPortalElem.Modified_batch_timings_successfully_Message).toBeVisible();
          await CorrPortalElem.Ok_Button.click();
          log.stepPass('Batch intervals modified successfully');
        } catch (e) {
          await log.stepFail(page, 'Failed to modify batch intervals');
          throw e;
        }

        log.step('Verify batch times');
        try {
          Methods.addMinutesToDatetime(vars['OnehourPrior'], appconstants.TIME_FORMAT1_HHMMA, 5, appconstants.TIME_FORMAT1_HHMMA, 'ExpectedBatch2Time');
          log.info(`ExpectedBatch2Time: ${vars['ExpectedBatch2Time']}`);
          await expect(batchinbulkbatchtimingPage.Batch_1_bulk_bacthes).toContainText(vars['OnehourPrior']);
          await expect(batchinbulkbatchtimingPage.Batch_2Bulk_batches).toContainText(vars['ExpectedBatch2Time']);
          log.stepPass('Batch times verified successfully');
        } catch (e) {
          await log.stepFail(page, 'Failed to verify batch times');
          throw e;
        }

      } catch (e) {
        await log.stepFail(page, 'Failed to modify batch intervals or verify batch times');
        throw e;
      }

      log.step('Restore batch intervals to current EST time');
      try {
        if (profile && profile.data) {
          vars['Time Interval'] = profile.data[0]['Time Interval'];
          vars['NO of Batches'] = profile.data[0]['NO of Batches'];
          log.info('Time Interval: ' + vars['Time Interval']);
          log.info('NO of Batches: ' + vars['NO of Batches']);
        }
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
        log.stepPass('Batch intervals restored to current EST time successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore batch intervals to current EST time');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      REG_TS04_TC05testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS04_TC05testFailed);
    try {
      log.step('Executing after-test steps: Restore bulk batch timing to original value');
      if (REG_TS04_TC05testFailed) {
        if (profile && profile.data) {
          vars['Time Interval'] = profile.data[0]['Time Interval'];
          vars['NO of Batches'] = profile.data[0]['NO of Batches'];
          log.info('Time Interval: ' + vars['Time Interval']);
          log.info('NO of Batches: ' + vars['NO of Batches']);
        }
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
      }
      log.stepPass('After-test steps executed successfully. Bulk batch timing restored to original value');
    } catch (e) {
      await log.stepFail(page, 'Failed to restore bulk batch timing to original value in after-test steps');
      throw e;
    }
  });
});