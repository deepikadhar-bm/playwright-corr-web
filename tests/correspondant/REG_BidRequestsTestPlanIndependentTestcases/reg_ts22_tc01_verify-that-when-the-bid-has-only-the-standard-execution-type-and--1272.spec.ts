// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let reg_ts22_tc01_testFailed = false;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });
const TC_ID = 'REG_TS22_TC01';
    const TC_TITLE = 'Verify that when the bid has only the Standard execution type and Standard is disabled, the system blocks the submission.';

  test('REG_TS22_TC01_Verify that when the bid has only the Standard execution type and Standard is disabled, the system blocks the submission.', async ({ page }) => {
    
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

          const ResubmitPricingErrorStandard = profile1.data[0]['Resubmit Pricing Error Standard'];
          vars["Resubmit Pricing Error Standard"] = ResubmitPricingErrorStandard;
          log.info(`Loaded Resubmit Pricing Error for Standard: ${vars["Resubmit Pricing Error Standard"]}`);
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
      log.step('Navigating to Customer Permission Page and disabling Standard execution type');
      try{
            await stepGroups.stepGroup_Navigating_to_Customer_Permission_Page_and_disabling_the_sta(page, vars);
            log.info('Successfully navigated to Customer Permission Page and disabled Standard execution type');
            log.stepPass('Navigation and configuration successful');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Customer Permission Page and disable Standard execution type');
        throw e;
      }

      // ── Step 3: Process Multiple Status Types ────────────────────────────
      log.step('Processing Bid Requests for multiple statuses');
      try {
        vars["ExecutionType"] = "Standard";
        vars["count"] = "1";
        log.info(`Execution Type: ${vars["ExecutionType"]}`);

        while (parseFloat(String(vars["count"])) <= parseFloat(String("3"))) {
          log.info(`Processing iteration ${vars["count"]} of 3`);

          // ── Step 3.1: Determine Status ──────────────────────────────────
          if (String(vars["count"]) === String("1")) {
            vars["StatusToBeSelected"] = "Price Offered";
          } else if (String(vars["count"]) === String("2")) {
            vars["StatusToBeSelected"] = "Upload Expired";
          } else {
            vars["StatusToBeSelected"] = "Expired";
          }
          log.info(`Status to be selected: ${vars["StatusToBeSelected"]}`);

          // ── Step 3.2: Navigate to Bid Requests ──────────────────────────
          log.info('Navigating to Bid Requests side menu');
          await correspondentPortalPage.Bid_Requests_Side_Menu.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Bid Requests page loaded');

          // ── Step 3.3: Clear Existing Filters ────────────────────────────
          if (await correspondentPortalPage.Clear_all_Button1.isVisible()) {
            log.info('Clearing all existing filters');
            await correspondentPortalPage.Clear_all_Button1.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            log.info('Filters cleared');
          }

          // ── Step 3.4: Apply Company Filter ──────────────────────────────
          log.info('Applying company filter');
          await priceOfferedPage.Filter_Dropdown1.click();
          log.info('Filter dropdown opened');

          await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
          log.info('Company code dropdown opened');

          await bidRequestListPage.Required_Company_Checkbox_filter(vars["CompanyName"]).check();
          log.info(`Company filter checked: ${vars["CompanyName"]}`);

          await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
          log.info('Applied company filter');

          // ── Step 3.5: Apply Status Filter ───────────────────────────────
          log.info('Applying status filter');
          await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
          log.info('Status dropdown opened');

          await bidRequestPage.Status_checkbox_Filter(vars["StatusToBeSelected"]).check();
          log.info(`Status filter checked: ${vars["StatusToBeSelected"]}`);

          await expect(correspondentPortalPage.Apply_Selected_1_button_in_Rule.nth(1)).toBeVisible();
          await bidRequestDetailsPage.Apply_Selected_Button_2_filter.click();
          log.info('Status filter applied');

          // ── Step 3.6: Apply All Filters ─────────────────────────────────
          log.info('Clicking Apply Filters button');
          await applyFiltersButtonPage.Apply_Filters_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Filters applied and page loaded');

          // ── Step 3.7: Navigate to Bid Request ────────────────────────────
          log.info('Searching for filtered bid request');
          if (!(await bidrequestPage.Filtered_Status_BidRequest_ID(vars["ExecutionType"], vars["StatusToBeSelected"]).first().isVisible())) {
            log.info('Bid request not visible on current page, changing page size to 50');
            await correspondentPortalPage.Show_20.click();
            await correspondentPortalPage.Set_page_size_to_50_Dropdown.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });

            if (!await bidrequestPage.Filtered_Status_BidRequest_ID(vars["ExecutionType"], vars["StatusToBeSelected"]).first().isVisible()) {
              log.info('Bid request still not found, navigating to next pages');
              while (!(await bidrequestPage.Filtered_Status_BidRequest_ID(vars["ExecutionType"], vars["StatusToBeSelected"]).first().isVisible())) {
                log.info('Moving to next page');
                await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
              }
            }
          }
          log.info('Bid request found');

          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(correspondentPortalPage.Status).toContainText(vars["StatusToBeSelected"]);
          log.info('Status verified');

          // ── Step 3.8: Click on Bid Request ──────────────────────────────
          log.info('Clicking on bid request to open details');
          await bidrequestPage.Filtered_Status_BidRequest_ID(vars["ExecutionType"], vars["StatusToBeSelected"]).first().click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Bid request details opened');

          // ── Step 3.9: Resubmit for Pricing ─────────────────────────────
          log.step('Resubmitting bid request for pricing');
          try {
            log.info('Clicking ReSubmit For Pricing button');
            await expect(correspondentPortalPage.ReSubmit_For_Pricing_Button).toBeEnabled();
            await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
            await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeVisible();
            log.info('Pricing dialog opened');

            // ── Step 3.10: Open Pricing Return Time Dropdown ──────────────
            log.info('Opening Pricing Return Time dropdown');
            await correspondentPortalPage.Dropdown_selection_2.click();
            await page.waitForTimeout(2000);
            log.info('Dropdown opened');

            const CorrPortalElem = new CorrPortalPage(page);

            // ── Step 3.11: Check for Enabled Times ──────────────────────
            if (await CorrPortalElem.Second_Enabled_Time.count() > 0) {
              log.info('Enabled times found in dropdown');

              vars["EnabledTime"] = (await CorrPortalElem.Enabled_Time.first().textContent() || '').trim();
              log.info(`First Enabled Time from UI: "${vars["EnabledTime"]}"`);

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

              if (String(vars["TimeDiff"]) >= String("4")) {
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
              await expect(correspondentPortalPage.ReSubmit_For_Pricing_Button).toBeEnabled();
              await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
              await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeVisible();
              log.info('Pricing dialog reopened');

              await correspondentPortalPage.Dropdown_selection_2.click();
              log.info('Pricing Return Time dropdown opened again');
            }

            // ── Step 3.12: Extract and Log All Dropdown Options ────────────
            log.info('Extracting dropdown options (enabled and disabled)');
            const allOptions = await correspondentPortalPage.Dropdown_selection_2.locator('option').all();
            log.info(`Total options found: ${allOptions.length}`);

            const enabledOptions: string[] = [];
            const disabledOptions: string[] = [];

            for (let i = 0; i < allOptions.length; i++) {
              const option = allOptions[i];
              const isDisabled = await option.getAttribute('aria-disabled');
              const optionText = (await option.innerText()).trim();

              if (optionText === '' || optionText === undefined) {
                log.debug(`Option ${i}: Empty option skipped`);
                continue;
              }

              if (isDisabled === 'true') {
                disabledOptions.push(optionText);
                log.debug(`Option ${i} [DISABLED]: ${optionText}`);
              } else {
                enabledOptions.push(optionText);
                log.debug(`Option ${i} [ENABLED]: ${optionText}`);
              }
            }

            log.info(`Enabled Options for ${vars["StatusToBeSelected"]} in dropdown are: ${enabledOptions.join(', ')}`);
            log.info(`Disabled Options for ${vars["StatusToBeSelected"]} in dropdown are: ${disabledOptions.join(', ')}`);

            // ── Step 3.13: Select First Enabled Option ──────────────────────
            log.info('Selecting first enabled option from dropdown');
            const labelToSelect1 = await correspondentPortalPage.Dropdown_selection_2
              .locator('option[aria-disabled="false"]')
              .first()
              .innerText();

            if (labelToSelect1 && labelToSelect1.trim() !== '') {
              log.info(`Selected option: "${labelToSelect1.trim()}"`);
              await correspondentPortalPage.Dropdown_selection_2.selectOption({ label: labelToSelect1.trim() });
              log.info('Option selected successfully');
            } else {
              log.warn('No enabled options found to select');
            }

            log.stepPass(`Pricing submission for status "${vars["StatusToBeSelected"]}" prepared successfully`);
          } catch (e) {
            await log.stepFail(page, `Failed to prepare pricing submission for status "${vars["StatusToBeSelected"]}"`);
            throw e;
          }

          // ── Step 3.14: Submit Pricing Request ───────────────────────────
          log.info('Clicking Submit button');
          await bidRequestDetailsPage.Submit_Button_On_pop_up.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Submit button clicked and spinner hidden');

          // ── Step 3.15: Wait for Error Message ───────────────────────────
          log.info(`Waiting for expected error message for Standard execution type`);
          const expectedErrorMsg = vars["Resubmit Pricing Error Standard"];
          await page.getByText(expectedErrorMsg).waitFor({ state: 'visible' });
          log.info(`Error message appeared: "${expectedErrorMsg}"`);

          await page.getByText(expectedErrorMsg).waitFor({ state: 'hidden' });
          log.info('Error message disappeared');

          // ── Step 3.16: Submit Again with Next Business Day ──────────────
          log.step('Resubmitting with Next Business Day');
          try {
            log.info('Clicking ReSubmit For Pricing button again');
            await expect(correspondentPortalPage.ReSubmit_For_Pricing_Button).toBeEnabled();

            await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
            log.info('ReSubmit button clicked');

            log.info('Selecting Next Business Day radio button');
            await correspondentPortalPage.bidRequestDate_Next_Bussiness_Radio_Button.check();
            await expect(correspondentPortalPage.bidRequestDate_Next_Bussiness_Radio_Button).toBeVisible();
            log.info('Next Business Day selected');

            // ── Step 3.17: Open Dropdown for Next Business Day ────────────
            log.info('Opening Pricing Return Time dropdown for Next Business Day');
            await correspondentPortalPage.Dropdown_selection_2.click();
            log.info('Dropdown opened');

            // ── Step 3.18: Extract Options for Next Business Day ─────────
            log.info('Extracting dropdown options for Next Business Day (enabled and disabled)');
            const allOptionsNextDay = await correspondentPortalPage.Dropdown_selection_2.locator('option').all();
            log.info(`Total options found for Next Business Day: ${allOptionsNextDay.length}`);

            const enabledOptionsNextDay: string[] = [];
            const disabledOptionsNextDay: string[] = [];

            for (let i = 0; i < allOptionsNextDay.length; i++) {
              const option = allOptionsNextDay[i];
              const isDisabled = await option.getAttribute('aria-disabled');
              const optionText = (await option.innerText()).trim();

              if (optionText === '' || optionText === undefined) {
                log.debug(`Next Day Option ${i}: Empty option skipped`);
                continue;
              }

              if (isDisabled === 'true') {
                disabledOptionsNextDay.push(optionText);
                log.debug(`Next Day Option ${i} [DISABLED]: ${optionText}`);
              } else {
                enabledOptionsNextDay.push(optionText);
                log.debug(`Next Day Option ${i} [ENABLED]: ${optionText}`);
              }
            }

            log.info(`Enabled Options for Next Business Day: ${enabledOptionsNextDay.join(', ')}`);
            log.info(`Disabled Options for Next Business Day: ${disabledOptionsNextDay.join(', ')}`);

            // ── Step 3.19: Select First Enabled Option for Next Day ──────
            log.info('Selecting first enabled option for Next Business Day');
            const labelToSelectNextDay = await correspondentPortalPage.Dropdown_selection_2
              .locator('option[aria-disabled="false"]')
              .first()
              .innerText();

            if (labelToSelectNextDay && labelToSelectNextDay.trim() !== '') {
              log.info(`Selected option: "${labelToSelectNextDay.trim()}"`);
              await correspondentPortalPage.Dropdown_selection_2.selectOption({ label: labelToSelectNextDay.trim() });
              log.info('Option selected successfully');
            } else {
              log.warn('No enabled options found for Next Business Day');
            }

            await page.waitForTimeout(5000);
            log.info('Waited 5 seconds for dropdown to stabilize');

            log.info('Clicking Submit button for Next Business Day');
            await bidRequestDetailsPage.Submit_Button_On_pop_up.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            log.info('Submit button clicked and spinner hidden');

            log.info(`Waiting for expected error message for Standard execution type`);
            await page.getByText(expectedErrorMsg).waitFor({ state: 'visible' });
            log.info(`Error message appeared as expected: "${expectedErrorMsg}"`);

            log.stepPass(`Next Business Day submission completed and error verified`);
          } catch (e) {
            await log.stepFail(page, `Failed to resubmit with Next Business Day`);
            throw e;
          }

          // // ── Step 3.20: Enable Standard Type for Next Iteration ─────────
          // if (String(vars["count"]) !== String("3")) {
          //   log.info('Enabling Standard execution type for next iteration');
          //   await stepGroups.stepGroup_Navigating_to_Customer_Permission_and_enabling_the_Standard_(page, vars);
          //   log.info('Standard execution type enabled');
          // }

          // ── Step 3.21: Increment Counter ────────────────────────────────
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
          log.info(`Iteration count incremented to: ${vars["count"]}`);
        }
         log.info('Enabling Standard execution type for next iteration');
            await stepGroups.stepGroup_Navigating_to_Customer_Permission_and_enabling_the_Standard_(page, vars);
            log.info('Standard execution type enabled');

        log.stepPass('All status iterations processed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed during bid request processing loop');
        throw e;
      }

      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      reg_ts22_tc01_testFailed = true;
      throw e;
    }


  });
  test.afterEach(async ({ page }) => {
      log.afterTestSteps(TC_ID, reg_ts22_tc01_testFailed);
      if (reg_ts22_tc01_testFailed) {
        try {
          await page.reload();
          await page.waitForLoadState('load');
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Test failed, executing after-test steps to reset standard execution type for next tests');
          log.info('Enabling Standard execution type for next iteration');
            await stepGroups.stepGroup_Navigating_to_Customer_Permission_and_enabling_the_Standard_(page, vars);
            log.info('Standard execution type enabled');
          log.pass("After-test steps executed successfully");
        } catch (e) {
          await log.stepFail(page, 'After-test steps failed to execute as the script is passed');
          throw e;
        }
      }
    })
});