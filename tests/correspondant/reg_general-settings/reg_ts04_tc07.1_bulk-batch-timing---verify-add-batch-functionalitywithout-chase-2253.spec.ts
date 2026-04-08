import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BatchinbulkbatchtimingPage } from '../../../src/pages/correspondant/batchinbulkbatchtiming';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS04_TC07.1';
const TC_TITLE = 'Bulk Batch Timing - Verify Add batch functionality(Without Chase)';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let batchinbulkbatchtimingPage: BatchinbulkbatchtimingPage;
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

      log.step('Capture last batch time and calculate new batch time to add');
      try {
        vars['LastBeforeBatchTime'] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
        Methods.addMinutesToDatetime(vars['LastBeforeBatchTime'], appconstants.TIME_FORMAT1_HHMMA, 2, appconstants.TIME_FORMAT1_HHMMA, 'BatchTime(FewMinAdded)');
        vars['AddedBatchTime'] = vars['BatchTime(FewMinAdded)'];
        Methods.splitBySpecialChar(vars['BatchTime(FewMinAdded)'], ':', '1', 'MinWithStandard');
        Methods.removeCharactersFromPosition(vars['BatchTime(FewMinAdded)'], '0', '6','Time_Hour');
        Methods.removeCharactersFromPosition(vars['MinWithStandard'], '0', '3','Time_Min');
        Methods.removeCharactersFromPosition(vars['MinWithStandard'], '3', '0','Time_Unit');
        log.info('LastBeforeBatchTime: ' + vars['LastBeforeBatchTime']);
        log.info('AddedBatchTime: ' + vars['AddedBatchTime']);
        log.info('Time_Hour: ' + vars['Time_Hour']);
        log.info('Time_Min: ' + vars['Time_Min']);
        log.info('Time_Unit: ' + vars['Time_Unit']);
        log.stepPass('Last batch time captured and new batch time calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture last batch time or calculate new batch time');
        throw e;
      }

      log.step('Click Add a Batch button and fill in batch time details');
      try {
        await correspondentPortalPage.Add_A_Batch_Button.click();
        // await expect(page.getByText('Add a Batch')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Add a Batch' })).toBeVisible();
        await correspondentPortalPage.StartTime_In_Hour.click();
        await correspondentPortalPage.StartTime_In_Hour.fill(vars['Time_Hour']);
        await correspondentPortalPage.StartTime_In_Minutes.click();
        await correspondentPortalPage.StartTime_In_Minutes.fill(vars['Time_Min']);
        vars['AddStartTimeInMin'] = await correspondentPortalPage.StartTime_In_Minutes.inputValue() || '';
        log.info('AddStartTimeInMin: ' + vars['AddStartTimeInMin']);
        if (String(vars['Time_Unit']).includes(String('PM'))) {
          log.info('Selecting PM for time unit');
          await correspondentPortalPage.Dropdown_selection_2.selectOption({ label: 'PM' });
          await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue('PM');
        }
        await correspondentPortalPage.Add_Batch_Button.click();
        log.stepPass('Batch time details filled and Add Batch button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to fill batch time details or click Add Batch button');
        throw e;
      }

      log.step('Verify batch creation success message and confirm');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText('Create Batch Timing')).toBeVisible();
        await expect(correspondentPortalPage.Batch_timing_has_been_created_successfully_Success_Message).toBeVisible();
        await okButtonPage.Ok_Button.click();
        log.stepPass('Batch creation success message verified and confirmed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify batch creation success message or confirm');
        throw e;
      }

      log.step('Verify newly added batch time and last modified data');
      try {
        vars['ActualBatchTime'] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
        log.info('ActualBatchTime: ' + vars['ActualBatchTime']);
        Methods.verifyString(vars['ActualBatchTime'],'equals', vars['AddedBatchTime']);
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.stepPass('Newly added batch time and last modified data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify newly added batch time or last modified data');
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