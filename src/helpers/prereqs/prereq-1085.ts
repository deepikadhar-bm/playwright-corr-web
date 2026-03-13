import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { ApplyFiltersButtonPage } from '../../pages/correspondant/apply-filters-button';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '../../../src/config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '@helpers/AddonHelpers';

export async function runPrereq_1085(page: Page, vars: Record<string, string>): Promise<void> {
  const applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const TC_ID = 'PREREQ-1085';
  const TC_TITLE = 'Verify Date Range and Company/CCode Functionality In Search Filter';
  log.tcStart(TC_ID, TC_TITLE);

//   const testData: Record<string, string> = {
//   "Last One Month": "Last One Month",
//   "This Calendar Month": "This Calendar Month",
//   "This Year": "This Year",
//   "This Quarter": "This Quarter"
// }; // Profile: "Filter View", row: 0

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
          vars["ExpectedCompany"] = await bidRequestPage.First_Company_Name_Text.textContent() || '';
          vars["ExpectedCompany"] = String(vars["ExpectedCompany"]).substring(0, String(vars["ExpectedCompany"]).length - 8);
          await correspondentPortalPage.First_Checkbox_Bid_Request.check();
          await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
          await applyFiltersButtonPage.Apply_Filters_Button.click();
          await page.waitForLoadState('load');
          log.stepPass(`Company selected and filters applied - Expected Company: ${vars["ExpectedCompany"]}`);
        } catch (e) {
          await log.stepFail(page, 'Selecting company from filter dropdown failed');
          throw e;
        }
  
        // ── Step 6: Verify filter results ────────────────────────────────────
        log.step('Verifying filter results for date range and company');
        try {
          if (await page.getByText("No result").isVisible()) {
            await expect(page.getByText("No result")).toBeVisible();
            log.info('No result found - skipping column data verification');
          } else {
            await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
            await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars["ExpectedCompany"]);
            await stepGroups.stepGroup_Getting_Last_Month_From_Current_Month(page, vars);
            log.info(`Last Month calculated: ${vars["Last Month"]}`);
            vars["Count of Uploaded Date"] = String(await bidRequestsPage.Uploaded_Date_Count.count());
            log.info(`Total uploaded dates to verify: ${vars["Count of Uploaded Date"]}`);
            vars["count"] = "1";
            const addonHelpers = new AddonHelpers(page, vars);
            while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["Count of Uploaded Date"]))) {
              vars["UploadedDates"] = (await correspondentPortalPage.Uploaded_Dates(parseFloat(String(vars["count"]))).textContent() || '').trim();
              log.info(`Iteration ${vars["count"]}: Verifying uploaded date "${vars["UploadedDates"]}" matches last month "${vars["Last Month"]}"`);
              addonHelpers.verifyDateStringMonthMatchesExpectedMonth(vars["UploadedDates"], vars["Last Month"]);
              vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
            }
            // [DISABLED] Verify that the elements with locator Company Column Data displays text ExpectedCompany and With Scrollable FALSE
            // await expect(bidRequestPage.Company_Column_Data).toContainText(vars["ExpectedCompany"]);
            log.info(` Count of total company rows: ${await bidRequestPage.BidRequest_Company_Column_Data.count()}`);
            for (let i = 0; i < await bidRequestPage.BidRequest_Company_Column_Data.count(); i++) {
              await expect(bidRequestPage.BidRequest_Company_Column_Data.nth(i)).toHaveText(String(vars["ExpectedCompany"]));
              log.info(`Verified company name in row ${i + 1} matches expected company "${vars["ExpectedCompany"]}"`);
            }
          }
          log.stepPass('Filter results verified successfully for date range and company');
        } catch (e) {
          await log.stepFail(page, 'Verifying filter results failed');
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
  
    };

