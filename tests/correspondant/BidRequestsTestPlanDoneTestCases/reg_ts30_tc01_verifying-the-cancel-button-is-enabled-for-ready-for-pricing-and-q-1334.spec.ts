// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1313 } from '../../../src/helpers/prereqs/BidRequests/prereq-1313';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS30_TC01';
const TC_TITLE = 'Verifying the Cancel Button is enabled for Ready For Pricing and Qued for next bussiness day statuses';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1313(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Verify Cancel Button is Enabled for Ready For Pricing ─────
      log.step('Verifying Cancel Button is enabled for Ready For Pricing status');
      try {
        await expect(bidRequestListPage.Respective_Bid_Cancel_Button_list(vars["RequestIDDetails"])).toBeEnabled();
        log.stepPass('Cancel Button is enabled for Ready For Pricing status');
      } catch (e) {
        await log.stepFail(page, 'Cancel Button is not enabled for Ready For Pricing status');
        throw e;
      }

      // ── Step 2: Navigate to Bid Request Details ───────────────────────────
      log.step('Navigating to Bid Request Details');
      try {
        await bidRequestListPage.Request_Id_From_list(vars["RequestIDDetails"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info(`Navigated to Bid Request Details for ID: ${vars["RequestIDDetails"]}`);
        log.stepPass('Navigated to Bid Request Details successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Bid Request Details failed');
        throw e;
      }

      // ── Step 3: Submit Bid Request for Pricing ────────────────────────────
      log.step('Submitting Bid Request for Pricing');
      try {
        await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestDetailsPage.Yes_Submit_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Bid Request submitted for Pricing successfully');
      } catch (e) {
        await log.stepFail(page, 'Submitting Bid Request for Pricing failed');
        throw e;
      }

      // ── Step 4: Verify Cancel Button is Enabled for Queued for Next Business Day ──
      log.step('Verifying Cancel Button is enabled for Queued for Next Business Day status');
      try {
        await expect(bidRequestListPage.Respective_Bid_Cancel_Button_list(vars["RequestIDDetails"])).toBeEnabled();
        log.stepPass('Cancel Button is enabled for Queued for Next Business Day status');
      } catch (e) {
        await log.stepFail(page, 'Cancel Button is not enabled for Queued for Next Business Day status');
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