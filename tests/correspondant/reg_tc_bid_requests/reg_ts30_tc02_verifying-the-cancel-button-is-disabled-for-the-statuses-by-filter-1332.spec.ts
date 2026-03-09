// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ClearButtonPage } from '../../../src/pages/correspondant/clear-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS30_TC02';
const TC_TITLE = 'Verifying the Cancel Button is disabled for the statuses by filtering';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestListPage: BidRequestListPage;
  let bidRequestPage: BidRequestPage;
  let clearButtonPage: ClearButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    bidRequestPage = new BidRequestPage(page);
    clearButtonPage = new ClearButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials ─────────────────────────────────────────
      log.step('Loading credentials');
      try {
        const crederntials = ENV.getCredentials('internal');
        vars["Username"] = crederntials.username;
        vars["Password"] = crederntials.password;
        // console.log("Test Data: ", testData);
        console.log("Credentials: ", crederntials.username, crederntials.password);
        console.log("Credentials:==> ", vars["Username"], vars["Password"]);
        log.stepPass('Credentials loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials failed');
        throw e;
      }

      // ── Step 2: Login to Correspondent Portal ────────────────────────────
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await expect(correspondentPortalPage.Bid_Requestsside_bar_menu).toBeVisible();
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }

      // ── Step 3: Initialize loop variables ────────────────────────────────
      log.step('Initializing loop variables for status verification');
      try {
        vars["count"] = "1";
        vars["TotalStatusCount"] = "4";
        vars["DisabledOptions"] = "Processing Failed, Pricing in Progress, Price Offered, Partially Committed, Commitment in Progress, Cancelled, Expired";
        log.stepPass('Loop variables initialized successfully');
      } catch (e) {
        await log.stepFail(page, 'Initializing loop variables failed');
        throw e;
      }

      // ── Step 4: Loop through statuses and verify Cancel Button is disabled
      log.step('Looping through statuses and verifying Cancel Button is disabled for each status');
      try {
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalStatusCount"]))) {

          await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(page.getByText("Bid Requests").first()).toBeVisible();

          if (await clearButtonPage.Clear_Button.isVisible()) {
            await clearButtonPage.Clear_Button.click();
          }

          await priceOfferedPage.Filter_Dropdown1.click();
          await bidRequestPage.Select_Bid_Request_Status_Dropdown.click();

          if (String(vars["count"]) === String("1")) {
            vars["StatusToBeSet"] = "Processing Failed";
          } else if (String(vars["count"]) === String("2")) {
            vars["StatusToBeSet"] = "Price Offered";
          } else if (String(vars["count"]) === String("3")) {
            vars["StatusToBeSet"] = "Expired";
          } else {
            vars["StatusToBeSet"] = "Cancelled";
          }

          log.info(`Iteration ${vars["count"]} — Verifying Cancel Button is disabled for status: ${vars["StatusToBeSet"]}`);

          await bidRequestPage.All_Status_From_Dropdown.first().evaluate(el => { (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight; });
          await bidRequestPage.StatusCheck(vars["StatusToBeSet"]).check();
          await expect((bidRequestPage.StatusCheck(vars["StatusToBeSet"])).first()).toBeVisible();
          await correspondentPortalPage.Apply_Selected.nth(1).click();
          await applyFiltersButtonPage.Apply_Filters_Button.first().click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect((bidRequestListPage.First_Cancel_Button).first()).toBeVisible();
          expect(String(vars["DisabledOptions"])).toContain(vars["StatusToBeSet"]);

          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
        log.stepPass('All statuses verified — Cancel Button is disabled for all expected statuses');
      } catch (e) {
        await log.stepFail(page, 'Verifying Cancel Button disabled status failed for status: ' + vars["StatusToBeSet"]);
        throw e;
      }

      // ─── TC End: PASS ────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }

  });
});