// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1330 } from '../../../src/helpers/prereqs/BidRequests/prereq-1330';
import { Logger as log } from '../../../src/helpers/log-helper';
const TC_ID    = 'REG_TS35_TC02';
const TC_TITLE = 'Verify the clear search functionality for Search Through Id Input';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1330(page, vars);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Verify Navigate To Page is visible ────────────────────────
      log.step('Verifying Navigate To Page element is visible');
      try {
        await expect(bidRequestsPage.Navigate_To_Page).toBeVisible();
        log.stepPass('Navigate To Page element is visible');
      } catch (e) {
        await log.stepFail(page, 'Navigate To Page element is not visible');
        throw e;
      }

      // ── Step 2: Navigate to Page 1 if Previous button is visible ─────────
      log.step('Navigating to Page 1 if Navigate to Previous button is visible');
      try {
        if (await bidRequestPage.Navigate_to_Previous.isVisible()) /* Verify that the element Navigate To Page displays text conta */ {
          await expect(bidRequestPage.Navigate_to_Previous).toBeEnabled();
          await bidRequestPage.Navigate_to_Previous.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(bidRequestsPage.Navigate_To_Page).toContainText("Page 1");
        }
        log.stepPass('Page 1 navigation handled successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Page 1 failed');
        throw e;
      }

      // ── Step 3: Extract searched ID and click Cross Button to clear search ─
      log.step('Extracting searched ID and clicking Cross Button to clear search');
      try {
        vars["IDSearchedFor"] = await bidRequestsPage.Search_by_Bid_Request_ID_Field.inputValue() || '';
        await expect(bidRequestsPage.Cross_Button_in_Search_Field).toBeEnabled();
        await bidRequestsPage.Cross_Button_in_Search_Field.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Searched ID extracted and search cleared successfully. ID was: ' + vars["IDSearchedFor"]);
      } catch (e) {
        await log.stepFail(page, 'Extracting searched ID or clearing search failed');
        throw e;
      }

      // ── Step 4: Verify Bid ID records after clearing search ───────────────
      log.step('Verifying Bid ID records displayed after clearing search');
      try {
        if (await bidRequestsPage.Bid_ID_Contains_SearchedID(vars["IDSearchedFor"]).isVisible()) /* Element Bid ID Contains SearchedID is visible */ {
          // vars["BidIDWithSearchIDCount"] = String(await bidRequestsPage.Bid_ID_Contains_SearchedID(vars["IDSearchedFor"]).count());
          // expect(String(vars["BidIDWithSearchIDCount"])).toBeLessThan(parseInt("20"));
          vars["BidIDWithSearchIDCount"] = String(await bidRequestsPage.Bid_ID_Contains_SearchedID(vars["IDSearchedFor"]).count());
          expect(Number(vars["BidIDWithSearchIDCount"])).toBeLessThan(20);
        } else {
          await expect(bidRequestsPage.Bid_ID_Contains_SearchedID(vars["IDSearchedFor"])).not.toBeVisible();
        }
        log.stepPass('Bid ID records verified successfully after clearing search');
      } catch (e) {
        await log.stepFail(page, 'Verifying Bid ID records after clearing search failed');
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