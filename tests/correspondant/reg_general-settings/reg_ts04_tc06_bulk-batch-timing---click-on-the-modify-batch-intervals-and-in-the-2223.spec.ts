import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BatchinbulkbatchtimingPage } from '../../../src/pages/correspondant/batchinbulkbatchtiming';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS04_TC06';
const TC_TITLE = 'Bulk Batch Timing - Click on the Modify Batch Intervals, and in the displayed Popup Modify the Timings and Click on the Today and Future Business Days.';

const profileName = 'Administration_Bulk Batch Timing';
const profile = testDataManager.getProfileByName(profileName);

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let batchinbulkbatchtimingPage: BatchinbulkbatchtimingPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  let REG_TS04_TC06testFailed = false;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    batchinbulkbatchtimingPage = new BatchinbulkbatchtimingPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Login ─────────────────────────────────────────────────────────
      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to CORR Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to CORR Portal failed');
        throw e;
      }

      // ── Step 2: Navigate to Bulk Batch Timing ─────────────────────────────────
      log.step('Navigate to Bulk Batch Timing and verify page');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        // await expect(page.getByText('Bulk Batch Timing')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Bulk Batch Timing' })).toBeVisible();
        log.stepPass('Navigated to Bulk Batch Timing and page verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing or verify page');
        throw e;
      }

      // ── Step 3: Modify batch intervals (first pass) ───────────────────────────
      log.step('Modify batch intervals with current EST time');
      try {
        vars['Time Interval'] = appconstants.FIVE;
        vars['NO of Batches'] = appconstants.TWO;
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
        log.stepPass('Batch intervals modified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to modify batch intervals');
        throw e;
      }

      // ── Step 4: Verify Batch 1 and Batch 2 times ─────────────────────────────
      log.step('Verify Batch 1 and Batch 2 times reflect updated EST time');
      try {
        Methods.addMinutesToDatetime(vars['CurrentTime'], appconstants.TIME_FORMAT1_HHMMA, 5, appconstants.TIME_FORMAT1_HHMMA, 'ExpectedBatch2Time');
        log.info(`CurrentTime: ${vars['CurrentTime']}`);
        log.info(`ExpectedBatch2Time: ${vars['ExpectedBatch2Time']}`);
        await expect(batchinbulkbatchtimingPage.Batch_1_bulk_bacthes).toContainText(vars['CurrentTime']);
        await expect(batchinbulkbatchtimingPage.Batch_2Bulk_batches).toContainText(vars['ExpectedBatch2Time']);
        log.stepPass('Batch 1 and Batch 2 times verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Batch 1 or Batch 2 time verification failed');
        throw e;
      }

      // ── Step 5: Modify batch intervals (second pass / Today) ───────
      log.step('Modify batch intervals again and verify Today and Future Business Days update');
      try {
        if (profile && profile.data) {
          vars['Time Interval'] = profile.data[0]['Time Interval'];
          vars['NO of Batches'] = profile.data[0]['NO of Batches'];
          log.info('Time Interval: ' + vars['Time Interval']);
          log.info('NO of Batches: ' + vars['NO of Batches']);
        }
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
        log.stepPass('Batch intervals modified and Today and Future Business Days verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to modify batch intervals for Today and Future Business Days');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      REG_TS04_TC06testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS04_TC06testFailed);

    // Restore bulk batch timing only when the test has failed
    if (REG_TS04_TC06testFailed) {
      log.step('Executing after-test steps: Restore bulk batch timing to original value');
      try {
        if (profile && profile.data) {
          vars['Time Interval'] = profile.data[0]['Time Interval'];
          vars['NO of Batches'] = profile.data[0]['NO of Batches'];
          log.info('Time Interval: ' + vars['Time Interval']);
          log.info('NO of Batches: ' + vars['NO of Batches']);
        }
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
        log.stepPass('After-test steps executed successfully. Bulk batch timing restored to original value');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore bulk batch timing to original value in after-test steps');
        throw e;
      }
    } else {
      log.info('Test passed — no cleanup required in after-test steps');
    }
  });
});