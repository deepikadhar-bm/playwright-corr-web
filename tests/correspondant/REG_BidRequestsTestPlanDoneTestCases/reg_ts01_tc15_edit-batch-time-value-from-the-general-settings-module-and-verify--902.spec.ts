// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BatchinbulkbatchtimingPage } from '../../../src/pages/correspondant/batchinbulkbatchtiming';
import { BidrequestCreationPage } from '../../../src/pages/correspondant/bidrequest-creation';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
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
  let batchinbulkbatchtimingPage: BatchinbulkbatchtimingPage;
  let bidrequestCreationPage: BidrequestCreationPage;
  let bidrequestPage: BidrequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    batchinbulkbatchtimingPage = new BatchinbulkbatchtimingPage(page);
    bidrequestCreationPage = new BidrequestCreationPage(page);
    bidrequestPage = new BidrequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
  });

  test('REG_TS01_TC15_Edit batch time value from the general settings module and verify that batch time value should be updated here under today\'s pricing return time value.', async ({ page }) => {
    log.step('Fetching credentials and initializing login variables');
    const credentials = ENV.getCredentials('internal');
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
    
    log.step('Logging in to the Correspondent Portal');
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);

    log.step('Deleting early config report if present');
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);

    log.step('Navigating to Bulk Batch Timing');
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);

    log.step('Waiting for spinner to hide after navigation');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });

    vars["LastBeforeBatchTime"] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
    log.info(`Captured LastBeforeBatchTime from UI: "${vars["LastBeforeBatchTime"]}"`);

    vars["LastBeforeBatchTime"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["LastBeforeBatchTime"]));
      d.setMinutes(d.getMinutes() + parseInt(String("1")));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    })();
    log.info(`Computed LastBeforeBatchTime (+1 min): "${vars["LastBeforeBatchTime"]}"`);

    vars["ExpectedEditedTime"] = vars["LastBeforeBatchTime"];
    
    log.info(`ExpectedEditedTime set to: "${vars["ExpectedEditedTime"]}"`);
    vars["RequiredBatchTime"] = vars["ExpectedEditedTime"];
    log.step('Separating Hours and Minutes from batch time');
    await stepGroups.stepGroup_Separating_Hours_and_Minutes(page, vars);
    log.step('Hovering over Bulk Batch Timing and clicking Edit Batch Time');
    await statusInactivePage.BulkBatch_Timing.hover();
    await correspondentPortalPage.Edit_Batch_Time.click();
    await expect(page.getByText("Edit Batch Timing")).toBeVisible();

    log.step(`Entering Time_Hour: "${vars["Time_Hour"]}" into StartTime_In_Hour field`);
    await correspondentPortalPage.StartTime_In_Hour.clear();
    await correspondentPortalPage.StartTime_In_Hour.pressSequentially(vars["Time_Hour"]);

    log.step(`Entering Time_Min: "${vars["Time_Min"]}" into StartTime_In_Minutes field`);
    await correspondentPortalPage.StartTime_In_Minutes.clear();
    await correspondentPortalPage.StartTime_In_Minutes.pressSequentially(vars["Time_Min"]);
    await stepGroups.stepGroup_selecting_time_unit_bulk_batch(page, vars);
    log.step('Clicking Apply Changes button');
    await expect(correspondentPortalPage.Apply_Changes_Button).toBeVisible();
    await correspondentPortalPage.Apply_Changes_Button.click();

    log.step('Waiting for spinner to hide after applying changes');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });

    log.step('Verifying Update Batch Timing dialog and success message');
    await expect(page.getByText("Update Batch Timing")).toBeVisible();
    await expect(correspondentPortalPage.Batch_timing_has_been_updated_successfully_Success_Message).toBeVisible();

    log.step('Clicking OK button to dismiss dialog');
    await okButtonPage.Ok_Button.click();

    //log.step(`Waiting for ExpectedEditedTime "${vars["ExpectedEditedTime"]}" to be visible on page`);
    //await page.getByText(`${vars["ExpectedEditedTime"]}`).waitFor({ state: 'visible' });

    vars["EditedBatchTime"] = await bidrequestPage.Edited_Batch(vars["LastBeforeBatchTime"]).textContent() || '';
    log.info(`Captured EditedBatchTime from UI: "${vars["EditedBatchTime"]}"`);

    vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
    log.info(`Captured BufferTime: "${vars["BufferTime"]}"`);

    vars["BufferEditedTime"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["EditedBatchTime"]));
      d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    })();
    log.info(`Computed BufferEditedTime (EditedBatchTime + BufferTime): "${vars["BufferEditedTime"]}"`);

    log.step('Navigating to Bid Requests page');
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Bid Requests").first()).toBeVisible();

    log.step('Clicking Upload New Bid Request button');
    await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Bid Request Details")).toBeVisible();

    log.step(`Verifying BufferEditedTime "${vars["BufferEditedTime"]}" is visible in Pricing Return Time dropdown`);
    await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();
    //await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BufferEditedTime"] })).toBeVisible();
    await correspondentPortalPage.Pricing_Return_Time.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Pricing_Return_Time.locator(`option[value="${vars["BufferEditedTime"]}"]`)).toBeAttached();
    log.pass("Edited batch time is available in the dropdown");
  });
});