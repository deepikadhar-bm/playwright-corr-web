// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { runPrereq_1303 } from '../../../src/helpers/prereqs/BidRequests/prereq-1303';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let correspondentPortalPage: CorrespondentPortalPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1303(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
  });

  test('REG_TS22_TC08_02_Reprice bid for #Bid req ID\\\" popup : Modify the bulk batch time config for next business day,  and validate that Next business day\\\'s pricing return time values are updated according', async ({ page }) => {

    const TC_ID = 'REG_TS22_TC08_02';
    const TC_TITLE = 'Reprice bid popup: Modify bulk batch time config for next business day and validate pricing return time values are updated accordingly.';

    try {
      log.tcStart(TC_ID, TC_TITLE);

      // ── Step 1: Verify Bid Request Date & Select Next Business Day ────────
      log.step('Verifying Bid Requested Date visibility and selecting Next Business Day radio button');
      try {
        await expect(correspondentPortalPage.Bid_Requested_Date).toBeVisible();
        log.info('Bid Requested Date is visible');

        await correspondentPortalPage.bidRequestDate_Next_Bussiness_Radio_Button.check();
        await expect(correspondentPortalPage.bidRequestDate_Next_Bussiness_Radio_Button).toBeChecked();
        log.info('Next Business Day radio button checked and verified');

        log.stepPass('Bid Requested Date visible and Next Business Day radio button selected successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Bid Requested Date or select Next Business Day radio button');
        throw e;
      }

      // ── Step 2: Open Dropdown & Capture Dropdown Value Count ──────────────
      log.step('Opening pricing return time dropdown and capturing total option count');
      try {
        await correspondentPortalPage.Dropdown_selection_2.click();
        log.info('Clicked Dropdown_selection_2');

        vars["DropdownValue"] = String(await bidRequestDetailsPage.Selection_Dropdown_In_Resubmit_Popup.count());
        log.info(`Total dropdown options count: ${vars["DropdownValue"]}`);

        vars["count"] = "1";
        vars["count1"] = "0";
        log.info(`Initialized count: ${vars["count"]}, count1: ${vars["count1"]}`);

        log.stepPass('Dropdown opened and option count captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to open dropdown or capture option count');
        throw e;
      }

      // ── Step 3: Validate Each Dropdown Option Against Stored Batch Timings ─
      log.step('Iterating dropdown options and validating against stored batch timings');
      try {
        // while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DropdownValue"]))) {
        //   vars["Value1"] = await bidRequestListPage.Selection_Dropdown_In_Resubmit_Popup2(vars["count"]).textContent() || '';
        for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseFloat(String(vars["DropdownValue"])); dataIdx++) {
          vars["Value1"] = await bidRequestListPage.Selection_Dropdown_In_Resubmit_Popup2(vars["count"]).textContent() || '';
          log.info(`dataIdx ${dataIdx} — Dropdown option text: ${vars["Value1"]}`);

          // expect(String(vars["Stored_Text1"])).toBe(vars["Value1"]);
          const profileName = 'Bid Requests';
          const profile = testDataManager.getProfileByName(profileName);
          if (profile && profile.data) {
            const batchTime = profile.data[dataIdx - 1]['Stored_Text1'];
            vars["Stored_Text1"] = batchTime;
            log.info(`Loaded stored batch time at index ${dataIdx - 1}: ${vars["Stored_Text1"]}`);
          }

          //expect(String(vars["Stored_Text1"])).toBe(vars["Value1"]);
          await page.waitForTimeout(2000);
          //const bidRequestListPageInstance = new BidRequestListPage(page);
          await expect(bidRequestDetailsPage.Resubmit_Pricing_Dropdown_new.locator(`option[value="${vars["Stored_Text1"]}"]`)).toBeAttached();
          log.info(`Validated: option[value="${vars["Stored_Text1"]}"] is attached in dropdown`);

          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
        //  vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        //}

        log.stepPass('All dropdown options validated against stored batch timings successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to validate dropdown options against stored batch timings');
        throw e;
      }

      // ── Step 4: Close Bid Request Details Popup ───────────────────────────
      log.step('Closing the bid request details popup');
      try {
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        log.info('Clicked close popup button');

        log.stepPass('Bid request details popup closed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to close bid request details popup');
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