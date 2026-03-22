// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '../../../src/config/environments';

const TC_ID = 'REG_TS34_TC07';
const TC_TITLE = 'Verify Date Range, Company/CCode and BidRequest Status Functionality In Search Filter';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
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
        const profileName = 'Bid Requests'; // TDP sheet name
        const profile = testDataManager.getProfileByName(profileName);
        if (profile && profile.data) {
          const LastOneMonth = profile.data[0]['Last One Month'];
          vars["Last One Month"] = LastOneMonth;
        }
        const credentials = ENV.getCredentials('internal');
            vars["Username"] = credentials.username;
            vars["Password"] = credentials.password;
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
        vars["Last One Month Name"] = await correspondentPortalPage.Select_Date_Range_Dropdown_Value.textContent() || '';
        await expect(correspondentPortalPage.Select_Date_Range_Dropdown_Value).toContainText(vars["Last One Month"]);
        log.stepPass(`Date range selected and verified - Last One Month: ${vars["Last One Month"]}`);
      } catch (e) {
        await log.stepFail(page, 'Selecting Last One Month date range failed');
        throw e;
      }

      // ── Step 5: Select Company from filter dropdown ───────────────────────
      log.step('Selecting first company from Company/CCode filter dropdown');
      try {
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
        vars["Company Name1"] = await bidRequestPage.First_Company_Name_Text.textContent() || '';
        vars["Company Name1"] = String(vars["Company Name1"]).substring(0, String(vars["Company Name1"]).length - 8);
        await correspondentPortalPage.First_Checkbox_Bid_Request.check();
        await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
        log.stepPass(`Company selected - Company Name: ${vars["Company Name1"]}`);
      } catch (e) {
        await log.stepFail(page, 'Selecting company from filter dropdown failed');
        throw e;
      }

      // ── Step 6: Select Bid Request Status from filter dropdown ────────────
      log.step('Selecting Bid Request Status from filter dropdown and applying filters');
      try {
        await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
        vars["Count"] = "2";
        vars["SelectedStatus "] = await bidRequestPage.Individual_Status_NameDropdown(vars["Count"]).textContent() || '';
        await bidRequestPage.Individual_Status_NameDropdown(vars["Count"]).click();
        await correspondentPortalPage.Apply_Selected2.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await page.waitForLoadState('load');
        log.stepPass(`Bid Request Status selected and filters applied - Selected Status: ${vars["SelectedStatus "]}`);
      } catch (e) {
        await log.stepFail(page, 'Selecting Bid Request Status from filter dropdown failed');
        throw e;
      }

      // ── Step 7: Verify filtered results ──────────────────────────────────
      log.step('Verifying filtered results for date range, company and status');
      try {
        if (await page.getByText("No result").isVisible()) {
          await expect(page.getByText("No result")).toBeVisible();
          log.info('No result found - skipping column data verification');
        } else {
          await stepGroups.stepGroup_Getting_Last_Month_From_Current_Month(page, vars);
          log.info(`Last month calculated: ${vars["Last Month"]}`);
          vars["Count of Uploaded Date"] = String(await bidRequestsPage.Uploaded_Date_Count.count());
          log.info(`Total uploaded dates to verify: ${vars["Count of Uploaded Date"]}`);
          vars["count"] = "1";
          const addonHelpers = new AddonHelpers(page, vars);
          while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["Count of Uploaded Date"]))) {
            await correspondentPortalPage.Heading_Bid_Requests.click();
            vars["UploadedDates"] = await correspondentPortalPage.Uploaded_Dates(parseInt(vars["count"])).textContent() || '';
            vars["Company Name"] = await bidRequestPage.Company_Names1(parseInt(vars["count"])).textContent() || '';
            await expect(bidRequestPage.Company_Names1(parseInt(vars["count"]))).toContainText(vars["Company Name1"]);
            log.info(`Company name verified for row ${vars["count"]}: ${vars["Company Name1"]}`);
            //expect(new Date(String('')).getMonth()).toBe(new Date(String('')).getMonth());
            addonHelpers.verifyDateStringMonthMatchesExpectedMonth(vars["UploadedDates"], vars["Last Month"]);
            await expect(bidRequestPage.Company_Names1(parseInt(vars["count"]))).toContainText(vars["Company Name1"]);
            vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
          }
          vars["ActualStatus"] = (await bidRequestPage.First_Status_In_Column.textContent()|| '');
            //expect(String(vars["ActualStatus"])).toBe(vars["SelectedStatus "]);
            vars["ExpectedStatus"] = String(vars["ActualStatus"]).substring(1, String(vars["ActualStatus"]).length - 1);
          for (let i = 0; i < await priceOfferedPage.Price_Offered_Status_Column_Data.count(); i++) {
              await expect(priceOfferedPage.Price_Offered_Status_Column_Data.nth(i)).toHaveText(String(vars["ExpectedStatus"]));
            }
            log.info(`Verified Bid Request Status in all rows matches expected status "${vars["ExpectedStatus"]}"`);
        }
        log.stepPass('Filtered results verified successfully for date range, company and status');
      } catch (e) {
        await log.stepFail(page, 'Verifying filtered results failed');
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