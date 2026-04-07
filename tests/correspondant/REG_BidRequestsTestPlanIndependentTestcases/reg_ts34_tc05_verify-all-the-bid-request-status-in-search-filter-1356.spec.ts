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
const TC_ID = 'REG_TS34_TC05';
const TC_TITLE = 'Verify All the Bid Request Status In Search Filter';

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

      // ── Step 4: Capture total count of Bid Request statuses ───────────────
      log.step('Capturing total count of Bid Request statuses from dropdown');
      try {
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
        vars["CountOfStatus"] = String(await bidRequestPage.All_Status_From_Dropdown.count());
        await priceOfferedPage.Filter_Dropdown1.click();
        await page.waitForLoadState('load');
        await expect(correspondentPortalPage.Select_Bid_Request_Status_Dropdown1).not.toBeVisible();
        log.stepPass(`Total Bid Request status count captured: ${vars["CountOfStatus"]}`);
      } catch (e) {
        await log.stepFail(page, 'Capturing total count of Bid Request statuses failed');
        throw e;
      }

      // ── Step 5: Iterate and verify each Bid Request status ────────────────
      log.step('Iterating through each Bid Request status and verifying results');
      try {
        vars["Count"] = "1";
        while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["CountOfStatus"]))) {
          await priceOfferedPage.Filter_Dropdown1.click();
          await page.waitForLoadState('load');
          await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
          vars["ExpectedStatus"] = await bidRequestPage.Individual_Status_NameDropdown(vars["Count"]).textContent() || '';
          await bidRequestPage.Individual_Status_NameDropdown(vars["Count"]).click();
          await page.waitForLoadState('load');
          await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
          await applyFiltersButtonPage.Apply_Filters_Button.click();
          await page.waitForLoadState('load');
          log.info(`Iteration ${vars["Count"]}: Verifying status - Expected: ${vars["ExpectedStatus"]}`);
          let firstStatusText: string | null = null;
          //firstStatusText = await bidRequestPage.Individual_Status_BidReqList.first().textContent();
          if (await bidRequestPage.Individual_Status_BidReqList.first().isVisible()) {
            firstStatusText = await bidRequestPage.Individual_Status_BidReqList.first().textContent();
          }
          if (String(vars["ExpectedStatus"]).includes(String("Queued"))) {
            if (firstStatusText?.includes(String("Queued"))) {
              for (let i = 0; i < await bidRequestPage.Individual_Status_BidReqList.count(); i++) {
                await expect(bidRequestPage.Individual_Status_BidReqList.nth(i)).toContainText(String("Queued"));
              }
            } else {
              await expect(page.getByText("No result")).toBeVisible();
            }
          } else if (String(vars["ExpectedStatus"]).includes(String("Commitment"))) {
            if (firstStatusText?.includes(String("Commitment in progress"))) /* Verify that the element Status On Home Page displays text co */ {
              for (let i = 0; i < await bidRequestPage.Individual_Status_BidReqList.count(); i++) {
                await expect(bidRequestPage.Individual_Status_BidReqList.nth(i)).toContainText(String("Commitment in progress"));
              }
            } else {
              await expect(page.getByText("No result")).toBeVisible();
            }
          } else if (String(vars["ExpectedStatus"]).includes(String("Deleted"))) {
            if (firstStatusText?.includes(String("Deleted"))) /* Verify that the element Status On Home Page displays text co */ {
              for (let i = 0; i < await bidRequestPage.Individual_Status_BidReqList.count(); i++) {
                await expect(bidRequestPage.Individual_Status_BidReqList.nth(i)).toContainText(String("Deleted"));
              }
            } else {
              await expect(page.getByText("No result")).toBeVisible();
            }
          } else {
            if (firstStatusText?.includes(String(vars["ExpectedStatus"]))) /* Verify that the element Status On Home Page displays text co */ {
              for (let i = 0; i < await bidRequestPage.Individual_Status_BidReqList.count(); i++) {
                await expect(bidRequestPage.Individual_Status_BidReqList.nth(i)).toContainText(String(vars["ExpectedStatus"]));
              }
            } else {
              await expect(page.getByText("No result")).toBeVisible();
            }
          }
          await correspondentPortalPage.Clear_All_Button.click();
          vars["Count"] = (parseFloat(String(vars["Count"])) + parseFloat(String("1"))).toFixed(0);
        }
        log.stepPass('All Bid Request statuses verified successfully');
      } catch (e) {
        await log.stepFail(page, `Bid Request status verification failed at iteration count: ${vars["Count"]}`);
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