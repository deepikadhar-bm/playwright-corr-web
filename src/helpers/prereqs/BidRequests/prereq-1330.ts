import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../../step-groups';
import { BidRequestPage } from '../../../pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../../src/constants/app-constants';
const TC_ID = 'PREREQ-1330';
const TC_TITLE = 'Verify that entering 3 or more digits in the search input displays bid records that match the entered values.';
export async function runPrereq_1330(page: Page, vars: Record<string, string>): Promise<void> {
  const bidRequestPage = new BidRequestPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const spinnerPage = new SpinnerPage(page);
  try {
    log.tcStart(TC_ID, TC_TITLE);
    // ── Step 1: Load Credentials ─────────────────────────────────────────
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

    // ── Step 3: Navigate to Bid Requests ─────────────────────────────────
    log.step('Navigating to Bid Requests page');
    try {
      await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect((page.getByText("Bid Requests")).first()).toBeVisible();
      await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
      log.stepPass('Navigated to Bid Requests page successfully');
    } catch (e) {
      await log.stepFail(page, 'Navigating to Bid Requests page failed');
      throw e;
    }

    // ── Step 4: Search by Bid Request ID ─────────────────────────────────
    log.step('Entering search input' + appconstants.ThreeDigitBidReqID + ' in Bid Request ID field');
    try {
      page.waitForTimeout(3000);
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(appconstants.ThreeDigitBidReqID);
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.press('Enter');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Search input' + appconstants.ThreeDigitBidReqID + ' entered and results loaded successfully');
    } catch (e) {
      await log.stepFail(page, 'Entering search input or waiting for results failed');
      throw e;
    }

    // ── Step 5: Verify all records on page 1 match search input ──────────
    log.step('Verifying all Bid Request records on page 1 match search input "' + appconstants.ThreeDigitBidReqID + '"');
    try {
      vars["TotalCount"] = String(await bidRequestsPage.All_Bid_RequestsBid_Requests.count());
      vars["count"] = "1";
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalCount"]))) {
        await expect(bidRequestPage.All_Bid_Requests2Bid_Requests(parseInt(vars["count"]))).toContainText(appconstants.ThreeDigitBidReqID);
        vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      }
      log.stepPass('All Bid Request records on page 1 verified to match search input' + appconstants.ThreeDigitBidReqID);
    } catch (e) {
      await log.stepFail(page, 'Verifying Bid Request records on page 1 failed');
      throw e;
    }

    // ── Step 6: Navigate to page 2 and verify records match search input ──
    log.step('Navigating to page 2 and verifying Bid Request records match search input' + appconstants.ThreeDigitBidReqID);
    try {
      vars["count"] = "1";
      if (await bidRequestsPage.Navigate_to_Next.isVisible()) /* Element Navigate To Page is visible */ {
        await bidRequestsPage.Navigate_to_Next.click();
        await expect(bidRequestsPage.Navigate_To_Page).toContainText("Page 2");
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalCount"]))) {
          await expect(bidRequestPage.All_Bid_Requests2Bid_Requests(parseInt(vars["count"]))).toContainText(appconstants.ThreeDigitBidReqID);
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
      }
      log.stepPass('All Bid Request records on page 2 verified to match search input' + appconstants.ThreeDigitBidReqID);
    } catch (e) {
      await log.stepFail(page, 'Navigating to page 2 and verifying records failed');
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

}

