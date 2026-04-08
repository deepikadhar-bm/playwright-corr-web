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
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { testDataManager } from 'testdata/TestDataManager';

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

    const TC_ID = 'REG_TS22_TC11';
    const TC_TITLE = 'Reprice bid popup: Add a new batch record without "Chase only" option and verify the value is displayed in the pricing return time dropdown for today.';

    try {
      log.tcStart(TC_ID, TC_TITLE);

      // ── Step 1: Login & Navigate ──────────────────────────────────────────
      log.step('Logging into Correspondent Portal and clearing early config report');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
        if (profile2 && profile2.data) {
          const TimeInterval = profile2.data[0]['Time Interval'];
          vars["Time Interval"] = TimeInterval;
          log.info(`Loaded Time Interval: ${vars["Time Interval"]}`);

          const NoOfBatches = profile2.data[0]['NO of Batches'];
          vars["NO of Batches"] = NoOfBatches;
          log.info(`Loaded NO of Batches: ${vars["NO of Batches"]}`);
        }

        const profile1 = testDataManager.getProfileByName("Bid Requests");
        if (profile1 && profile1.data) {
          const CompanyName = profile1.data[0]['Company Name'];
          vars["CompanyName"] = CompanyName;
          log.info(`Loaded Company Name: ${vars["CompanyName"]}`);
        }
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        log.info('Logged in and cleared any early config report');

        log.stepPass('Login and early config cleanup successful');
      } catch (e) {
        await log.stepFail(page, 'Failed to login or clear early config report');
        throw e;
      }

      // ── Step 2: Navigate to Upload New Bid Request & Check Enabled Time ───
      log.step('Navigating to Upload New Bid Request and checking Enabled Time visibility');
      try {
        await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Navigated to Upload New Bid Request, spinner hidden');

        await correspondentPortalPage.Pricing_Return_Time.click();
        log.info('Clicked Pricing Return Time');
        let isVisible = false;
        try {
          await page.locator('app-single-select-dropdown#pricingReturnTimeDropdown').waitFor({ state: 'visible', timeout: 10000 });
          const count = await new CorrPortalPage(page).Second_Enabled_Time.count();
          log.info(`Second_Enabled_Time element count: ${count}`);
          isVisible = count > 0;
        } catch {
          isVisible = false;
        }
        log.info(`Is the second enabled batch time visible? ${isVisible}`);
        if (isVisible) /* Element Enabled Time is visible */ {
          log.info('Enabled Time is visible — navigating to Bulk Batch Timing without modification');
          await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        } else {
          log.info('Enabled Time is NOT visible — navigating to Bulk Batch Timing and modifying batches with one hour prior');
          await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
          await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page, vars);
        }

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bulk Batch Timing").first()).toBeVisible();
        log.info('Bulk Batch Timing page is visible');

        log.stepPass('Navigation to Bulk Batch Timing and conditional batch modification successful');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing or modify batches');
        throw e;
      }

      // ── Step 3: Compute New Batch Time from Last Batch ────────────────────
      log.step('Reading last batch time and computing new batch time values');
      try {
        vars["LastBeforeBatchTime"] = await batchinbulkbatchtimingPage.Last_Before_Batch_Time.textContent() || '';
        log.info(`LastBeforeBatchTime: ${vars["LastBeforeBatchTime"]}`);

        vars["BatchTime(FewMinAdded)"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["LastBeforeBatchTime"]));
          d.setMinutes(d.getMinutes() + parseInt(String("1")));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
        })();
        log.info(`BatchTime(FewMinAdded): ${vars["BatchTime(FewMinAdded)"]}`);

        vars["MinWithStandard"] = String(vars["BatchTime(FewMinAdded)"]).split(":")["1"] || '';
        vars["Time_Hour"] = String(vars["BatchTime(FewMinAdded)"]).substring(0, String(vars["BatchTime(FewMinAdded)"]).length - 6);
        vars["Time_Min"] = String(vars["MinWithStandard"]).substring(0, String(vars["MinWithStandard"]).length - 3);
        vars["Time_Unit"] = String(vars["MinWithStandard"]).substring(3);
        log.info(`Parsed — Time_Hour: ${vars["Time_Hour"]}, Time_Min: ${vars["Time_Min"]}, Time_Unit: ${vars["Time_Unit"]}`);

        log.stepPass('New batch time computed and parsed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to compute new batch time from last batch');
        throw e;
      }

      // ── Step 4: Add New Batch Record (without Chase only) ─────────────────
      log.step('Adding a new batch record without Chase only option');
      try {
        await correspondentPortalPage.Add_A_Batch_Button.click();
        log.info('Clicked Add A Batch button');

        await expect(page.getByText("Add a Batch").first()).toBeVisible();
        log.info('"Add a Batch" dialog is visible');

        await expect(p24UnitDropdownPage.Select_Rules_Checkbox).toBeVisible();
        log.info('Select Rules checkbox is visible (not checked — Chase only not selected)');

        await correspondentPortalPage.StartTime_In_Hour.fill(vars["Time_Hour"]);
        log.info(`Filled Start Time Hour: ${vars["Time_Hour"]}`);

        vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
        log.info(`PricingReturnTimeBuffer (before fill): ${vars["PricingReturnTimeBuffer"]}`);

        await correspondentPortalPage.StartTime_In_Minutes.fill(vars["Time_Min"]);
        log.info(`Filled Start Time Minutes: ${vars["Time_Min"]}`);

        vars["AddStartTimeInMin"] = await correspondentPortalPage.StartTime_In_Minutes.inputValue() || '';
        log.info(`AddStartTimeInMin (verified input value): ${vars["AddStartTimeInMin"]}`);

        await stepGroups.stepGroup_selecting_time_unit_bulk_batch(page, vars);
        log.info('Time unit selected via step group');

        await correspondentPortalPage.Add_Batch_Button.click();
        log.info('Clicked Add Batch Button');

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner hidden after clicking Add Batch');

        // [DISABLED] Wait until the current page is loaded completely
        // await page.waitForLoadState('load');

        await expect(page.getByText("Create Batch Timing")).toBeVisible();
        log.info('"Create Batch Timing" text is visible');

        // [DISABLED] Wait until the element Batch timing has been updated successfully_Success_Message is visible
        // await correspondentPortalPage.Batch_timing_has_been_updated_successfully_Success_Message.waitFor({ state: 'visible' });

        await expect(correspondentPortalPage.Batch_timing_has_been_created_successfully_Success_Message).toBeVisible();
        log.info('Batch created successfully message is visible');

        await expect(page.getByText(vars["BatchTime(FewMinAdded)"])).toBeVisible();
        log.info(`New batch time "${vars["BatchTime(FewMinAdded)"]}" is visible on page`);

        await okButtonPage.Ok_Button.click();
        log.info('Clicked OK button on success message');

        vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
        log.info(`PricingReturnTimeBuffer (after OK): ${vars["PricingReturnTimeBuffer"]}`);

        vars["AddedBatchTime"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["BatchTime(FewMinAdded)"]));
          d.setMinutes(d.getMinutes() + parseInt(String(vars["PricingReturnTimeBuffer"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
        })();
        log.info(`AddedBatchTime (with buffer applied): ${vars["AddedBatchTime"]}`);

        log.stepPass('New batch record added and AddedBatchTime computed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add new batch record');
        throw e;
      }

      // ── Step 5: Navigate to Bid Requests & Apply Filters ─────────────────
      log.step('Navigating to Bid Requests and applying Upload Expired status filter');
      try {
        await page.waitForLoadState('load');
        log.info('Page load load state reached');

        await correspondentPortalPage.Bid_Requests.click();
        log.info('Clicked Bid Requests menu');

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner hidden after navigating to Bid Requests');

        vars["StatusToBeSelected"] = "Upload Expired";
        vars["ExecutionType"] = "Standard";
        log.info(`StatusToBeSelected: ${vars["StatusToBeSelected"]}, ExecutionType: ${vars["ExecutionType"]}`);

        await stepGroups.stepGroup_Filtering_Status_and_Navigating_to_Filtered_Status_Bid_Reque(page, vars);
        log.info('Filtering by status and navigating to filtered bid requests completed');

        log.stepPass('Navigated to Bid Requests and filters applied successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Requests or apply filters');
        throw e;
      }

      // ── Step 6: Resubmit for Pricing & Validate Today's Dropdown ─────────
      log.step('Resubmitting for pricing and validating AddedBatchTime appears in today\'s dropdown');
      try {
        await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
        log.info('Clicked ReSubmit For Pricing button');

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner hidden after resubmit click');

        await correspondentPortalPage.Dropdown_selection_2.click();
        log.info('Clicked Dropdown_selection_2');
        log.info('Options for Today in dropdown are : ' + await correspondentPortalPage.Dropdown_selection_2.innerText());
        await page.waitForTimeout(5000);

        await expect(correspondentPortalPage.Dropdown_selection_2.locator('option', { hasText: vars["AddedBatchTime"] })).toBeAttached();
        log.info(`Validated: option with text "${vars["AddedBatchTime"]}" is visible in today's dropdown`);

        log.stepPass(`AddedBatchTime "${vars["AddedBatchTime"]}" is present in today's pricing return time dropdown`);
      } catch (e) {
        await log.stepFail(page, 'Failed to validate AddedBatchTime in today\'s dropdown');
        throw e;
      }

      // ── Step 7: Switch to Next Business Day & Validate Dropdown Exclusion ─
      log.step('Selecting Next Business Day and validating AddedBatchTime is NOT in the dropdown');
      try {
        await correspondentPortalPage.bidRequestDate_Next_Bussiness_Radio_Button.check();
        log.info('Checked Next Business Day radio button');

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner hidden after switching to Next Business Day');

        await correspondentPortalPage.Dropdown_selection_2.click();
        log.info('Clicked Dropdown_selection_2 for Next Business Day');
        log.info('Options for Next Business Day in dropdown are : ' + await correspondentPortalPage.Dropdown_selection_2.innerText());
        await expect(correspondentPortalPage.Dropdown_selection_2).not.toContainText(vars["AddedBatchTime"]);
        log.info(`Validated: "${vars["AddedBatchTime"]}" is NOT present in Next Business Day dropdown`);

        log.stepPass(`AddedBatchTime "${vars["AddedBatchTime"]}" correctly excluded from Next Business Day dropdown`);
      } catch (e) {
        await log.stepFail(page, 'Failed to validate AddedBatchTime exclusion from Next Business Day dropdown');
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