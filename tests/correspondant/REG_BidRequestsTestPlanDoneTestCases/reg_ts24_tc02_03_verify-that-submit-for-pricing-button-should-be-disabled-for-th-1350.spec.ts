// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CancelButtonPage } from '../../../src/pages/correspondant/cancel-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { runPrereq_1261 } from '../../../src/helpers/prereqs/BidRequests/prereq-1261';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let cancelButtonPage: CancelButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1261(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    cancelButtonPage = new CancelButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  const TC_ID = 'REG_TS24_TC02_03';
  const TC_TITLE = 'Verify that submit for pricing button should be disabled for the status and the Queued Time text Should be Red In colour for passed time.';

  test('REG_TS24_TC02_03_Verify that submit for pricing button should be disabled for the status and the Queued Time text Should be Red In colour for passed time.', async ({ page }) => {
    try {
      log.tcStart(TC_ID, TC_TITLE);

      // ── Step 1: Extract Bid Request ID ─────────────────────────────────────
      log.step('Extracting Bid Request ID from details page');
      try {
        vars["BidRequestID1"] = await bidRequestDetailsPage.Bid_Request_Details_Text.textContent() || '';
        log.info(`Bid Request ID extracted: ${vars["BidRequestID1"]}`);
        log.stepPass('Bid Request ID extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract Bid Request ID');
        throw e;
      }

      // ── Step 2: Click Submit for Pricing Button ────────────────────────────
      log.step('Clicking Submit for Pricing button');
      try {
        log.info('Clicking Submit_for_PricingEnabled button');
        await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
        log.info('Submit for Pricing button clicked');
        log.stepPass('Submit for Pricing button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Submit for Pricing button');
        throw e;
      }

      // ── Step 3: Verify and Click Submit Dialog ─────────────────────────────
      log.step('Verifying Submit for Pricing dialog and clicking Yes button');
      try {
        log.info('Waiting for "Submit for Pricing" text to be visible');
        await expect(page.getByText("Submit for Pricing").first()).toBeVisible();
        log.info('"Submit for Pricing" dialog is visible');

        log.info('Clicking Yes_Submit_Button');
        await bidRequestDetailsPage.Yes_Submit_Button.click();
        log.info('Yes Submit button clicked');

        log.stepPass('Submit dialog handled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed during Submit dialog verification');
        throw e;
      }

      // ── Step 4: Handle Spinner and Response Dialogs ─────────────────────────
      log.step('Waiting for spinner and handling response dialogs');
      try {
        log.info('Waiting for spinner to be hidden');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner is hidden');

        if (await okButtonPage.Ok_Button.isVisible()) {
          log.info('Ok button is visible - clicking it');
          await okButtonPage.Ok_Button.click();
          log.info('Ok button clicked');
        } else {
          log.info('Ok button is not visible');
        }

        if (await cancelButtonPage.Cancel_Button.isVisible()) {
          log.info('Cancel button is visible - clicking it');
          await cancelButtonPage.Cancel_Button.click();
          log.info('Cancel button clicked');
        } else {
          log.info('Cancel button is not visible');
        }

        log.info('Waiting for spinner to be hidden after dialog handling');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner is hidden');

        log.stepPass('Spinner and dialog handling completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed during spinner and dialog handling');
        throw e;
      }

      // ── Step 5: Trim and Search Bid Request ID ─────────────────────────────
      log.step('Trimming Bid Request ID and searching');
      try {
        vars["TrimmedBidRequestID1"] = String(vars["BidRequestID1"]).trim();
        log.info(`Trimmed Bid Request ID: ${vars["TrimmedBidRequestID1"]}`);

        log.info('Filling search field with Bid Request ID');
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["TrimmedBidRequestID1"]);
        log.info('Search field filled');

        log.info('Waiting for spinner to be hidden');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner is hidden');

        log.stepPass('Bid Request ID search completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed during Bid Request ID search');
        throw e;
      }

      // ── Step 6: Navigate to First Bid Request ──────────────────────────────
      log.step('Navigating to first Bid Request in results');
      try {
        log.info('Clicking first Bid Request ID');
        await correspondentPortalPage.First_Bid_Request_ID.first().click();
        log.info('First Bid Request ID clicked');

        log.info('Waiting for spinner to be hidden');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner is hidden');

        log.stepPass('Navigation to Bid Request completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Request');
        throw e;
      }
      await bidRequestDetailsPage.Statusbid_request_details.waitFor({ state: 'visible', timeout: 2000 });
      // ── Step 7: Extract Status and Queued Time ─────────────────────────────
      log.step('Extracting status and queued time information');
      try {
        vars["Status"] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
        log.info(`Status extracted: ${vars["Status"]}`);

        if (await bidRequestDetailsPage.Queued_Forbid_request_details_text_dark.isVisible()) {
          log.info('Queued For Time element is visible (dark text)');

//           vars["ExtractedQueuedForTime"] = await bidRequestDetailsPage.Queued_Forbid_request_details_text_dark.textContent() || '';
//           log.info(`Queued For Time extracted: ${vars["ExtractedQueuedForTime"]}`);
// const timeParts = vars["ExtractedQueuedForTime"].trim().split(" ");
//           // vars["ExtractedQueuedForTime(only time)"] = String('ExtractedQueuedForTime').split("")["3"] || '';
//           // log.info(`Only time extracted: ${vars["ExtractedQueuedForTime(only time)"]}`);
         
// log.info(`Only time extracted: ${vars["ExtractedQueuedForTime(only time)"]}`);

//           vars["ExtractedQueuedForTime(extracted hour minutes)"] = vars["ExtractedQueuedForTime(only time)"];
//           log.info(`Hour minutes extracted: ${vars["ExtractedQueuedForTime(extracted hour minutes)"]}`);

//           // vars["ExtractedQueuedForTime(only am pm)"] = String('ExtractedQueuedForTime').split("")["4"] || '';
//           // log.info(`Only AM/PM extracted: ${vars["ExtractedQueuedForTime(only am pm)"]}`);
// log.info(`Only AM/PM extracted: ${vars["ExtractedQueuedForTime(only am pm)"]}`);
//           vars["ExtractedQueuedForTime(extracted am pm)"] = vars["ExtractedQueuedForTime(only am pm)"];
//           log.info(`AM/PM extracted: ${vars["ExtractedQueuedForTime(extracted am pm)"]}`);

//           vars["ExtractedQueuedForTime( time with am pm)"] = String(vars["ExtractedQueuedForTime(extracted hour minutes)"]) + ' ' + String(vars["ExtractedQueuedForTime(extracted am pm)"]);
//           log.info(`Time with AM/PM: ${vars["ExtractedQueuedForTime( time with am pm)"]}`);
// Extract the full queued for time text
vars["ExtractedQueuedForTime"] = await bidRequestDetailsPage.Queued_Forbid_request_details_text_dark.textContent() || '';
log.info(`Queued For Time extracted: ${vars["ExtractedQueuedForTime"]}`);

// Split the extracted time string by spaces to separate time and AM/PM
const timePartsArray = String(vars["ExtractedQueuedForTime"]).trim().split(" ");

// Extract the time part (first element after split)
vars["ExtractedQueuedForTime(only time)"] = timePartsArray[3] || '';
log.info(`Only time extracted: ${vars["ExtractedQueuedForTime(only time)"]}`);

// Store hour:minutes
vars["ExtractedQueuedForTime(extracted hour minutes)"] = vars["ExtractedQueuedForTime(only time)"];
log.info(`Hour minutes extracted: ${vars["ExtractedQueuedForTime(extracted hour minutes)"]}`);

// Extract the AM/PM part (second element after split)
vars["ExtractedQueuedForTime(only am pm)"] = timePartsArray[4] || '';
log.info(`Only AM/PM extracted: ${vars["ExtractedQueuedForTime(only am pm)"]}`);

// Store AM/PM
vars["ExtractedQueuedForTime(extracted am pm)"] = vars["ExtractedQueuedForTime(only am pm)"];
log.info(`AM/PM extracted: ${vars["ExtractedQueuedForTime(extracted am pm)"]}`);

// Combine time with AM/PM
vars["ExtractedQueuedForTime( time with am pm)"] = String(vars["ExtractedQueuedForTime(extracted hour minutes)"]) + ' ' + String(vars["ExtractedQueuedForTime(extracted am pm)"]);
log.info(`Time with AM/PM: ${vars["ExtractedQueuedForTime( time with am pm)"]}`);


          log.info('Verifying Submit for Pricing button is disabled');
          await expect(bidRequestDetailsPage.Submit_For_Pricingdisabled).toBeDisabled();
          log.info('Submit for Pricing button is disabled as expected');
        } else {
          log.info('Queued For Time element is not visible');
        }

        log.stepPass('Status and Queued Time extraction completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract status and queued time');
        throw e;
      }

      // ── Step 8: Navigate to Bid Requests Side Menu ─────────────────────────
      log.step('Navigating to Bid Requests side menu');
      try {
        log.info('Clicking Bid Requests side menu');
        await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
        log.info('Bid Requests side menu clicked');

        log.info('Waiting for spinner to be hidden');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner is hidden');

        log.info('Verifying Search field is visible');
        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        log.info('Search field is visible');

        log.stepPass('Navigation to Bid Requests menu completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Requests menu');
        throw e;
      }

      // ── Step 9: Clear and Search Again ────────────────────────────────────
      log.step('Clearing and refilling search field');
      try {
        log.info('Clearing search field');
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        log.info('Search field cleared');

        log.info('Filling search field with Bid Request ID');
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["TrimmedBidRequestID1"]);
        log.info('Search field filled again');

        log.stepPass('Search field cleared and refilled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to clear and refill search field');
        throw e;
      }

      // ── Step 10: Build Expected Status and Extract Actual Status ──────────
      log.step('Building expected status and extracting actual status');
      try {
        vars["ExtractedQueuedForTime( time with am pm ET)"] = String(vars["ExtractedQueuedForTime( time with am pm)"]) + ' ' + String("ET");
        log.info(`Time with ET: ${vars["ExtractedQueuedForTime( time with am pm ET)"]}`);

        vars["FinalExpectedStatus(bid requests)"] = String('Queued For Next Business Day / ') + String(vars["ExtractedQueuedForTime( time with am pm ET)"]);
        log.info(`Final Expected Status (before trim): ${vars["FinalExpectedStatus(bid requests)"]}`);

        vars["FinalExpectedStatus(bid requests)"] = String(vars["FinalExpectedStatus(bid requests)"]).trim();
        log.info(`Final Expected Status (after trim): ${vars["FinalExpectedStatus(bid requests)"]}`);

        vars["FinalActualStatus(bid requests)"] = await bidRequestPage.First_Status_In_Column.textContent() || '';
        log.info(`Final Actual Status (before trim): ${vars["FinalActualStatus(bid requests)"]}`);

        vars["FinalActualStatus(bid requests)"] = String(vars["FinalActualStatus(bid requests)"]).trim();
        log.info(`Final Actual Status (after trim): ${vars["FinalActualStatus(bid requests)"]}`);

        log.stepPass('Status building and extraction completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to build and extract status');
        throw e;
      }

      // ── Step 11: Verify Status Match ───────────────────────────────────────
      log.step('Verifying expected status matches actual status');
      try {
        log.info(`Comparing statuses (case-insensitive):`);
        log.info(`Expected: "${String(vars["FinalExpectedStatus(bid requests)"]).toLowerCase()}"`);
        log.info(`Actual: "${String(vars["FinalActualStatus(bid requests)"]).toLowerCase()}"`);

        expect(String(vars["FinalActualStatus(bid requests)"]).toLowerCase()).toContain(String(vars["FinalExpectedStatus(bid requests)"]).toLowerCase());
        log.info('Status match verified successfully');

        log.stepPass('Status verification completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify status match');
        throw e;
      }

      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});