import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { DeletebatchbuttonPage } from '../../../src/pages/correspondant/deletebatchbutton';
import { DeleteBatchTimePage } from '../../../src/pages/correspondant/delete-batch-time';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS04_TC07';
const TC_TITLE = 'Bulk Batch Timing - Verify Delete batch functionality';

const profileName = 'Administration_Bulk Batch Timing';
const profile = testDataManager.getProfileByName(profileName);

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let chaseFieldNamePage: ChaseFieldNamePage;
  let deletebatchbuttonPage: DeletebatchbuttonPage;
  let deleteBatchTimePage: DeleteBatchTimePage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    deletebatchbuttonPage = new DeletebatchbuttonPage(page);
    deleteBatchTimePage = new DeleteBatchTimePage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
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
        // await expect(page.getByText('Bulk Batch Timing')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Bulk Batch Timing' })).toBeVisible();
        log.stepPass('Navigated to Bulk Batch Timing and page verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing or verify page');
        throw e;
      }

      log.step('Modify batch intervals and capture last batch time and buffer time');
      try {
        if (profile && profile.data) {
          vars['Time Interval'] = profile.data[0]['Time Interval'];
          vars['NO of Batches'] = profile.data[0]['NO of Batches'];
          log.info('Time Interval: ' + vars['Time Interval']);
          log.info('NO of Batches: ' + vars['NO of Batches']);
        }
        await stepGroups.stepGroup_Modifying_The_Batch_Intervals(page, vars);
        vars['LastBatchTime(withspace)'] = await chaseFieldNamePage.Last_batch_Timebulk_batch_screen.textContent() || '';
        vars['DeletedBatchTime1'] = await chaseFieldNamePage.Last_batch_Timebulk_batch_screen.textContent() || '';
        vars['BufferTime'] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';

        Methods.addMinutesToDatetime(vars['LastBatchTime(withspace)'], appconstants.TIME_FORMAT1_HHMMA, parseInt(String(vars['BufferTime'])), appconstants.TIME_FORMAT1_HHMMA, 'BufferedDeletedBatchTime1');
        log.info('LastBatchTime(withspace): ' + vars['LastBatchTime(withspace)']);
        log.info('DeletedBatchTime1: ' + vars['DeletedBatchTime1']);
        log.info('BufferTime: ' + vars['BufferTime']);
        log.info('BufferedDeletedBatchTime1: ' + vars['BufferedDeletedBatchTime1']);
        log.stepPass('Batch intervals modified and batch time/buffer time captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to modify batch intervals or capture batch time/buffer time');
        throw e;
      }

      log.step('Reload page, hover over Bulk Batch Timing and Delete Batch Time, then verify tooltip');
      try {
        await page.reload();
        await statusInactivePage.BulkBatch_Timing.hover();
        await deleteBatchTimePage.Delete_Batch_Time.hover();
        // await expect(page.getByText('Delete Batch Time')).toBeVisible();
        await expect(deleteBatchTimePage.Delete_Batch_Time_Text).toBeVisible();
        log.stepPass('Page reloaded and Delete Batch Time tooltip verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to reload page or verify Delete Batch Time tooltip');
        throw e;
      }

      log.step('Click Delete Batch Time, confirm deletion and verify batch time is removed');
      try {
        await deleteBatchTimePage.Delete_Batch_Time.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(deletebatchbuttonPage.Delete_batch_Button).toContainText('Delete batch');
        await deletebatchbuttonPage.Delete_batch_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForTimeout(3000);
        await expect(page.getByText(vars['DeletedBatchTime1'])).not.toBeVisible();
        log.stepPass('Batch time deleted and removal verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete batch time or verify removal');
        throw e;
      }

      log.step('Reload page, delete last batch time and verify last modified data');
      try {
        await page.reload();
        await stepGroups.stepGroup_Delete_Last_Batch_Time(page, vars);
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        await page.waitForTimeout(3000);
        vars['DeletedBatchTime2'] = vars['LastBatchTime(withspace)'];
        log.info('DeletedBatchTime2: ' + vars['DeletedBatchTime2']);
        await expect(page.getByText(vars['DeletedBatchTime2'])).not.toBeVisible();
        log.stepPass('Last batch time deleted and last modified data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete last batch time or verify last modified data');
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