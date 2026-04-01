// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidrequestCreationPage } from '../../../src/pages/correspondant/bidrequest-creation';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';
import { runPrereq_1202 } from '../../../src/helpers/prereqs/PreReqBidRequests/prereq-1202';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS01_TC11.1';
const TC_TITLE = 'Update the pricing return time values for today and verify that the same should be displayed in the dropdown list for today.';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidrequestCreationPage: BidrequestCreationPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1202(page, vars);
    bidrequestCreationPage = new BidrequestCreationPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
  });

  test('REG_TS01_TC11.1_Update the pricing return time values for today and verify that the same should be displayed in the dropdown list for today.', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Navigate to Bid Requests and open Upload New Bid Request ─────────
      log.step('Navigating to Bid Requests and opening Upload New Bid Request');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Requests").first()).toBeVisible();
        log.info('Bid Requests page is visible');

        await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        // [DISABLED] Verify that the current page displays text Bid Request Details
        // await expect(page.getByText("Bid Request Details")).toBeVisible();

        log.stepPass('Navigation to Upload New Bid Request successful');
      } catch (e) {
        await log.stepFail(page, 'Navigation to Upload New Bid Request failed');
        throw e;
      }

      // ── Open dropdown and count options ───────────────────────────────────
      log.step('Opening pricing return time dropdown and counting options');
      try {
        vars["BatchNum"] = "1";
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();
        vars["CountOfOptionsDropdown"] = String(await bidRequestDetailsPage.Pricing_ReturnTime_Dropdown1.count());
        vars["CountOfOptionsDropdown"] = (parseFloat(String(vars["CountOfOptionsDropdown"])) - parseFloat(String("1"))).toFixed(0);
        log.info(`CountOfOptionsDropdown (after -1): ${vars["CountOfOptionsDropdown"]}`);

        log.stepPass('Dropdown opened and options counted successfully');
      } catch (e) {
        await log.stepFail(page, 'Opening dropdown or counting options failed');
        throw e;
      }

      // ── Select Today Only radio and verify dropdown options for today ──────
      log.step('Selecting Today Only radio button and verifying dropdown options for today');
      try {
        await statusInactivePage.TodayOnly_Radio_Button.check();
        await expect(statusInactivePage.TodayOnly_Radio_Button).toBeChecked();
        log.info('Today Only radio button is checked');

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.hover();
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click({ force: true });
        log.info('Pricing return time dropdown reopened via hover and force click');

        //while (parseFloat(String(vars["BatchNum"])) <= parseFloat(String(vars["CountOfOptionsDropdown"]))) {
        for (let dataIdx = parseInt(vars["BatchNum"]); dataIdx <= parseInt(vars["CountOfOptionsDropdown"]); dataIdx++) {
          log.info(`Processing dropdown option ${dataIdx} of ${vars["CountOfOptionsDropdown"]} for Today Only`);

          const profileName = 'bulk batch to bid request';
          const profile = testDataManager.getProfileByName(profileName);
          if (profile && profile.data) {
            const batchTime = profile.data[dataIdx - 1]['batch time'];
            vars["batch time"] = batchTime;
            log.info(`Loaded batch time: ${vars["batch time"]}`);
          }

          vars["BatchTime"] = vars["batch time"];
          await expect(correspondentPortalPage.Pricing_Return_Time.locator(`option[value="${vars["BatchTime"]}"]`)).toBeAttached();
          log.info(`Dropdown option verified as attached for batch time: ${vars["BatchTime"]}`);

          await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();
          log.info('Dropdown clicked for next iteration');

          // await expect(chaseFieldNamePage.Option_in_PricingReturn_Dropdown).toBeVisible();
          vars["BatchNum"] = (parseFloat(String("1")) + parseFloat(String(vars["BatchNum"]))).toFixed(0);
          log.info(`BatchNum incremented to: ${vars["BatchNum"]}`);
        }

        log.stepPass('All dropdown options verified for Today Only successfully');
      } catch (e) {
        await log.stepFail(page, 'Selecting Today Only radio or verifying dropdown options failed');
        throw e;
      }

      // ── Select Next Business Day radio and verify dropdown options ─────────
      log.step('Selecting Next Business Day radio button and verifying dropdown options');
      try {
        await correspondentPortalPage.Next_Business_Day_Radio_Button.check();
        await expect(correspondentPortalPage.Next_Business_Day_Radio_Button).toBeChecked();
        log.info('Next Business Day radio button is checked');

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.hover();
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click({ force: true });
        log.info('Pricing return time dropdown reopened via hover and force click');

        //while (parseFloat(String(vars["BatchNum"])) <= parseFloat(String(vars["CountOfOptionsDropdown"]))) {
        for (let dataIdx = parseInt(vars["BatchNum"]); dataIdx <= parseInt(vars["CountOfOptionsDropdown"]); dataIdx++) {
          log.info(`Processing dropdown option ${dataIdx} of ${vars["CountOfOptionsDropdown"]} for Next Business Day`);

          const profileName = 'bulk batch to bid request';
          const profile = testDataManager.getProfileByName(profileName);
          if (profile && profile.data) {
            const batchTime = profile.data[dataIdx - 1]['batch time'];
            vars["batch time"] = batchTime;
            log.info(`Loaded batch time: ${vars["batch time"]}`);
          }

          vars["BatchTime"] = vars["batch time"];
          await expect(correspondentPortalPage.Pricing_Return_Time.locator(`option[value="${vars["BatchTime"]}"]`)).toBeAttached();
          log.info(`Dropdown option verified as attached for batch time: ${vars["BatchTime"]}`);

          //await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();

          // await expect(chaseFieldNamePage.Option_in_PricingReturn_Dropdown).toBeVisible();
          vars["BatchNum"] = (parseFloat(String("1")) + parseFloat(String(vars["BatchNum"]))).toFixed(0);
          log.info(`BatchNum incremented to: ${vars["BatchNum"]}`);
        }
        //}

        log.stepPass('All dropdown options verified for Next Business Day successfully');
      } catch (e) {
        await log.stepFail(page, 'Selecting Next Business Day radio or verifying dropdown options failed');
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