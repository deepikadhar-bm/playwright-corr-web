import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidUploadDatePage } from '../../../src/pages/correspondant/bid-upload-date';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DeletebatchbuttonPage } from '../../../src/pages/correspondant/deletebatchbutton';
import { DeleteBatchTimePage } from '../../../src/pages/correspondant/delete-batch-time';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS04_TC04';
const TC_TITLE = 'Bulk Batch Timing - No Time Interval Present in the Bulk Batch Timing';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidUploadDatePage: BidUploadDatePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let deletebatchbuttonPage: DeletebatchbuttonPage;
  let deleteBatchTimePage: DeleteBatchTimePage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  let REG_TS04_TC04_testFailed = false;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    bidUploadDatePage = new BidUploadDatePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deletebatchbuttonPage = new DeletebatchbuttonPage(page);
    deleteBatchTimePage = new DeleteBatchTimePage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to CORR Portal successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to CORR Portal');
        throw e;
      }

      log.step('Navigate to Bulk Batch Timing and verify page heading');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByRole('heading', { name: 'Bulk Batch Timing' })).toBeVisible();
        log.stepPass('Navigated to Bulk Batch Timing and page heading verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing or page heading not visible');
        throw e;
      }

      log.step('Modify batch intervals with current EST time');
      try {
        const profileName = 'Administration_Bulk Batch Timing';
        const profile = testDataManager.getProfileByName(profileName);
        if (profile && profile.data) {
          vars['Time Interval'] = profile.data[0]['Time Interval'];
          vars['NO of Batches'] = profile.data[0]['NO of Batches'];
          log.info('Time Interval: ' + vars['Time Interval']);
          log.info('NO of Batches: ' + vars['NO of Batches']);
        }
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
        log.stepPass('Batch intervals modified with current EST time successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to modify batch intervals with current EST time');
        throw e;
      }

      log.step('Delete all existing batch times');
      try {
        vars["BatchesCount"] = String(await correspondentPortalPage.Batches_Count.count());
        vars["Count"] = appconstants.ONE;
        log.info('BatchesCount to delete: ' + vars['BatchesCount']);

        while (parseFloat(vars["Count"]) <= parseFloat(vars["BatchesCount"])) {
          log.info('Deleting batch: ' + vars['Count']);
          await deleteBatchTimePage.Delete_Batch_Time.hover();
          // await expect(page.getByText("Delete Batch Time")).toBeVisible();
          await expect(deleteBatchTimePage.Delete_Batch_Time_Text).toBeVisible();
          await deleteBatchTimePage.Delete_Batch_Time.click();
          await deletebatchbuttonPage.Delete_batch_Button.waitFor({ state: 'visible' });
          await deletebatchbuttonPage.Delete_batch_Button.click();
          await page.waitForTimeout(4000);
          Methods.MathematicalOperation(vars["Count"], '+', 1, 'Count');
        }
        log.stepPass('All ' + vars['BatchesCount'] + ' batch time(s) deleted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete one or more batch times');
        throw e;
      }

      log.step('Navigate to Upload New Bid Request and verify Pricing Return Time dropdown');
      try {
        await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        await correspondentPortalPage.Pricing_Return_Time.click();
        await expect(bidUploadDatePage.Pricing_Return_Time_Dtopdown).toBeHidden();
        log.stepPass('Navigated to Upload New Bid Request and Pricing Return Time dropdown verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Upload New Bid Request or Pricing Return Time dropdown not visible');
        throw e;
      }

      log.step('Navigate back to Bulk Batch Timing and restore batch intervals with current EST time');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
        log.stepPass('Navigated back to Bulk Batch Timing and batch intervals restored with current EST time successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate back to Bulk Batch Timing or restore batch intervals');
        throw e;
      }

      log.tcEnd('PASS');
    } catch (e) {
      REG_TS04_TC04_testFailed = true;
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS04_TC04_testFailed);
    try {
      log.step('Executing after-test steps: Restore bulk batch timing to original value');
      if (REG_TS04_TC04_testFailed) {
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