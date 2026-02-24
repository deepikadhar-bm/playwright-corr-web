// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BatchinbulkbatchtimingPage } from '../../../src/pages/correspondant/batchinbulkbatchtiming';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { P24UnitDropdownPage } from '../../../src/pages/correspondant/p-24-unit-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let batchinbulkbatchtimingPage: BatchinbulkbatchtimingPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let p24UnitDropdownPage: P24UnitDropdownPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    batchinbulkbatchtimingPage = new BatchinbulkbatchtimingPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    p24UnitDropdownPage = new P24UnitDropdownPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS22_TC11_Reprice bid for #Bid req ID\\\" popup : Add a new batch record without selecting \\\"Chase only\\\" option, and verify the value should be displayed in the pricing return time dropdown for tod', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Pricing_Return_Time.click();
    if (true) /* Element Enabled Time is visible */ {
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    } else {
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page, vars);
    }
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Bulk Batch Timing")).toBeVisible();
    vars["LastBeforeBatchTime"] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
    vars["BatchTime(FewMinAdded)"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["LastBeforeBatchTime"]));
      d.setMinutes(d.getMinutes() + parseInt(String("1")));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
    })();
    vars["MinWithStandard"] = String(vars["BatchTime(FewMinAdded)"]).split(":")["2"] || '';
    vars["Time_Hour"] = String(vars["BatchTime(FewMinAdded)"]).substring(0, String(vars["BatchTime(FewMinAdded)"]).length - 6);
    vars["Time_Min"] = String(vars["MinWithStandard"]).substring(0, String(vars["MinWithStandard"]).length - 3);
    vars["Time_Unit"] = String(vars["MinWithStandard"]).substring(3);
    await correspondentPortalPage.Add_A_Batch_Button.click();
    await expect(page.getByText("Add a Batch")).toBeVisible();
    await expect(p24UnitDropdownPage.Select_Rules_Checkbox).toBeVisible();
    await correspondentPortalPage.StartTime_In_Hour.fill(vars["Time_Hour"]);
    vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
    await correspondentPortalPage.StartTime_In_Minutes.fill(vars["Time_Min"]);
    vars["AddStartTimeInMin"] = await correspondentPortalPage.StartTime_In_Minutes.inputValue() || '';
    await stepGroups.stepGroup_selecting_time_unit_bulk_batch(page, vars);
    await correspondentPortalPage.Add_Batch_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Wait until the current page is loaded completely
    // await page.waitForLoadState('networkidle');
    await expect(page.getByText("Create Batch Timing")).toBeVisible();
    // [DISABLED] Wait until the element Batch timing has been updated successfully_Success_Message is visible
    // await correspondentPortalPage.Batch_timing_has_been_updated_successfully_Success_Message.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Batch_timing_has_been_created_successfully_Success_Message).toBeVisible();
    await expect(page.getByText(vars["BatchTime(FewMinAdded)"])).toBeVisible();
    await okButtonPage.Ok_Button.click();
    vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
    vars["AddedBatchTime"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["BatchTime(FewMinAdded)"]));
      d.setMinutes(d.getMinutes() + parseInt(String(vars["PricingReturnTimeBuffer"])));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
    })();
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["StatusToBeSelected"] = "Upload Expired";
    vars["ExecutionType"] = "Standard";
    await stepGroups.stepGroup_Filtering_Status_and_Navigating_to_Filtered_Status_Bid_Reque(page, vars);
    await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Dropdown_selection_2.click();
    await page.waitForTimeout(5000);
    await expect(correspondentPortalPage.Dropdown_selection_2.locator('option', { hasText: vars["AddedBatchTime"] })).toBeVisible();
    await correspondentPortalPage.bidRequestDate_Next_Bussiness_Radio_Button.check();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Dropdown_selection_2.click();
    await expect(correspondentPortalPage.Dropdown_selection_2).not.toContainText(vars["AddedBatchTime"]);
  });
});
