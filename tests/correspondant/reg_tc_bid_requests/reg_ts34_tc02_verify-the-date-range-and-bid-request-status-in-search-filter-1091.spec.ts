// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '../../../src/config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '@helpers/AddonHelpers';
const TC_ID = 'REG_TS34_TC02';
const TC_TITLE = 'Verify The Date range and Bid Request Status In Search Filter';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials and Test Data ───────────────────────────
      log.step('Loading credentials and test data');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        const profileName = 'Bid Requests'; // TDP sheet name
        const profile = testDataManager.getProfileByName(profileName);
        if (profile && profile.data) {
          const LastOneMonth = profile.data[0]['Last One Month'];
          vars["Last One Month"] = LastOneMonth;
        }
        log.stepPass('Credentials and test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials and test data failed');
        throw e;
      }

      // ── Step 2: Login to Correspondent Portal ────────────────────────────
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }

      // ── Step 3: Navigate to Bid Requests ─────────────────────────────────
      log.step('Navigating to Bid Requests');
      try {
        await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Bid Requests successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Bid Requests failed');
        throw e;
      }

      // ── Step 4: Select Date Range filter as Last One Month ────────────────
      log.step('Opening filter dropdown and selecting Last One Month date range');
      try {
        await priceOfferedPage.Filter_Dropdown1.click();
        await page.waitForLoadState('load');
        await correspondentPortalPage.Select_Date_Range_Dropdown_Field.click();
        await correspondentPortalPage.Last_One_Month_Button.click();
        // [DISABLED] Store text from the element Select Date Range Dropdown Value into a variable Last One Month
        // vars["Last One Month"] = await correspondentPortalPage.Select_Date_Range_Dropdown_Value.textContent() || '';
        await expect(correspondentPortalPage.Select_Date_Range_Dropdown_Value).toContainText(vars["Last One Month"]);
        log.stepPass(`Date range selected and verified - Last One Month: ${vars["Last One Month"]}`);
      } catch (e) {
        await log.stepFail(page, 'Selecting Last One Month date range failed');
        throw e;
      }

      // ── Step 5: Select Bid Request Status from filter dropdown ────────────
      log.step('Selecting Bid Request Status from filter dropdown and applying filters');
      try {
        await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
        vars["Count"] = "3";
        vars["ExpectedStatus"] = await bidRequestPage.Individual_Status_NameDropdown(vars["Count"]).textContent() || '';
        await bidRequestPage.Individual_Status_NameDropdown(vars["Count"]).click();
        await correspondentPortalPage.Apply_Selected2.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        log.stepPass(`Bid Request Status selected and filters applied - Expected Status: ${vars["ExpectedStatus"]}`);
      } catch (e) {
        await log.stepFail(page, 'Selecting Bid Request Status from filter dropdown failed');
        throw e;
      }

      // ── Step 6: Calculate Last Month and verify filter chips ──────────────
      log.step('Calculating last month and verifying date and status filter chips');
      try {
        await stepGroups.stepGroup_Getting_Last_Month_From_Current_Month(page, vars);
        await page.waitForLoadState('load');
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
        await expect(priceOfferedPage.Status_Filter_ChipPrice_Offered_Page).toBeVisible();
        log.stepPass(`Last month calculated: ${vars["Last Month"]} - Filter chips verified`);
      } catch (e) {
        await log.stepFail(page, 'Calculating last month or verifying filter chips failed');
        throw e;
      }

      // ── Step 7: Verify filtered results ──────────────────────────────────
      log.step('Verifying filtered results for date range and status');
      try {
        if (await page.getByText("No result").isVisible()) /* Element No result (Bid requests) is visible */ {
          await expect(page.getByText("No result")).toBeVisible();
          log.info('No result found - skipping column data verification');
        } else {
          vars["RowsCount"] = String(await priceOfferedPage.RowCount.count());
          vars["LastMonthCount"] = String(await bidrequestPage.Filtered_Lastmonth_Uploaded_Date(vars["Last Month"]).count());
          expect(String(vars["LastMonthCount"])).toBe(vars["RowsCount"]);
          // [DISABLED] Verify that the elements with locator Bid Request Status Column Data displays text ExpectedStatus and With Scrollable FALSE
          // await expect(priceOfferedPage.Price_Offered_Status_Column_Data).toContainText(vars["ExpectedStatus"]);
          for (let i = 0; i < await priceOfferedPage.Price_Offered_Status_Column_Data.count(); i++) {
            await expect(priceOfferedPage.Price_Offered_Status_Column_Data.nth(i)).toHaveText(String(vars["ExpectedStatus"]));
          }
        }
        log.info("Verified that the date range filter for last month as" + vars["Last Month"] + "and bid request status filter with status as " + vars["ExpectedStatus"] + " is working as expected in bid requests page");
        log.stepPass('Filtered results verified successfully for date range and status');
      } catch (e) {
        await log.stepFail(page, 'Verifying filtered results failed');
        throw e;
      }

      // ── Step 8: Clear filters and verify last month and status in filter ──
      log.step('Clearing filters');
      try {
        await correspondentPortalPage.Clear_all_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        //await stepGroups.stepGroup_Verifying_last_month_and_Required_status_In_filter(page, vars);
        log.stepPass('Filters cleared successfully');
      } catch (e) {
        await log.stepFail(page, 'Clearing filters failed');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }

  });
});