// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let reg_ts22_tc02_testFailed = false;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  const TC_ID = 'REG_TS22_TC02';
  const TC_TITLE = 'Verify that when the bid has only the Chase execution type and Chase is disabled in the configuration for the company, the system prevents submission.';

  test('REG_TS22_TC02_Verify that when the bid has only the Chase execution type and Chase is disabled in the configuration for the company, the system prevents submission.', async ({ page }) => {
    // const testData: Record<string, string> = {
    //"Resubmit Pricing Error Chase Direct": "Execution type 'Chase Direct' not permitted for client",

    try {
      log.tcStart(TC_ID, TC_TITLE);

      // ── Step 1: Initialize Page Objects & Load Test Data ──────────────────
      log.step('Initializing page objects and loading test data');
      try {
        const CorrPortalElem = new CorrPortalPage(page);
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        log.info(`Credentials loaded - Username: ${vars["Username"]}`);

        const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
        if (profile2 && profile2.data) {
          const TimeInterval = profile2.data[0]['Time Interval'];
          vars["Time Interval"] = TimeInterval;
          log.info(`Loaded Time Interval: ${vars["Time Interval"]}`);

          const NoOfBatches = profile2.data[0]['NO of Batches'];
          vars["NO of Batches"] = NoOfBatches;
          log.info(`Loaded NO of Batches: ${vars["NO of Batches"]}`);
        } else {
          log.warn('Administration_Bulk Batch Timing profile not found');
        }

        const profile1 = testDataManager.getProfileByName("Bid Requests");
        if (profile1 && profile1.data) {
          const CompanyName = profile1.data[0]['Company Name'];
          vars["CompanyName"] = CompanyName;
          log.info(`Loaded Company Name: ${vars["CompanyName"]}`);

          const BidMappingID = profile1.data[0]['BidMappingID'];
          vars["BidMappingID"] = BidMappingID;
          log.info(`Loaded Bid Mapping ID: ${vars["BidMappingID"]}`);

          const ResubmitPricingErrorChaseDirect = profile1.data[0]['Resubmit Pricing Error Chase Direct'];
          vars["Resubmit Pricing Error Chase Direct"] = ResubmitPricingErrorChaseDirect;
          log.info(`Loaded Resubmit Pricing Error for Chase Direct: ${vars["Resubmit Pricing Error Chase Direct"]}`);
        } else {
          log.warn('Bid Requests profile not found');
        }


        log.stepPass('Test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to initialize page objects or load test data');
        throw e;
      }

      // ── Step 2: Login to Portal ─────────────────────────────────────────
      log.step('Logging into Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.info('Successfully logged into Correspondent Portal');
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to Correspondent Portal');
        throw e;
      }

      // ── Step 3: Delete Early Config Report ──────────────────────────────
      log.step('Deleting early configuration report if present');
      try {
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        log.info('Successfully deleted early configuration report if it existed');
        log.stepPass('Config report cleanup completed');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete early configuration report');
        throw e;
      }

      // ── Step 4: Navigate to Customer Permissions and Disable Chase ──────
      log.step('Navigating to Customer Permissions and disabling Chase execution type');
      try {
        await stepGroups.stepGroup_Navigating_to_Customer_Permissions_and_disabling_the_chase_e(page, vars);
        log.info('Successfully navigated to Customer Permissions and disabled Chase execution type');
        log.stepPass('Chase execution type disabled');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Customer Permissions or disable Chase execution type');
        throw e;
      }

      // ── Step 5: Process Multiple Status Types ────────────────────────────
      log.step('Processing Bid Requests for multiple statuses');
      try {
        vars["ExecutionType"] = "Chase Direct";
        vars["count"] = "1";
        log.info(`Execution Type: ${vars["ExecutionType"]}`);

        while (parseFloat(String(vars["count"])) <= parseFloat(String("3"))) {
          log.info(`Processing iteration ${vars["count"]} of 3`);

          // ── Step 5.1: Determine Status ──────────────────────────────────
          if (String(vars["count"]) === String("1")) {
            vars["StatusToBeSelected"] = "Price Offered";
          } else if (String(vars["count"]) === String("2")) {
            vars["StatusToBeSelected"] = "Upload Expired";
          } else {
            vars["StatusToBeSelected"] = "Expired";
          }
          log.info(`Status to be selected: ${vars["StatusToBeSelected"]}`);

          // ── Step 5.2: Navigate to Bid Requests ──────────────────────────
          log.info('Navigating to Bid Requests side menu');
          await correspondentPortalPage.Bid_Requests_Side_Menu.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Bid Requests page loaded');

          // ── Step 5.3: Clear Existing Filters ────────────────────────────
          if (await correspondentPortalPage.Clear_all_Button1.isVisible()) {
            log.info('Clearing all existing filters');
            await correspondentPortalPage.Clear_all_Button1.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            log.info('Filters cleared');
          }

          // ── Step 5.4: Apply Company Filter ──────────────────────────────
          log.info('Applying company filter');
          await priceOfferedPage.Filter_Dropdown1.click();
          log.info('Filter dropdown opened');

          await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
          log.info('Company code dropdown opened');

          await bidRequestListPage.Required_Company_Checkbox_filter(vars["CompanyName"]).check();
          log.info(`Company filter checked: ${vars["CompanyName"]}`);

          await correspondentPortalPage.Apply_Selected_1_button_in_Rule.first().click();
          log.info('Applied company filter');

          // ── Step 5.5: Apply Status Filter ───────────────────────────────
          log.info('Applying status filter');
          await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
          log.info('Status dropdown opened');

          await bidRequestPage.Status_checkbox_Filter(vars["StatusToBeSelected"]).check();
          log.info(`Status filter checked: ${vars["StatusToBeSelected"]}`);

          await expect(correspondentPortalPage.Apply_Selected_1_button_in_Rule.nth(1)).toBeVisible();
          await bidRequestDetailsPage.Apply_Selected_Button_2_filter.click();
          log.info('Status filter applied');

          // ── Step 5.6: Apply All Filters ─────────────────────────────────
          log.info('Clicking Apply Filters button');
          await applyFiltersButtonPage.Apply_Filters_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Filters applied and page loaded');

          // ── Step 5.7: Traverse to Filtered Bid Request ──────────────────
          log.info('Traversing to the next screens until the bid is visible');
          await stepGroups.stepGroup_Traversing_to_the_next_screens_until_the_bid_is_visible(page, vars);
          log.info('Successfully navigated to filtered bid request');

          await expect(correspondentPortalPage.Status.first()).toContainText(vars["StatusToBeSelected"]);
          log.info('Status verified');

          // ── Step 5.8: Click on Bid Request ──────────────────────────────
          log.info('Clicking on bid request with Chase Direct execution type');
          await bidRequestListPage.Filtered_Status_BidRequest_ID_ChaseDirect(vars["StatusToBeSelected"]).first().click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Bid request details opened');

          // ── Step 5.9: Resubmit for Pricing ─────────────────────────────
          log.step('Resubmitting bid request for pricing');
          try {
            log.info('Clicking ReSubmit For Pricing button');
            await expect(correspondentPortalPage.ReSubmit_For_Pricing_Button).toBeEnabled();
            await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
            await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeVisible();
            log.info('Pricing dialog opened');

            // ── Step 5.10: Open Pricing Return Time Dropdown ──────────────
            log.info('Opening Pricing Return Time dropdown');
            await correspondentPortalPage.Dropdown_selection_2.click();
            await page.waitForTimeout(3000);
            log.info('Dropdown opened');

            const CorrPortalElem = new CorrPortalPage(page);

            // ── Step 5.11: Check for Enabled Times ──────────────────────
            if (await CorrPortalElem.Second_Enabled_Time.count() > 0) {
              log.info('Enabled times found in dropdown');

              vars["EnabledTime"] = (await CorrPortalElem.Enabled_Time.first().textContent() || '').trim();
              log.info(`First Enabled Time from UI: "${vars["EnabledTime"]}"`);

              // vars["CurrentEstTime"] = (() => {
              //   const d = new Date();
              //   const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
              //   const fmt = "hh:mm a";
              //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
              //   const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
              //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
              // })();
              const d = new Date();
              vars["CurrentEstTime"] = d.toLocaleString('en-US', {
                timeZone: 'America/New_York',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
              log.info(`Current EST Time: "${vars["CurrentEstTime"]}"`);

              vars["TimeDiff"] = Math.abs(new Date('2000-01-01 ' + String(vars["CurrentEstTime"])).getTime() - new Date('2000-01-01 ' + String(vars["EnabledTime"])).getTime()) / 60000 + '';
              log.info(`Time difference from current time: ${vars["TimeDiff"]} minutes`);

              if (String(vars["TimeDiff"]) >= String("3")) {
                log.info(`Time difference >= 4 minutes, selecting first enabled time: ${vars["EnabledTime"]}`);
                await correspondentPortalPage.Dropdown_selection_2.selectOption({ value: vars["EnabledTime"] });
              } else {
                vars["SecondEnabledTime"] = (await CorrPortalElem.Second_Enabled_Time.first().textContent() || '').trim();
                log.info(`Time difference < 4 minutes, selecting second enabled time: ${vars["SecondEnabledTime"]}`);
                await correspondentPortalPage.Dropdown_selection_2.selectOption({ value: vars["SecondEnabledTime"] });
              }
            } else {
              log.info('No enabled times found, navigating to modify batch intervals');
              await correspondentPortalPage.close_pop_up_bid_request_details.click();
              log.info('Closed bid request details popup');

              await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
              log.info('Navigated to Bulk Batch Timing');

              await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page, vars);
              log.info('Modified batch intervals');

              await stepGroups.stepGroup_Filtering_Status_and_Navigating_to_Filtered_Status_Bid_Reque(page, vars);
              log.info('Re-applied filters');

              await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
              log.info('ReSubmit For Pricing button clicked');

              await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeVisible();
              log.info('Pricing dialog reopened');

              await correspondentPortalPage.Dropdown_selection_2.click();
              log.info('Pricing Return Time dropdown opened again');

              const labelToSelect1 = await correspondentPortalPage.Dropdown_selection_2
                .locator('option[aria-disabled="false"]')
                .first()
                .innerText();

              if (labelToSelect1) {
                await correspondentPortalPage.Dropdown_selection_2.selectOption({ label: labelToSelect1.trim() });
              }
              log.info('Selected enabled time');
            }

            log.stepPass(`Pricing submission for status "${vars["StatusToBeSelected"]}" prepared successfully`);
          } catch (e) {
            await log.stepFail(page, `Failed to prepare pricing submission for status "${vars["StatusToBeSelected"]}"`);
            throw e;
          }

          // ── Step 5.12: Submit Pricing Request ───────────────────────────
          log.info('Clicking Submit button');
          await bidRequestDetailsPage.Submit_Button_On_pop_up.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Submit button clicked and spinner hidden');
          //await page.waitForLoadState("load");

          // ── Step 5.13: Wait for Error Message ───────────────────────────
          log.info(`Waiting for expected error message for Chase Direct execution type`);
          const expectedErrorMsg = vars["Resubmit Pricing Error Chase Direct"];
          await page.getByText(expectedErrorMsg).waitFor({ state: 'visible' });
          log.info(`Error message appeared: "${expectedErrorMsg}"`);

          await page.getByText(expectedErrorMsg).waitFor({ state: 'hidden' });
          log.info('Error message disappeared');

          // ── Step 5.14: Submit Again with Next Business Day ──────────────
          log.step('Resubmitting with Next Business Day');
          try {
            log.info('Clicking ReSubmit For Pricing button again');
            await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
            log.info('ReSubmit button clicked');

            log.info('Selecting Next Business Day radio button');
            await correspondentPortalPage.bidRequestDate_Next_Bussiness_Radio_Button.check();
            await expect(correspondentPortalPage.bidRequestDate_Next_Bussiness_Radio_Button).toBeVisible();
            log.info('Next Business Day selected');

            // ── Step 5.15: Open Dropdown for Next Business Day ────────────
            log.info('Opening Pricing Return Time dropdown for Next Business Day');
            await correspondentPortalPage.Dropdown_selection_2.click();
            log.info('Dropdown opened');
            const labelToSelect1 = await correspondentPortalPage.Dropdown_selection_2
              .locator('option[aria-disabled="false"]')
              .first()
              .innerText();

            if (labelToSelect1) {
              await correspondentPortalPage.Dropdown_selection_2.selectOption({ label: labelToSelect1.trim() });
            }
            // log.info('Selecting enabled time option');
            // await bidRequestPage.Enabled_Time.first().click();
            // log.info('Enabled time selected');

            await page.waitForTimeout(5000);
            log.info('Waited 5 seconds for dropdown to stabilize');

            log.info('Clicking Submit button for Next Business Day');
            await bidRequestDetailsPage.Submit_Button_On_pop_up.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            log.info('Submit button clicked and spinner hidden');

            log.info(`Waiting for expected error message for Chase Direct execution type`);
            await page.getByText(expectedErrorMsg).waitFor({ state: 'visible' });
            log.info(`Error message appeared as expected: "${expectedErrorMsg}"`);

            log.stepPass(`Next Business Day submission completed and error verified`);
          } catch (e) {
            await log.stepFail(page, `Failed to resubmit with Next Business Day`);
            throw e;
          }

          // ── Step 5.16: Increment Counter ────────────────────────────────
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
          log.info(`Iteration count incremented to: ${vars["count"]}`);
        }

        // // ── Step 5.17: Enable Chase Type for Next Iteration ─────────────────
        // log.info('Enabling Chase Direct execution type for next iteration');
        // await stepGroups.stepGroup_Navigating_To_Customer_Permissions_and_enabling_the_chase_ty(page, vars);
        // log.info('Chase Direct execution type enabled');

        log.stepPass('All status iterations processed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed during bid request processing loop');
        throw e;
      }
      log.info('Enabling Chase Direct execution type after verification');
      await stepGroups.stepGroup_Navigating_To_Customer_Permissions_and_enabling_the_chase_ty(page, vars);
      log.info('Chase Direct execution type enabled');

      log.tcEnd('PASS');
    } catch (e) {

      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      reg_ts22_tc02_testFailed = true;
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, reg_ts22_tc02_testFailed);
    if (reg_ts22_tc02_testFailed) {
      try {
        await page.reload();
        await page.waitForLoadState('load');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Test failed, executing after-test steps to reset chase execution type for next tests');
        log.info('Enabling Chase Direct execution type');
        await stepGroups.stepGroup_Navigating_To_Customer_Permissions_and_enabling_the_chase_ty(page, vars);
        log.info('Chase Direct execution type enabled');
        log.pass("After-test steps executed successfully");
      } catch (e) {
        await log.stepFail(page, 'After-test steps failed to execute as the script is passed');
        throw e;
      }
    }
  });
});