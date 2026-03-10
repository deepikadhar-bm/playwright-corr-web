// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '../../../src/config/environments';

const TC_ID = 'REG_TS34_TC03';
const TC_TITLE = 'Verify Company/Ccode and Bid request status In Search Filter';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
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

      // ── Step 4: Select Company from Filter Dropdown ───────────────────────
      log.step('Opening filter dropdown and selecting first company');
      try {
        await priceOfferedPage.Filter_Dropdown1.click();
        await page.waitForLoadState('load');
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
        vars["Company1"] = await bidRequestPage.First_Company_Name_Text.first().textContent() || '';
        vars["ExpectedCompany"] = String(vars["Company1"]).substring(0, String(vars["Company1"]).length - 8);
        await correspondentPortalPage.First_Checkbox_Bid_Request.first().check();
        await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
        log.stepPass(`Company selected and applied - Expected Company: ${vars["ExpectedCompany"]}`);
      } catch (e) {
        await log.stepFail(page, 'Selecting company from filter dropdown failed');
        throw e;
      }

      // ── Step 5: Select Bid Request Status from Filter Dropdown ────────────
      log.step('Selecting Bid Request Status from filter dropdown');
      try {
        await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
        vars["Count"] = "2";
        vars["ExpectedStatus"] = await bidRequestPage.Individual_Status_NameDropdown(vars["Count"]).textContent() || '';
        await bidRequestPage.Individual_Status_NameDropdown(vars["Count"]).click();
        await correspondentPortalPage.Apply_Selected2.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await page.waitForLoadState('load');
        log.stepPass(`Bid Request Status selected and filters applied - Expected Status: ${vars["ExpectedStatus"]}`);
      } catch (e) {
        await log.stepFail(page, 'Selecting Bid Request Status from filter dropdown failed');
        throw e;
      }

      // ── Step 6: Verify filter chips and column data ───────────────────────
      log.step('Verifying filter chips and column data for company and status');
      try {
        await expect(priceOfferedPage.Status_Filter_ChipPrice_Offered_Page).toBeVisible();
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars["ExpectedCompany"]);
        if (await page.getByText("No result").isVisible()) /* Element No result (Bid requests) is visible */ {
          await expect(page.getByText("No result")).toBeVisible();
          log.info('No result found - skipping column data verification');
        } else {
          // [DISABLED] Verify that the elements with locator Bid Request Status Column Data displays text ExpectedStatus and With Scrollable FALSE
          // await expect(priceOfferedPage.Price_Offered_Status_Column_Data).toContainText(vars["ExpectedStatus"]);
          for (let i = 0; i < await priceOfferedPage.Price_Offered_Status_Column_Data.count(); i++) {
            await expect(priceOfferedPage.Price_Offered_Status_Column_Data.nth(i)).toHaveText(String(vars["ExpectedStatus"]));
          }
          // [DISABLED] Verify that the elements with locator BidRequest Company Column Data displays text ExpectedCompany and With Scrollable FALSE
          // await expect(priceOfferedPage.Price_Offered_Company_Name_Column_Data).toContainText(vars["ExpectedCompany"]);
          for (let i = 0; i < await priceOfferedPage.Price_Offered_Company_Name_Column_Data.count(); i++) {
            await expect(priceOfferedPage.Price_Offered_Company_Name_Column_Data.nth(i)).toHaveText(String(vars["ExpectedCompany"]));
          }
        }
        log.stepPass('Filter chips and column data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Verifying filter chips or column data failed');
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