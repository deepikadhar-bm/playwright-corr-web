// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BatchinbulkbatchtimingPage } from '../../../src/pages/correspondant/batchinbulkbatchtiming';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2246 } from '../../../src/helpers/prereqs/prereq-2246';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let batchinbulkbatchtimingPage: BatchinbulkbatchtimingPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2246(page, vars);
    batchinbulkbatchtimingPage = new BatchinbulkbatchtimingPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS04_TC08.1_Bulk Batch Timing - Try to perfom add / edit actions by updating already created batch timings', async ({ page }) => {

    vars["ThirdBatchFromLast"] = await bidRequestPage.Third_Batch_From_the_Last.textContent() || '';
    await stepGroups.stepGroup_Separating_Hours_and_Minutes(page, vars);
    await batchinbulkbatchtimingPage.Batch_Time_Last_Before.hover();
    await batchinbulkbatchtimingPage.Edit_Batch_ButtonLast_Before.click();
    await expect(page.getByText("Edit Batch Timing")).toBeVisible();
    await correspondentPortalPage.StartTime_In_Hour.clear();
    await correspondentPortalPage.StartTime_In_Hour.fill(vars["Time_Hour"]);
    await correspondentPortalPage.StartTime_In_Minutes.clear();
    await correspondentPortalPage.StartTime_In_Minutes.fill(vars["Time_Min"]);
    await expect(correspondentPortalPage.Apply_Changes_Button).toBeVisible();
    await correspondentPortalPage.Apply_Changes_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Failed to Update Batch Timings")).toBeVisible();
    await okButtonPage.Ok_Button.click();
    await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
  });
});
