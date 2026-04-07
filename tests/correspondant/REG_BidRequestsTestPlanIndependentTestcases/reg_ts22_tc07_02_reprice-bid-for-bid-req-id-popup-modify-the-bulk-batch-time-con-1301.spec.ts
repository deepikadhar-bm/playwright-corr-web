// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { runPrereq_1295 } from '../../../src/helpers/prereqs/BidRequests/prereq-1295';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';


test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let correspondentPortalPage: CorrespondentPortalPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1295(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
  });

  test('REG_TS22_TC07_02_Reprice bid for #Bid req ID\\\" popup : Modify the bulk batch time config for today, and validate that Today\\\'s pricing return time values are updated accordingly, when bid requested da', async ({ page }) => {

    const TC_ID = 'REG_TS22_TC07_02';
    const TC_TITLE = 'Reprice bid for #Bid req ID popup: Modify the bulk batch time config for today, and validate that Today\'s pricing return time values are updated accordingly, when bid requested date is today.';

    try {
      log.tcStart(TC_ID, TC_TITLE);
      const profile2 = testDataManager.getProfileByName("Bid Requests");
      if (profile2 && profile2.data) {
        const CompanyName = profile2.data[0]['Company Name'];
        vars["CompanyName"] = CompanyName;
        log.info(`Loaded Company Name: ${vars["CompanyName"]}`);


      }
      // ── Step 1: Validate Bid Requested Date & Today Filter ───────────────
      log.step('Validating Bid Requested Date visibility and Today filter is enabled');
      try {
        await expect(correspondentPortalPage.Bid_Requested_Date).toBeVisible();
        log.info('"Bid Requested Date" is visible');

        await expect(correspondentPortalPage.Today).toBeEnabled();
        log.info('"Today" filter is enabled');

        log.stepPass('Bid Requested Date and Today filter validated successfully');
      } catch (e) {
        await log.stepFail(page, 'Bid Requested Date or Today filter validation failed');
        throw e;
      }

      // ── Step 2: Open Dropdown & Initialise Loop Variables ────────────────
      log.step('Opening resubmit popup dropdown and initialising loop variables');
      try {
        await correspondentPortalPage.Dropdown_selection_2.click();
        log.info('Clicked Dropdown_selection_2 to open resubmit popup');

        vars["DropdownValue"] = String(await bidRequestDetailsPage.Selection_Dropdown_In_Resubmit_Popup.count());
        log.info(`Total dropdown options (DropdownValue): ${vars["DropdownValue"]}`);

        vars["count"] = "1";
        vars["count1"] = "0";
        log.info(`Loop counters initialised — count: ${vars["count"]}, count1: ${vars["count1"]}`);

        log.stepPass('Dropdown opened and loop variables initialised successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to open dropdown or initialise loop variables');
        throw e;
      }

      // ── Step 3: Validate Each Dropdown Option Against Stored Batch Times ─
      log.step('Iterating dropdown options and validating against stored batch times');
      try {
        // while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DropdownValue"]))) {
        //   vars["Value"] = await bidRequestListPage.Selection_Dropdown_In_Resubmit_Popup2.textContent() || '';
        for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseFloat(String(vars["DropdownValue"])); dataIdx++) {
          vars["Value"] = await bidRequestListPage.Selection_Dropdown_In_Resubmit_Popup2(vars["count"]).textContent() || '';
          log.info(`dataIdx ${dataIdx} — dropdown option Value: ${vars["Value"]}`);

          const profileName = 'Bid Requests';
          const profile = testDataManager.getProfileByName(profileName);
          if (profile && profile.data) {
            const batchTime = profile.data[dataIdx - 1]['Stored_Text'];
            vars["Stored_Text"] = batchTime;
            log.info(`Loaded stored batch time at index ${dataIdx - 1}: ${vars["Stored_Text"]}`);
          }

          //expect(String(vars["Stored_Text"])).toBe(vars["Value"]);
          await page.waitForTimeout(2000);
          //const bidRequestListPageInstance = new BidRequestListPage(page);
          await expect( bidRequestDetailsPage.Resubmit_Pricing_Dropdown_new.locator(`option[value="${vars["Stored_Text"]}"]`)).toBeAttached();
          log.info(`PASS — option with value "${vars["Stored_Text"]}" is attached in Pricing_Return_Time dropdown`);

          vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
          log.info(`count1 incremented to: ${vars["count1"]}`);
        }
        vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        log.info(`count incremented to: ${vars["count"]}`);
        // }

        log.stepPass('All dropdown options validated successfully against stored batch times');
      } catch (e) {
        await log.stepFail(page, 'Dropdown option validation against stored batch times failed');
        throw e;
      }

      // ── Step 4: Close Popup ──────────────────────────────────────────────
      log.step('Closing the bid request details popup');
      try {
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        log.info('Clicked close button on bid request details popup');

        log.stepPass('Popup closed successfully');
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