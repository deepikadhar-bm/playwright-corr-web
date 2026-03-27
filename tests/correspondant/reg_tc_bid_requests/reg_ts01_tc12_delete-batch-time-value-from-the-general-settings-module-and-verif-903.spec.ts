// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidrequestCreationPage } from '../../../src/pages/correspondant/bidrequest-creation';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DeletebatchbuttonPage } from '../../../src/pages/correspondant/deletebatchbutton';
import { DeleteBatchTimePage } from '../../../src/pages/correspondant/delete-batch-time';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';
import { Logger as log } from '../../../src/helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { ENV } from '../../../src/config/environments';
import { testDataManager } from 'testdata/TestDataManager';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidrequestCreationPage: BidrequestCreationPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let deletebatchbuttonPage: DeletebatchbuttonPage;
  let deleteBatchTimePage: DeleteBatchTimePage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidrequestCreationPage = new BidrequestCreationPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deletebatchbuttonPage = new DeletebatchbuttonPage(page);
    deleteBatchTimePage = new DeleteBatchTimePage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
  });

  test('REG_TS01_TC12_Delete batch time value from the general settings module and verify that batch time value should be updated here under today\'s pricing return time value.', async ({ page }) => {

    const TC_ID = 'REG_TS01_TC12';
    const TC_TITLE = 'Delete batch time value from the general settings module and verify that batch time value should be updated here under today\'s pricing return time value';

    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Test Data & Credentials ─────────────────────────────
      log.step('Loading test data and credentials');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
        if (profile2 && profile2.data) {
          const TimeInterval = profile2.data[0]['Time Interval'];
          vars["Time Interval"] = TimeInterval;

          const NoOfBatches = profile2.data[0]['NO of Batches'];
          vars["NO of Batches"] = NoOfBatches;
        log.stepPass('Test data and credentials loaded');
        }
      }
        catch (e) {
        await log.stepFail(page, 'Failed to load test data');
        throw e;
      }

      // ── Step 2: Login & Navigate ──────────────────────────────────────────
      log.step('Login and navigation to Correspondent Portal and Bulk Batch Timing');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bulk Batch Timing").first()).toBeVisible();
        log.info('"Bulk Batch Timing" page is visible');

        log.stepPass('Login and navigation successful');
      } catch (e) {
        await log.stepFail(page, 'Login/navigation failed');
        throw e;
      }

      // ── Step 3: Modify Batch Intervals & Capture Batch Time Variables ─────
      log.step('Modifying batch intervals and capturing batch time variables');
      try {
        //await stepGroups.stepGroup_Modifying_The_Batch_Intervals(page, vars);
        await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
        vars["LastBatchTime(withspace)"] = await chaseFieldNamePage.Last_batch_Timebulk_batch_screen.textContent() || '';
        log.info(`LastBatchTime(withspace): ${vars["LastBatchTime(withspace)"]}`);

        vars["DeletedBatchTime1"] = await chaseFieldNamePage.Last_batch_Timebulk_batch_screen.textContent() || '';
        log.info(`DeletedBatchTime1: ${vars["DeletedBatchTime1"]}`);

        vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
        log.info(`BufferTime: ${vars["BufferTime"]}`);

        vars["BufferedDeletedBatchTime1"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["LastBatchTime(withspace)"]));
          d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
        })();
        log.info(`BufferedDeletedBatchTime1: ${vars["BufferedDeletedBatchTime1"]}`);

        log.stepPass('Batch intervals modified and time variables captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Batch interval modification or variable capture failed');
        throw e;
      }

      // ── Step 4: Delete First Batch Time via UI ────────────────────────────
      log.step('Reloading page and deleting first batch time via Delete Batch Time menu');
      try {
        await page.reload();
        await page.waitForLoadState('load');
        log.info('Page reloaded successfully');

        await statusInactivePage.BulkBatch_Timing.hover();
        await deleteBatchTimePage.Delete_Batch_Time.hover();
        await expect(page.getByText("Delete Batch Time")).toBeVisible();
        log.info('"Delete Batch Text" option is visible on hovering');

        await deleteBatchTimePage.Delete_Batch_Time.click();
        page.waitForTimeout(2000);
        page.pause();
        await deletebatchbuttonPage.Delete_batch_Button.waitFor({state: 'visible'});
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        await expect(deletebatchbuttonPage.Delete_batch_Button).toContainText("Delete batch");
        log.info('"Delete batch" button is visible and contains expected text');

        await deletebatchbuttonPage.Delete_batch_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForTimeout(3000);

        await expect(page.getByText(vars["DeletedBatchTime1"])).not.toBeVisible();
        log.info(`PASS — DeletedBatchTime1 (${vars["DeletedBatchTime1"]}) is no longer visible after deletion`);

        log.stepPass('First batch time deleted successfully');
      } catch (e) {
        await log.stepFail(page, 'First batch time deletion failed');
        throw e;
      }

      // ── Step 5: Delete Last Batch Time via Step Group ─────────────────────
      log.step('Reloading page and deleting last batch time via step group');
      try {
        await page.reload();
        await page.waitForLoadState('load');
        log.info('Page reloaded successfully');

        await stepGroups.stepGroup_Delete_Last_Batch_Time(page, vars);
        await page.waitForTimeout(3000);

        await expect(page.getByText(vars["LastBatchTime(withspace)"])).not.toBeVisible();
        log.info(`PASS — LastBatchTime(withspace) (${vars["LastBatchTime(withspace)"]}) is no longer visible after deletion`);

        vars["DeletedBatchTime2"] = vars["LastBatchTime(withspace)"];
        log.info(`DeletedBatchTime2 set to: ${vars["DeletedBatchTime2"]}`);

        log.stepPass('Last batch time deleted successfully');
      } catch (e) {
        await log.stepFail(page, 'Last batch time deletion failed');
        throw e;
      }

      // ── Step 6: Navigate to Bid Requests & Open Upload Form ──────────────
      log.step('Navigating to Bid Requests and opening Upload New Bid Request form');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Requests").first()).toBeVisible();
        log.info('"Bid Requests" page is visible');

        await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Request Details\r")).toBeVisible();
        log.info('"Bid Request Details" page is visible');

        log.stepPass('Bid Request upload form opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to open Bid Request upload form');
        throw e;
      }

      // ── Step 7: Validate Deleted Batch Times Not Present in Dropdown ──────
      log.step('Validating that deleted batch times are not present in Pricing Return Time dropdown');
      try {
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();

        await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BufferedDeletedBatchTime1"] })).not.toBeVisible();
        log.info(`PASS — BufferedDeletedBatchTime1 (${vars["BufferedDeletedBatchTime1"]}) is NOT visible in dropdown`);

        await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BufferedDeletedBatchTime2"] })).not.toBeVisible();
        log.info(`PASS — BufferedDeletedBatchTime2 (${vars["BufferedDeletedBatchTime2"]}) is NOT visible in dropdown`);

        log.stepPass('All deleted batch times are correctly absent from the dropdown');
      } catch (e) {
        await log.stepFail(page, 'Dropdown batch time validation failed');
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