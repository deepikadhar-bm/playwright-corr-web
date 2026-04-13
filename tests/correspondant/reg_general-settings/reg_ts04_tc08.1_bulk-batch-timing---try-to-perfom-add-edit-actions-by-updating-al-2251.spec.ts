import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BatchinbulkbatchtimingPage } from '../../../src/pages/correspondant/batchinbulkbatchtiming';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2246 } from '../../../src/helpers/prereqs/prereq-2246';
import { Logger as log } from '@helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';

const TC_ID = 'REG_TS04_TC08.1';
const TC_TITLE = 'Bulk Batch Timing - Verify edit failure on already created batch timings';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let batchinbulkbatchtimingPage: BatchinbulkbatchtimingPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2246(page, vars);

    batchinbulkbatchtimingPage = new BatchinbulkbatchtimingPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Capture third batch time and split into hour/minute');
      try {
        vars["ThirdBatchFromLast"] = await bidRequestPage.Third_Batch_From_the_Last.textContent() || '';
        // vars["RequiredBatchTime"] = vars["ThirdBatchFromLast"];
        // await stepGroups.stepGroup_Separating_Hours_and_Minutes(page, vars);
        Methods.splitBySpecialChar(vars['ThirdBatchFromLast'], ':', '1', 'MinWithStandard');
        Methods.removeCharactersFromPosition(vars['ThirdBatchFromLast'], '0', '6', 'Time_Hour');
        Methods.removeCharactersFromPosition(vars['MinWithStandard'], '0', '3', 'Time_Min');
        Methods.removeCharactersFromPosition(vars['MinWithStandard'], '3', '0', 'Time_Unit');
        log.stepPass('Batch time captured and split successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture or split batch time');
        throw e;
      }

      log.step('Open Edit Batch Timing popup');
      try {
        await batchinbulkbatchtimingPage.Batch_Time_Last_Before.hover();
        await batchinbulkbatchtimingPage.Edit_Batch_ButtonLast_Before.click();
        await expect(page.getByText("Edit Batch Timing")).toBeVisible();
        log.stepPass('Edit Batch Timing popup opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to open Edit Batch Timing popup');
        throw e;
      }

      log.step('Update batch time with existing values and apply changes');
      try {
        await correspondentPortalPage.StartTime_In_Hour.click();
        await correspondentPortalPage.StartTime_In_Hour.clear();
        await correspondentPortalPage.StartTime_In_Hour.fill(vars["Time_Hour"]);
        await correspondentPortalPage.StartTime_In_Minutes.click();
        await correspondentPortalPage.StartTime_In_Minutes.clear();
        await correspondentPortalPage.StartTime_In_Minutes.fill(vars["Time_Min"]);
        await expect(correspondentPortalPage.Apply_Changes_Button).toBeEnabled();
        await correspondentPortalPage.Apply_Changes_Button.click();
        log.stepPass('Batch time updated with existing values and applied');
      } catch (e) {
        await log.stepFail(page, 'Failed to update batch time or apply changes');
        throw e;
      }

      log.step('Verify failure message and acknowledge');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Failed to Update Batch Timings")).toBeVisible();
        await okButtonPage.Ok_Button.click();
        log.stepPass('Failure message verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify failure message');
        throw e;
      }

      log.step('Verify last modified data remains unchanged');
      try {
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.stepPass('Last modified data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify last modified data');
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