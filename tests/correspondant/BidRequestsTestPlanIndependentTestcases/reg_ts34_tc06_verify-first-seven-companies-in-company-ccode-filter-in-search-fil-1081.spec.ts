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

const TC_ID = 'REG_TS34_TC06';
const TC_TITLE = 'Verify First Seven Companies In Company Ccode Filter In Search Filter Dropdown';

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

      // ── Step 1: Load Credentials ──────────────────────────────────────────
      log.step('Loading credentials');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        log.stepPass('Credentials loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials failed');
        throw e;
      }

      // ── Step 2: Login to Correspondent Portal ─────────────────────────────
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }

      // ── Step 3: Navigate to Bid Requests ──────────────────────────────────
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

      // ── Step 4: Iterate and verify first seven companies in filter ─────────
      log.step('Iterating through first seven companies in Company CCode filter and verifying each');
      try {
        vars["count"] = "1";
        while (parseFloat(String(vars["count"])) <= parseFloat(String("7"))) {
          log.info(`Verifying company iteration count: ${vars["count"]}`);
          // [DISABLED] Click on Clear all Button
          // await correspondentPortalPage.Clear_all_Button.click();
          if (await correspondentPortalPage.Clear_all_Button.isVisible()) {
            await correspondentPortalPage.Clear_all_Button.click();
          }
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).not.toBeVisible();
          await priceOfferedPage.Filter_Dropdown1.click();
          await page.waitForLoadState('load');
          await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
          vars["ExpectedCompany"] = await bidrequestPage.Individual_Company_Name_In_Dropdown(vars["count"]).textContent() || '';
          await bidRequestPage.Individual_Company_Checkbox_Dropdown(vars["count"]).check();
          await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
          await applyFiltersButtonPage.Apply_Filters_Button.click();
          await page.waitForLoadState('load');
          await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
          if (await page.getByText("No result").isVisible()) {
            await expect(page.getByText("No result")).toBeVisible();
            log.info(`Iteration ${vars["count"]}: No result found for company ${vars["ExpectedCompany"]} - skipping inner verification`);
          } else {
            vars["ExpectedCompany"] = String(vars["ExpectedCompany"]).substring(0, String(vars["ExpectedCompany"]).length - 8);
            vars["count1"] = "1";
            vars["All Company Count"] = String(await bidRequestPage.Company_Name_Count.count());
            log.info(`Iteration ${vars["count"]}: Verifying company name for ${vars["All Company Count"]} rows - Expected: ${vars["ExpectedCompany"]}`);
            while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["All Company Count"]))) {
              vars["IndividualCompany"] = (await bidRequestPage.Company_Names1(parseInt(vars["count"])).textContent() || '').trim();
              expect(String(vars["ExpectedCompany"])).toBe(vars["IndividualCompany"]);
              vars["count1"] = (parseFloat(String(vars["count1"])) + parseFloat(String("1"))).toFixed(0);
            }
            log.info(`Iteration ${vars["count"]}: Company name verified successfully for all rows`);
          }
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
        // [DISABLED] Store text from the element Company Name On Bid Request Page into a variable company name
        // vars["company name"] = await bidrequestPage.First_Filter_TubeBidRequest_List.textContent() || '';
        // [DISABLED] Remove the no of ( 9,0 ) positions of given string company name and store into runtime variable company_name1
        // vars["company_name1"] = String(vars["company name"]).substring(9);
        // [DISABLED] Verify that the element Company Name On Bid Request Page displays text company_name1 and With Scrollable FALSE
        // await expect(bidrequestPage.First_Filter_TubeBidRequest_List).toContainText(vars["company_name1"]);
        log.stepPass('All seven companies verified successfully in Company CCode filter');
      } catch (e) {
        await log.stepFail(page, `Company filter verification failed at iteration count: ${vars["count"]}`);
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